import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function anonymousContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("knowledge canvas authorization", () => {
  it("rejects workspace bootstrap for anonymous users", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.workspace.bootstrap()).rejects.toThrow();
  });

  it("rejects canvas reads without a workspace session", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.workspace.canvas({ workspaceId: 1 })).rejects.toThrow();
  });

  it("rejects sync status reads without a workspace session", async () => {
    const caller = appRouter.createCaller(anonymousContext());
    await expect(caller.workspace.syncRuns({ workspaceId: 1 })).rejects.toThrow();
  });
});
