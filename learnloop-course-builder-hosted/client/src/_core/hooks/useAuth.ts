import { useState } from "react";

type PreviewUser = { name: string; email: string } | null;

export function useAuth() {
  const [user] = useState<PreviewUser>(null);
  return { user, loading: false, logout: async () => undefined };
}
