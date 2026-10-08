export type AdapterName = "open-notebook" | "surfsense" | "notebookllama";

export type AdapterCapabilities = {
  canDiscover: boolean;
  canFetch: boolean;
  canPushArtifacts: boolean;
  supportsIncrementalCursor: boolean;
};

export type ExternalResearchItem = {
  externalId: string;
  title: string;
  kind: "document" | "webpage" | "video" | "audio" | "note" | "artifact";
  sourceUrl?: string;
  excerpt?: string;
  publishedAt?: string;
  metadata: Record<string, string | number | boolean | null>;
};

export type AdapterCheckpoint = { cursor?: string; itemCount: number; completedAt: string };

export interface ResearchAdapter {
  readonly name: AdapterName;
  capabilities(): Promise<AdapterCapabilities>;
  discover(cursor?: string): AsyncIterable<ExternalResearchItem>;
  fetch(item: ExternalResearchItem): Promise<ExternalResearchItem>;
}

/**
 * The adapters intentionally start as transport-neutral boundaries. Concrete REST,
 * MCP, and LlamaCloud clients can be added without allowing upstream schemas to
 * leak into the canonical workspace database.
 */
export const adapterRegistry: Record<AdapterName, AdapterCapabilities> = {
  "open-notebook": { canDiscover: true, canFetch: true, canPushArtifacts: false, supportsIncrementalCursor: true },
  surfsense: { canDiscover: true, canFetch: true, canPushArtifacts: true, supportsIncrementalCursor: true },
  notebookllama: { canDiscover: true, canFetch: true, canPushArtifacts: false, supportsIncrementalCursor: false },
};

export function normalizeExternalItem(item: ExternalResearchItem, adapter: AdapterName) {
  return {
    title: item.title,
    sourceType: item.kind === "webpage" ? "url" : item.kind === "artifact" ? "artifact" : item.kind === "document" ? "document" : "connector",
    url: item.sourceUrl,
    excerpt: item.excerpt,
    adapter,
    externalId: item.externalId,
    metadata: JSON.stringify(item.metadata),
  } as const;
}
