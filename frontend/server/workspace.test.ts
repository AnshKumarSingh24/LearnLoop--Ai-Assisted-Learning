import { describe, expect, it, vi } from "vitest";
import { resolveWorkspaceId } from "../client/src/lib/workspace";

describe("resolveWorkspaceId", () => {
  it("uses the workspace already loaded by the query", async () => {
    const refetch = vi.fn();
    await expect(resolveWorkspaceId({ data: { id: 7 }, refetch })).resolves.toBe(7);
    expect(refetch).not.toHaveBeenCalled();
  });

  it("refetches the workspace when upload starts before bootstrap finishes", async () => {
    const refetch = vi.fn().mockResolvedValue({ data: { id: 9 }, error: null });
    await expect(resolveWorkspaceId({ data: undefined, refetch })).resolves.toBe(9);
    expect(refetch).toHaveBeenCalledOnce();
  });

  it("surfaces a bootstrap error rather than attempting an unscoped upload", async () => {
    const error = new Error("Workspace service unavailable.");
    const refetch = vi.fn().mockResolvedValue({ data: undefined, error });
    await expect(resolveWorkspaceId({ data: undefined, refetch })).rejects.toBe(error);
  });
});
