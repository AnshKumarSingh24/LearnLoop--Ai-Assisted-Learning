import type { ReactNode } from "react";

const Provider = ({ children }: { children: ReactNode; client?: unknown; queryClient?: unknown }) => children;

export const trpc = {
  Provider,
  createClient: (_options?: unknown) => ({}),
  learnerProfile: {
    save: {
      useMutation: () => ({ mutate: (_input: unknown) => undefined }),
    },
  },
};
