import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(options?: UseAuthOptions) {
  // Login is started via startLogin() in the effect below, only when we actually
  // navigate — never during render. startLogin() mints a one-time nonce + writes
  // the state cookie, so calling it per render would overwrite the cookie and
  // desync it from an in-flight login's `state`.
  const { redirectOnUnauthenticated = false, redirectPath } = options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });
  const profileQuery = trpc.user.getLearnerProfile.useQuery(undefined, {
    enabled: Boolean(meQuery.data),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        // continue logout sequence
      }
    } finally {
      try {
        sessionStorage.removeItem("manus-cookie");
        localStorage.removeItem("manus-runtime-user-info");
      } catch {}
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
      window.location.href = "/onboarding";
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    const identity = meQuery.data;
    const profile = profileQuery.data;
    const identityName = identity?.name?.trim();
    const usableIdentityName = identityName && !["hackathon user", "demo user", "test user"].includes(identityName.toLowerCase())
      ? identityName
      : "";
    const fullName = profile?.fullName?.trim() || usableIdentityName;
    const email = profile?.email || identity?.email || "";
    const displayName = profile?.displayName?.trim() || fullName || email.split("@", 1)[0] || "New Learner";
    return {
      user: identity ? {
        ...identity,
        name: displayName,
        email,
        avatarUrl: profile?.avatarUrl || "",
        profile,
      } : null,
      profile: profile || null,
      loading: meQuery.isLoading || Boolean(identity && profileQuery.isLoading),
      error: meQuery.error || profileQuery.error || null,
      isAuthenticated: Boolean(identity),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    profileQuery.data,
    profileQuery.error,
    profileQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.loading || state.user) return;
    if (typeof window === "undefined") return;
    if (redirectPath && window.location.pathname === redirectPath) return;

    // Navigate at this moment only. startLogin() mints the nonce + cookie itself.
    if (redirectPath) {
      window.location.href = redirectPath;
    } else {
      startLogin();
    }
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.loading,
    state.user,
  ]);

  return {
    ...state,
    refresh: async () => {
      const identity = await meQuery.refetch();
      if (identity.data) await profileQuery.refetch();
      return identity;
    },
    logout,
  };
}
