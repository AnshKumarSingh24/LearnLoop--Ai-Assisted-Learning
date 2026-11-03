type WorkspaceQuery = {
  data: { id: number } | undefined;
  refetch: () => Promise<{
    data: { id: number } | undefined;
    error: unknown;
  }>;
};

export async function resolveWorkspaceId(query: WorkspaceQuery): Promise<number> {
  let workspaceId = query.data?.id;

  if (!workspaceId) {
    const result = await query.refetch();
    if (result.error) throw result.error;
    workspaceId = result.data?.id;
  }

  if (!workspaceId || !Number.isInteger(workspaceId) || workspaceId < 1) {
    throw new Error("Your learning workspace could not be loaded. Please try again.");
  }

  return workspaceId;
}
