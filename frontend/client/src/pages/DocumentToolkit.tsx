import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft, BookOpen, Brain, Check, CheckCircle2, ChevronLeft, ChevronRight, FileText,
  Headphones, Loader2, Map, MessageCircle, RotateCcw, Search, Sparkles, Target,
  Trash2, Upload, X, ZoomIn, ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { captureApiHeaders, captureApiUrl } from "@/lib/captureApi";
import MindMap, { type MindMapBranch, type MindMapData } from "@/components/MindMap";
import SketchnoteNotebook from "@/components/notes/SketchnoteNotebook";
import CuratedStudyNotebook from "@/components/notes/CuratedStudyNotebook";

type ToolId = "notes" | "mind-map" | "flashcards" | "quizzes" | "podcast" | "ask-ai" | "focus" | "questions";
type SourceRef = { page?: number | null; section?: string | null; paragraph?: number | null; quote: string };
type ToolRecord = { status: string; error?: string; config?: Record<string, unknown>; result?: Record<string, any>; updatedAt?: string };
type DocumentRecord = {
  id: string; title: string; filename: string; mimeType: string; fileSize: number; fileUrl: string;
  status: string; stage: string; error?: string; createdAt?: string; extractionMetadata?: Record<string, any>; extractedContent?: string;
  extractedCharacters?: number;
};

const tools: { id: ToolId; name: string; description: string; Icon: typeof FileText }[] = [
  { id: "notes", name: "Notes", description: "Structured summaries, key points, definitions, and quotes.", Icon: FileText },
  { id: "mind-map", name: "Mind Maps", description: "Explore the document’s topics and relationships.", Icon: Map },
  { id: "flashcards", name: "Flashcards", description: "Memorize key concepts with focused recall cards.", Icon: Brain },
  { id: "quizzes", name: "Quizzes", description: "Practice with clear multiple-choice and short-answer questions.", Icon: BookOpen },
  { id: "podcast", name: "Podcast", description: "Read a document-grounded study script and transcript.", Icon: Headphones },
  { id: "ask-ai", name: "Ask AI", description: "Ask questions and get answers from this document only.", Icon: MessageCircle },
  { id: "focus", name: "Focus", description: "Plan a focused study session around key concepts.", Icon: Target },
  { id: "questions", name: "Start Document Questions", description: "Open the validated question set generated from this source.", Icon: CheckCircle2 },
];

const configOptions: Partial<Record<ToolId, { key: string; label: string; choices: string[] }[]>> = {
  notes: [],
  "mind-map": [{ key: "levels", label: "Hierarchy", choices: ["3 levels", "5 levels", "7 levels"] }, { key: "detail", label: "Detail", choices: ["Concise", "Expanded"] }, { key: "examples", label: "Include examples", choices: ["On", "Off"] }, { key: "relationships", label: "Relationships", choices: ["On", "Off"] }, { key: "layout", label: "Canvas layout", choices: ["Radial", "Outline"] }],
  flashcards: [{ key: "count", label: "Cards", choices: ["5", "10", "20"] }, { key: "mode", label: "Mode", choices: ["Recall", "Application"] }, { key: "difficulty", label: "Difficulty", choices: ["Easy", "Mixed", "Hard"] }, { key: "format", label: "Format", choices: ["Term-definition", "Question-answer"] }],
  quizzes: [{ key: "count", label: "Questions", choices: ["5", "10", "20"] }, { key: "difficulty", label: "Difficulty", choices: ["Easy", "Mixed", "Hard"] }, { key: "types", label: "Question types", choices: ["Mixed", "Multiple choice", "Short answer"] }, { key: "explanations", label: "Explanations", choices: ["On", "Off"] }],
  podcast: [{ key: "length", label: "Episode length", choices: ["Short", "Medium", "Long"] }, { key: "tone", label: "Tone", choices: ["Clear", "Conversational", "Academic"] }, { key: "speakers", label: "Speakers", choices: ["1", "2"] }, { key: "language", label: "Language", choices: ["Document language", "English"] }, { key: "transcript", label: "Include transcript", choices: ["On", "Off"] }],
  "ask-ai": [{ key: "answerLength", label: "Answer length", choices: ["Concise", "Detailed"] }, { key: "explanation", label: "Explanation level", choices: ["Simple", "In depth"] }, { key: "citations", label: "Citations", choices: ["Show sources", "Hide sources"] }, { key: "language", label: "Language", choices: ["Document language", "English"] }],
  focus: [{ key: "duration", label: "Duration (minutes)", choices: ["15", "25", "45"] }, { key: "goal", label: "Learning goal", choices: ["Understand key concepts", "Memorize definitions", "Prepare for a quiz"] }, { key: "intensity", label: "Review intensity", choices: ["Light", "Balanced", "Intensive"] }, { key: "flashcards", label: "Include flashcards", choices: ["On", "Off"] }, { key: "quizzes", label: "Include quizzes", choices: ["On", "Off"] }, { key: "breaks", label: "Breaks", choices: ["No breaks", "5-minute breaks"] }],
};

function prettyStatus(status?: string) {
  return status ? status[0].toUpperCase() + status.slice(1) : "Not created";
}

function formatBytes(bytes: number) {
  if (!bytes) return "Size unavailable";
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function compactOption(option: string): string {
  const words = option.trim().split(/\s+/);
  return words.length > 16 ? `${words.slice(0, 16).join(" ")}…` : option;
}

const noteStyleChoices = [
  {
    id: "visual",
    title: "Interesting Notes (Notebook Replica)",
    description: "Exact visual replica of digital handwritten study notebook with spiral binding, colored section circles, hand-drawn diagrams, key points, and takeaways.",
  },
  {
    id: "standard",
    title: "Curated Study Notebook",
    description: "Structured curriculum-style study notebook with clear chapters, definitions, and curated visual concept flows.",
  },
];

function NotesConfiguration({
  config,
  onChange,
}: {
  config: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-extrabold text-gray-900">Choose your note style</h3>
        <p className="mt-1 text-xs text-gray-600">Turn this source into notes that match the way you learn.</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {noteStyleChoices.map(style => {
            const selected = (config.style || "standard") === style.id;
            return (
              <button
                key={style.id}
                type="button"
                aria-pressed={selected}
                onClick={() => onChange("style", style.id)}
                className={`rounded-2xl border-2 p-4 text-left transition ${
                  selected
                    ? "border-[#1b7a52] bg-emerald-50 shadow-xs"
                    : "border-gray-200 bg-white hover:border-emerald-200"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="block text-sm font-extrabold text-gray-900">{style.title}</span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border text-[11px] ${
                      selected ? "border-[#1b7a52] bg-[#1b7a52] text-white" : "border-gray-300 text-transparent"
                    }`}
                  >
                    ✓
                  </span>
                </div>
                <span className="mt-1.5 block text-xs leading-relaxed text-gray-600">{style.description}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/70 p-3.5 text-xs text-emerald-950 flex items-center gap-2.5 shadow-2xs">
        <Sparkles size={16} className="text-[#1b7a52] shrink-0" />
        <span>
          <strong>AI Auto-Curated:</strong> Key concepts, hand-drawn diagrams, definitions, and chapter takeaways are automatically generated according to your document content.
        </span>
      </div>
    </div>
  );
}

function mindMapData(result: Record<string, any>): MindMapData {
  if (Array.isArray(result.branches) && result.branches.length) {
    return {
      topic: result.topic || result.title || "Document Concepts",
      summary: result.summary || "",
      details: result.details || "",
      sourceReference: result.sourceReference,
      branches: result.branches.slice(0, 6).map((branch: any, branchIndex: number) => ({
        ...branch,
        id: branch.id || `branch-${branchIndex + 1}`,
        keyword: branch.keyword || branch.label || "Key Idea",
        summary: branch.summary || branch.detail || "",
        details: branch.details || branch.detail || "",
        children: (branch.children || []).slice(0, 4).map((child: any, childIndex: number) => ({
          ...child,
          id: child.id || `branch-${branchIndex + 1}-child-${childIndex + 1}`,
          keyword: child.keyword || child.label || "Related Idea",
          summary: child.summary || child.detail || "",
          details: child.details || child.detail || "",
        })),
      })) as MindMapBranch[],
    };
  }

  const legacyNodes = (result.nodes || []).slice(0, 10);
  const branchCount = Math.min(6, Math.max(4, Math.min(legacyNodes.length, 6)));
  const branchNodes = legacyNodes.slice(0, branchCount);
  const childPool = legacyNodes.slice(branchCount);
  return {
    topic: result.topic || branchNodes[0]?.label || result.title || "Document Concepts",
    summary: result.summary || "",
    details: result.details || "",
    sourceReference: result.sourceReference || branchNodes[0]?.sourceReference,
    branches: branchNodes.map((node: any, branchIndex: number) => {
      const children = childPool.length
        ? [0, 1].map(childIndex => childPool[(branchIndex * 2 + childIndex) % childPool.length])
        : [];
      return {
        id: `legacy-branch-${branchIndex + 1}`,
        keyword: node.label || `Idea ${branchIndex + 1}`,
        summary: node.detail || "",
        details: node.detail || "",
        sourceReference: node.sourceReference,
        children: children.map((child: any, childIndex: number) => ({
          id: `legacy-branch-${branchIndex + 1}-child-${childIndex + 1}`,
          keyword: child.label || "Key Idea",
          summary: child.detail || "",
          details: child.detail || "",
          sourceReference: child.sourceReference,
        })),
      };
    }),
  };
}

export default function DocumentToolkit({ documentId }: { documentId: string }) {
  const [, setLocation] = useLocation();
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [records, setRecords] = useState<Record<string, ToolRecord>>({});
  const [selected, setSelected] = useState<ToolId[]>([]);
  const [configuration, setConfiguration] = useState<Record<string, Record<string, unknown>>>({});
  const [configuring, setConfiguring] = useState<ToolId | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [active, setActive] = useState<ToolId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [aiProviderConfigured, setAiProviderConfigured] = useState(true);
  const [askText, setAskText] = useState("");
  const [askMessages, setAskMessages] = useState<{ role: string; content: string; sources?: { quote: string; sourceReference: SourceRef }[] }[]>([]);
  const [asking, setAsking] = useState(false);
  const [editingResult, setEditingResult] = useState(false);
  const [editedResult, setEditedResult] = useState("");
  const documentLoaded = useRef(false);

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const response = await fetch(captureApiUrl(path), {
      ...init,
      headers: { ...captureApiHeaders(), ...(init.headers || {}) },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.detail || `Request failed (${response.status}).`);
    return body;
  }, []);

  const refresh = useCallback(async () => {
    const [docResponse, toolResponse] = await Promise.all([
      documentLoaded.current ? Promise.resolve(null) : request(`/api/v1/documents/${encodeURIComponent(documentId)}`),
      request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`),
    ]);
    if (new URLSearchParams(window.location.search).get("documentId") !== documentId) return;
    if (docResponse?.document) {
      setDocument(docResponse.document);
      documentLoaded.current = true;
    }
    setDocument(current => current ? {
      ...current,
      status: toolResponse.status,
      stage: toolResponse.stage,
      extractedCharacters: toolResponse.extractedCharacters,
      extractionMetadata: toolResponse.extractionMetadata,
    } : current);
    setRecords(toolResponse.tools || {});
    setAiProviderConfigured(toolResponse.aiProviderConfigured);
    setAskMessages(toolResponse.tools?.["ask-ai"]?.result?.messages || []);
    setLoading(false);
    if (toolResponse.status === "failed") setError(docResponse.document.error || "The document could not be processed.");
  }, [documentId, request]);

  useEffect(() => {
    let cancelled = false;
    documentLoaded.current = false;
    setDocument(null);
    const poll = async () => {
      try {
        await refresh();
      } catch (cause) {
        if (!cancelled) {
          console.error("Could not load document toolkit:", cause);
          setError(cause instanceof Error ? cause.message : "Could not load this document.");
          setLoading(false);
        }
      }
      if (!cancelled) window.setTimeout(() => void poll(), 1800);
    };
    void poll();
    return () => { cancelled = true; };
  }, [refresh]);

  const selectedBusy = useMemo(() => Object.values(records).some(record => ["queued", "generating", "validating"].includes(record.status)), [records]);
  const openDocument = async () => {
    if (!document?.fileUrl) return;
    try {
      const response = await fetch(captureApiUrl(document.fileUrl), { headers: captureApiHeaders() });
      if (!response.ok) throw new Error(`Could not open the document (${response.status}).`);
      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (cause) {
      console.error("Could not preview document:", cause);
      setError(cause instanceof Error ? cause.message : "Could not preview the document.");
    }
  };
  const toggle = (id: ToolId) => setSelected(current => current.includes(id) ? current.filter(item => item !== id) : [...current, id]);
  const createSelected = async () => {
    if (!selected.length) return;
    setConfirming(false);
    setError("");
    const questions = selected.filter(id => id === "questions");
    const generatable = selected.filter(id => id !== "questions");
    try {
      if (generatable.length) {
        await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tools: generatable, config: configuration }),
        });
      }
      if (questions.length && records.questions?.status !== "ready") {
        await request(`/api/v1/documents/${encodeURIComponent(documentId)}/questions/retry`, { method: "POST" });
      }
      if (questions.length) {
        if (generatable.length) setActive(generatable[0]);
        else setLocation(`/learn?documentId=${encodeURIComponent(documentId)}&mode=questions`);
      }
      if (generatable.includes("notes")) setActive("notes");
      await refresh();
    } catch (cause) {
      console.error("Could not generate selected document tools:", cause);
      setError(cause instanceof Error ? cause.message : "Could not create the selected tools.");
    }
  };
  const retryTool = async (id: ToolId) => {
    try {
      const path = id === "questions"
        ? `/api/v1/documents/${encodeURIComponent(documentId)}/questions/retry`
        : `/api/v1/documents/${encodeURIComponent(documentId)}/tools/${id}/retry`;
      await request(path, { method: "POST" });
      await refresh();
    } catch (cause) {
      console.error("Could not retry document tool:", cause);
      setError(cause instanceof Error ? cause.message : "Could not retry this tool.");
    }
  };
  const saveEditedResult = async () => {
    if (!active) return;
    try {
      const result = JSON.parse(editedResult);
      await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools/${active}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });
      setEditingResult(false);
      await refresh();
    } catch (cause) {
      console.error("Could not save edited tool result:", cause);
      setError(cause instanceof Error ? cause.message : "Could not save edits. Keep the source references intact.");
    }
  };
  const exportResult = () => {
    if (!active || !records[active]?.result) return;
    const blob = new Blob([JSON.stringify(records[active].result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `${document?.filename || "document"}-${active}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
  const shareResult = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch (cause) {
      console.error("Could not copy workspace link:", cause);
      setError("Could not copy the workspace link. You can copy the page URL from your browser.");
    }
  };
  const deleteTool = async (id: ToolId) => {
    try {
      await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools/${id}`, { method: "DELETE" });
      setRecords(current => { const next = { ...current }; delete next[id]; return next; });
      if (active === id) setActive(null);
    } catch (cause) {
      console.error("Could not remove document tool:", cause);
      setError(cause instanceof Error ? cause.message : "Could not delete this result.");
    }
  };
  const generateNotes = async (style: string, options: Record<string, unknown>, regenerate = false) => {
    const config = { ...options, style, regenerate };
    setError("");
    setActive("notes");
    try {
      await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: ["notes"], config: { notes: config } }),
      });
      const requestedStyles = style === "both" ? ["standard", "visual"] : [style];
      for (let attempt = 0; attempt < 180; attempt++) {
        const latest = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`);
        setRecords(latest.tools || {});
        const noteRecord = latest.tools?.notes;
        if (noteRecord?.status === "failed") throw new Error(noteRecord.error || "Could not generate these notes.");
        const available = (noteRecord?.result?.versions || []).map((version: { style: string }) => version.style);
        if (noteRecord?.status === "ready" && requestedStyles.every(noteStyle => available.includes(noteStyle))) return;
        await new Promise(resolve => window.setTimeout(resolve, 750));
      }
      throw new Error("Note generation is taking longer than expected. Try again from the Notes workspace.");
    } catch (cause) {
      console.error("Could not generate document notes:", cause);
      setError(cause instanceof Error ? cause.message : "Could not generate notes. Please retry.");
      throw cause;
    }
  };
  const saveNoteResult = async (result: Record<string, any>) => {
    await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools/notes`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    await refresh();
  };
  const askDocument = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!askText.trim()) return;
    setAsking(true);
    try {
      const response = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: askText, config: configuration["ask-ai"] || {} }),
      });
      setAskMessages(response.messages || []);
      setAskText("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not ask about this document.");
    } finally {
      setAsking(false);
    }
  };
  const retryIngestion = async (kind: "extract" | "ocr") => {
    try {
      await request(`/api/v1/documents/${encodeURIComponent(documentId)}/${kind}`, { method: "POST" });
      setError("");
      await refresh();
    } catch (cause) {
      console.error(`Could not retry document ${kind}:`, cause);
      setError(cause instanceof Error ? cause.message : `Could not retry ${kind}.`);
    }
  };
  const createRelatedTool = async (toolId: ToolId) => {
    if (toolId === "questions") {
      setLocation(`/learn?documentId=${encodeURIComponent(documentId)}&mode=questions`);
      return;
    }
    setActive(toolId);
    try {
      await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools: [toolId], config: {} }),
      });
      for (let attempt = 0; attempt < 180; attempt++) {
        const latest = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/tools`);
        setRecords(latest.tools || {});
        if (latest.tools?.[toolId]?.status === "ready") return;
        if (latest.tools?.[toolId]?.status === "failed") throw new Error(latest.tools[toolId].error || `Could not create ${toolId}.`);
        await new Promise(resolve => window.setTimeout(resolve, 750));
      }
      throw new Error(`Creating ${toolId} is taking longer than expected.`);
    } catch (cause) {
      console.error(`Could not create ${toolId} from notes:`, cause);
      setError(cause instanceof Error ? cause.message : `Could not create ${toolId}.`);
    }
  };

  if (loading) return <div className="mx-auto flex min-h-[65vh] items-center justify-center gap-3 text-[#1b7a52]"><Loader2 className="animate-spin" /> Loading your document toolkit…</div>;
  if (!document) return <div className="mx-auto max-w-2xl p-8 text-center"><p className="font-bold text-gray-800">{error || "Document not found."}</p><Button className="mt-5" onClick={() => setLocation("/")}>Back to Upload</Button></div>;
  const isReady = document.status === "ready";

  return (
    <main className="mx-auto min-h-[calc(100vh-140px)] max-w-6xl px-4 py-6 sm:px-6 sm:py-9">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" onClick={() => setLocation("/")}><ArrowLeft className="mr-2" size={16} /> Back to Upload</Button>
        <Button variant="outline" onClick={() => void openDocument()}><FileText className="mr-2" size={16} /> Preview Document</Button>
      </div>
      <section className="rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm sm:p-7">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex min-w-0 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#1b7a52] text-white"><FileText size={23} /></div>
            <div className="min-w-0">
              <p className="text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">{isReady ? "Your document is ready. Unlock the full toolkit." : "Document ingestion"}</p>
              <h1 className="mt-1 truncate text-xl font-extrabold text-gray-900 sm:text-2xl">{document.title || document.filename}</h1>
              <p className="mt-1 text-sm text-gray-600">{document.mimeType || "File"} · {formatBytes(document.fileSize)} · {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : "Recently uploaded"}</p>
              <p className="mt-1 text-xs font-semibold text-gray-500">{isReady ? `Ready · ${document.extractionMetadata?.page_count ? `${document.extractionMetadata.page_count} pages · ` : document.extractionMetadata?.slide_count ? `${document.extractionMetadata.slide_count} slides · ` : ""}${document.extractedContent?.length.toLocaleString() || 0} extracted characters` : `${document.stage.replaceAll("_", " ")}…`}</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}><Upload className="mr-2" size={15} /> Change Document</Button>
        </div>
        {!isReady && document.status !== "failed" && <div className="mt-5 h-2 overflow-hidden rounded-full bg-emerald-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#1b7a52]" /></div>}
        {error && <p role="alert" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">{error}</p>}
      </section>
      {!aiProviderConfigured && isReady && <div role="status" className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>Source-only mode:</strong> tools use content extracted from your document. To enable AI-generated summaries, quizzes, and synthesized answers, configure <code className="rounded bg-amber-100 px-1">GROQ_API_KEY</code> and the Groq Python dependency on the backend, then restart it.
      </div>}

      {!isReady ? document.status === "failed" ? (
        <section className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-lg font-extrabold text-gray-900">We could not extract enough content from this document to create the toolkit.</h2>
          <p className="mt-2 text-sm text-gray-700">{document.error || error} Preview extracted content or try OCR for scanned PDFs and images.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => void retryIngestion("extract")} className="bg-[#1b7a52] text-white">Retry ingestion</Button>
            {/\.(pdf|png|jpe?g|webp|tiff?)$/i.test(document.filename) && <Button variant="outline" onClick={() => void retryIngestion("ocr")}>Run OCR</Button>}
            <Button variant="outline" onClick={() => setLocation("/")}>Upload another file</Button>
          </div>
          {document.extractedContent && <details className="mt-4"><summary className="cursor-pointer font-bold">Preview extracted content</summary><pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap rounded-xl bg-white p-4 text-xs">{document.extractedContent}</pre></details>}
        </section>
      ) : <div className="py-16 text-center"><Loader2 className="mx-auto animate-spin text-[#1b7a52]" size={34} /><p className="mt-4 font-bold capitalize text-gray-700">{document.stage.replaceAll("_", " ")}</p><p className="mt-2 text-sm text-gray-500">Extracting and grounding the learning tools in this upload.</p></div> : (
        <>
          {active === "notes" ? (
            <section className="mt-7">
              <NotesWorkspace
                documentTitle={document.title || document.filename}
                result={records.notes?.result || {}}
                status={records.notes?.status || ""}
                error={records.notes?.error || error}
                onBack={() => setActive(null)}
                onGenerate={generateNotes}
                onSave={saveNoteResult}
                onCreateTool={createRelatedTool}
              />
            </section>
          ) : active && records[active]?.status === "ready" ? (
            <section className="mt-7">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">Document workspace</p><h2 className="text-2xl font-extrabold text-gray-900">{tools.find(tool => tool.id === active)?.name}</h2></div>
                <div className="flex flex-wrap gap-2"><Button variant="outline" onClick={() => setActive(null)}><ArrowLeft className="mr-2" size={15} /> Toolkit</Button>{active !== "ask-ai" && <Button variant="outline" onClick={() => { setEditedResult(JSON.stringify(records[active].result, null, 2)); setEditingResult(!editingResult); }}>{editingResult ? <X className="mr-2" size={15} /> : null}{editingResult ? "Cancel Edit" : "Edit"}</Button>}<Button variant="outline" onClick={exportResult}>Export</Button><Button variant="outline" onClick={() => void shareResult()}>Share</Button><Button variant="outline" onClick={() => void retryTool(active)}><RotateCcw className="mr-2" size={15} /> Regenerate</Button><Button variant="outline" onClick={() => void deleteTool(active)}><Trash2 className="mr-2" size={15} /> Delete</Button></div>
              </div>
              {editingResult && <div className="mb-4 rounded-2xl border bg-white p-4"><label className="text-xs font-bold text-gray-600" htmlFor="tool-result-edit">Edit saved result JSON. Source references must remain unchanged.</label><textarea id="tool-result-edit" value={editedResult} onChange={event => setEditedResult(event.target.value)} rows={10} className="mt-2 w-full rounded-xl border p-3 font-mono text-xs" /><Button onClick={() => void saveEditedResult()} className="mt-2 bg-[#1b7a52] text-white">Save changes</Button></div>}
              {active === "ask-ai" ? <div className="rounded-2xl border bg-white p-5">
                <p className="mb-4 text-sm text-gray-600">{records[active].result?.message as string}</p>
                <form onSubmit={event => void askDocument(event)} className="flex flex-col gap-2 sm:flex-row"><input aria-label="Ask about the document" value={askText} onChange={event => setAskText(event.target.value)} className="min-w-0 flex-1 rounded-xl border px-4 py-3 text-sm" placeholder="What does the document say about…?" /><Button disabled={asking || !askText.trim()} className="bg-[#1b7a52] text-white">{asking ? "Searching…" : "Ask"}</Button></form>
                <div className="mt-5 space-y-3">{askMessages.map((message, index) => <div key={index} className={`rounded-xl p-4 ${message.role === "assistant" ? "bg-gray-50" : "bg-emerald-50"}`}><p className="mb-1 text-[10px] font-extrabold uppercase tracking-wide text-gray-500">{message.role === "assistant" ? "Document answer" : "You"}</p><p className="whitespace-pre-wrap text-sm text-gray-800">{message.content}</p></div>)}</div>
              </div> : <ToolResult key={active} toolId={active} result={records[active].result || {}} />}
            </section>
          ) : (
            <>
              <div className="mb-4 mt-8 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">Your learning toolkit</p><h2 className="mt-1 text-2xl font-extrabold text-gray-900">Choose how you want to learn</h2><p className="mt-1 text-sm text-gray-600">Select one or more tools. Every result stays linked to this document.</p></div>
                <div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => setSelected(tools.map(tool => tool.id))}>Select All</Button><Button variant="outline" size="sm" onClick={() => setSelected([])}>Clear Selection</Button></div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {tools.map(({ id, name, description, Icon }) => {
                  const chosen = selected.includes(id);
                  const record = records[id];
                  const status = record?.status || (id === "questions" && document.status === "ready" ? "ready" : "");
                  return <article key={id} className={`group relative rounded-2xl border-2 p-4 transition hover:-translate-y-0.5 hover:shadow-md ${chosen ? "border-[#1b7a52] bg-emerald-50/70" : "border-gray-200 bg-white hover:border-emerald-200"}`}>
                    <button type="button" aria-label={`${chosen ? "Deselect" : "Select"} ${name}`} aria-pressed={chosen} onClick={() => toggle(id)} className="absolute inset-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1b7a52] focus:ring-offset-2" />
                    <div className="pointer-events-none flex items-start gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${chosen ? "bg-[#1b7a52] text-white" : "bg-gray-100 text-gray-700"}`}><Icon size={19} /></span>
                      <span className="min-w-0 flex-1"><span className="block font-extrabold text-gray-900">{name}</span><span className="mt-1 block text-xs leading-relaxed text-gray-600">{description}</span></span>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${chosen ? "border-[#1b7a52] bg-[#1b7a52] text-white" : "border-gray-300 text-transparent"}`}><Check size={13} /></span>
                    </div>
                    <div className="relative z-[1] mt-4 flex items-center justify-between gap-2 border-t border-gray-100 pt-3">
                      <span className={`text-xs font-bold ${status === "ready" ? "text-emerald-700" : status === "failed" ? "text-red-700" : "text-gray-500"}`}>{status ? prettyStatus(status) : "Ready to create"}</span>
                      <div className="flex gap-2">
                        {configOptions[id] && <button type="button" aria-label={`Configure ${name}`} onClick={() => setConfiguring(configuring === id ? null : id)} className="rounded-md px-2 py-1 text-xs font-bold text-gray-600 hover:bg-gray-100">Configure</button>}
                        {status === "ready" && <button type="button" onClick={() => id === "questions" ? setLocation(`/learn?documentId=${encodeURIComponent(documentId)}&mode=questions`) : setActive(id)} className="rounded-md px-2 py-1 text-xs font-bold text-[#1b7a52] hover:bg-emerald-50">Open</button>}
                        {status === "failed" && <button type="button" onClick={() => void retryTool(id)} className="rounded-md px-2 py-1 text-xs font-bold text-red-700">Retry</button>}
                      </div>
                    </div>
                    {configuring === id && <div className="relative z-[1] mt-3 border-t pt-3">{id === "notes" ? <NotesConfiguration config={configuration.notes || {}} onChange={(key, value) => setConfiguration(current => ({ ...current, notes: { ...(current.notes || {}), [key]: value } }))} /> : <div className="grid grid-cols-2 gap-2">{configOptions[id]?.map(option => <label key={option.key} className="text-[11px] font-bold text-gray-600">{option.label}<select aria-label={`${name} ${option.label}`} value={String(configuration[id]?.[option.key] ?? option.choices[0])} onChange={event => setConfiguration(current => ({ ...current, [id]: { ...(current[id] || {}), [option.key]: option.key === "count" || option.key === "duration" || option.key === "rounds" ? Number(event.target.value) : event.target.value } }))} className="mt-1 block w-full rounded-lg border bg-white p-2 text-xs font-medium text-gray-800">{option.choices.map(choice => <option key={choice} value={choice.match(/^\d+$/) ? Number(choice) : choice}>{choice}</option>)}</select></label>)}</div>}</div>}
                  </article>;
                })}
              </div>
              {Object.keys(records).length > 0 && <section className="mt-8 rounded-2xl border bg-white p-5">
                <div className="flex items-center gap-2"><Sparkles size={17} className="text-[#1b7a52]" /><h3 className="font-extrabold text-gray-900">Results workspace</h3>{selectedBusy && <Loader2 size={15} className="animate-spin text-[#1b7a52]" />}</div>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{Object.entries(records).map(([key, record]) => <div key={key} className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 p-3"><div className="min-w-0"><p className="truncate text-sm font-bold capitalize text-gray-800">{tools.find(tool => tool.id === key)?.name || key}</p><p className={`text-xs ${record.status === "failed" ? "text-red-700" : record.status === "ready" ? "text-emerald-700" : "text-gray-500"}`}>{prettyStatus(record.status)}{record.error ? ` · ${record.error}` : ""}</p></div><div className="flex shrink-0 gap-1">{record.status === "ready" && <button aria-label={`Open ${key}`} onClick={() => key === "questions" ? setLocation(`/learn?documentId=${encodeURIComponent(documentId)}&mode=questions`) : setActive(key as ToolId)} className="rounded-lg px-2 py-1 text-xs font-bold text-[#1b7a52] hover:bg-white">Open</button>}{record.status === "failed" && <button onClick={() => void retryTool(key as ToolId)} className="rounded-lg px-2 py-1 text-xs font-bold text-[#1b7a52]">Retry</button>}</div></div>)}</div>
              </section>}
              <div className="sticky bottom-3 mt-6 flex justify-end"><Button disabled={!selected.length} onClick={() => setConfirming(true)} className="min-h-12 bg-[#1b7a52] px-7 text-white shadow-lg hover:bg-[#156443]">{selectedBusy ? <Loader2 className="mr-2 animate-spin" size={16} /> : <Sparkles className="mr-2" size={16} />}Create Selected Tools{selected.length ? ` (${selected.length})` : ""}</Button></div>
            </>
          )}
        </>
      )}
      {confirming && <div role="presentation" className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setConfirming(false)}>
        <section role="dialog" aria-modal="true" aria-labelledby="confirm-tool-generation" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" onClick={event => event.stopPropagation()}>
          <h2 id="confirm-tool-generation" className="text-xl font-extrabold text-gray-900">Create tools from this document?</h2>
          <p className="mt-2 truncate text-sm text-gray-600">Source: <strong>{document.title || document.filename}</strong></p>
          <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">Selected tools</p>
          <ul className="mt-2 space-y-2">{selected.map(id => <li key={id} className="flex items-center gap-2 text-sm font-semibold text-gray-800"><Check size={15} className="text-[#1b7a52]" />{tools.find(tool => tool.id === id)?.name}</li>)}</ul>
          <div className="mt-6 flex justify-end gap-2"><Button variant="outline" onClick={() => setConfirming(false)}>Cancel</Button><Button onClick={() => void createSelected()} className="bg-[#1b7a52] text-white">Create Selected Tools</Button></div>
        </section>
      </div>}
    </main>
  );
}

function NotesWorkspace({
  documentTitle,
  result,
  status,
  error,
  onBack,
  onGenerate,
  onSave,
  onCreateTool,
}: {
  documentTitle: string;
  result: Record<string, any>;
  status: string;
  error: string;
  onBack: () => void;
  onGenerate: (style: string, options: Record<string, unknown>, regenerate?: boolean) => Promise<void>;
  onSave: (result: Record<string, any>) => Promise<void>;
  onCreateTool: (toolId: ToolId) => Promise<void>;
}) {
  const legacySections = (result.items || []).map((item: any, index: number) => ({
    id: `legacy-${index + 1}`,
    number: index + 1,
    title: item.title || `Section ${index + 1}`,
    summary: item.text || "",
    paragraphs: item.text ? [item.text] : [],
    keyPoints: item.text ? [item.text] : [],
    takeaway: "",
    sourceReference: item.sourceReference,
  }));
  const versions: Record<string, any> = Object.fromEntries(
    Array.isArray(result.versions)
      ? result.versions.filter((version: any) => ["standard", "visual"].includes(version.style)).map((version: any) => [version.style, version])
      : legacySections.length ? [["standard", {
          style: "standard",
          title: result.title || `${documentTitle} — Study Notes`,
          overview: result.summary || "",
          sections: legacySections,
        }]] : [],
  );

  // Automatically synthesize visual notebook pages from standard sections if visual version is not yet created
  if (versions.standard && !versions.visual) {
    versions.visual = {
      style: "visual",
      title: versions.standard.title,
      subtitle: versions.standard.subtitle || "Concepts You Actually Need",
      overview: versions.standard.overview,
      learningObjectives: versions.standard.learningObjectives,
      pages: (versions.standard.sections || []).map((sec: any, idx: number) => ({
        id: sec.id || `page-${idx + 1}`,
        pageNumber: Math.floor(idx / 2) + 2,
        sectionNumber: sec.number || idx + 1,
        heading: sec.title || `Concept ${idx + 1}`,
        explanation: sec.summary || (sec.paragraphs?.[0] ?? ""),
        keyPoints: (sec.keyPoints && sec.keyPoints.length) ? sec.keyPoints : (sec.paragraphs || [sec.summary || "Core concept"]).slice(0, 4),
        highlightedTerms: sec.definitions || [],
        visual: sec.visual || { type: "steps", labels: [sec.title || "Concept", "Mechanism", "Impact"] },
        takeaway: sec.takeaway || (sec.paragraphs?.[0] ? `Key takeaway: ${sec.paragraphs[0]}` : ""),
        sourceReference: sec.sourceReference,
      })),
    };
  }

  const availableStyles = ["visual", "standard"].filter(style => versions[style]);
  const [selectedStyle, setSelectedStyle] = useState<string>(availableStyles[0] || "visual");
  const [showChooser, setShowChooser] = useState(availableStyles.length === 0);
  const [selectedGenerationStyle, setSelectedGenerationStyle] = useState("visual");
  const [options, setOptions] = useState<Record<string, unknown>>(result.config || {});
  const [activePage, setActivePage] = useState(0);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(100);
  const [showSource, setShowSource] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<Record<string, any>>({});
  const [errorMessage, setErrorMessage] = useState("");
  const version = versions[selectedStyle];
  const entries: any[] = version?.[selectedStyle === "visual" ? "pages" : "sections"] || [];
  const filteredEntries = entries.filter((entry: any) => JSON.stringify(entry).toLowerCase().includes(search.toLowerCase()));
  const currentEntry = filteredEntries[Math.min(activePage, Math.max(0, filteredEntries.length - 1))];
  const resultForEdit = editing ? draft : result;
  const editableVersion = () => (draft.versions || []).find((entry: any) => entry.style === selectedStyle);

  useEffect(() => {
    if (availableStyles.length && !availableStyles.includes(selectedStyle)) setSelectedStyle(availableStyles[0]);
  }, [availableStyles.join("|"), selectedStyle]);

  const chooseStyle = (style: string) => {
    setSelectedGenerationStyle(style);
    setShowChooser(false);
    if (style !== "both" && versions[style]) {
      setSelectedStyle(style);
      setActivePage(0);
    }
  };
  const generate = async (regenerate = false) => {
    setErrorMessage("");
    try {
      await onGenerate(selectedGenerationStyle, options, regenerate);
      setShowChooser(false);
      setSelectedStyle(selectedGenerationStyle === "visual" ? "visual" : "standard");
      setActivePage(0);
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Could not generate these notes.");
    }
  };
  const beginEdit = () => {
    setDraft(JSON.parse(JSON.stringify(result)));
    setEditing(true);
  };
  const updateEntry = (field: string, value: unknown) => {
    const next = { ...draft, versions: [...(draft.versions || [])] };
    const versionIndex = next.versions.findIndex((entry: any) => entry.style === selectedStyle);
    if (versionIndex < 0) return;
    const versionDraft = { ...next.versions[versionIndex] };
    const collection = selectedStyle === "visual" ? "pages" : "sections";
    versionDraft[collection] = [...versionDraft[collection]];
    versionDraft[collection][activePage] = { ...versionDraft[collection][activePage], [field]: value };
    next.versions[versionIndex] = versionDraft;
    setDraft(next);
  };
  const saveEdits = async () => {
    setSaving(true);
    setErrorMessage("");
    try {
      await onSave(draft);
      setEditing(false);
    } catch (cause) {
      setErrorMessage(cause instanceof Error ? cause.message : "Could not save your note edits.");
    } finally {
      setSaving(false);
    }
  };

  return <div className="space-y-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <button onClick={onBack} className="mb-2 inline-flex items-center text-xs font-bold text-gray-600 hover:text-[#1b7a52]"><ArrowLeft size={14} className="mr-1" /> Toolkit</button>
        <p className="text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">Notes workspace</p>
        <h2 className="mt-1 text-2xl font-extrabold text-gray-900">{version?.title || documentTitle}</h2>
        <p className="mt-1 text-sm text-gray-600">Source: {documentTitle}</p>
      </div>
      {version && !showChooser && <div className="flex flex-wrap gap-2">
        {availableStyles.length < 2 && (
          <Button
            variant="outline"
            onClick={() => {
              setShowChooser(true);
              setSelectedGenerationStyle(availableStyles.includes("standard") ? "visual" : "standard");
            }}
          >
            {availableStyles.includes("standard") ? "Generate Visual Sketchnotes" : "Generate Curated Notebook"}
          </Button>
        )}
        <Button variant="outline" onClick={beginEdit} disabled={editing}>Edit</Button>
        {editing && <><Button variant="outline" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={() => void saveEdits()} disabled={saving} className="bg-[#1b7a52] text-white">{saving ? "Saving…" : "Save changes"}</Button></>}
        <Button variant="outline" onClick={() => void generate(true)} disabled={status === "queued" || status === "generating" || status === "validating"}><RotateCcw size={14} className="mr-2" /> Regenerate</Button>
      </div>}
    </div>

    {(error || errorMessage) && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{errorMessage || error}</p>}
    {["queued", "generating", "validating"].includes(status) && <div role="status" className="flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-semibold text-[#1b7a52]"><Loader2 size={16} className="animate-spin" /> Reading source, organizing concepts, and building your notes…</div>}

    {showChooser || !version ? <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-7">
      <NotesConfiguration
        config={{ ...options, style: selectedGenerationStyle }}
        onChange={(key, value) => key === "style" ? chooseStyle(String(value)) : setOptions(current => ({ ...current, [key]: value }))}
      />
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {availableStyles.length > 0 && <Button variant="outline" onClick={() => setShowChooser(false)}>Return to notes</Button>}
        <Button onClick={() => void generate(false)} disabled={["queued", "generating", "validating"].includes(status)} className="bg-[#1b7a52] text-white">{status === "generating" ? "Generating…" : "Generate Notes"}</Button>
      </div>
    </div> : <>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-3">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Note style">
          {availableStyles.map(style => (
            <button
              key={style}
              role="tab"
              aria-selected={selectedStyle === style}
              onClick={() => {
                setSelectedStyle(style);
                setActivePage(0);
                setShowSource(false);
              }}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                selectedStyle === style
                  ? "bg-[#1b7a52] text-white shadow-xs"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {style === "visual" ? "Interesting Notes (Notebook)" : "Curated Summary"}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="relative">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              aria-label="Search within notes"
              value={search}
              onChange={event => {
                setSearch(event.target.value);
                setActivePage(0);
              }}
              placeholder="Search notes"
              className="w-44 rounded-lg border py-2 pl-8 pr-3 text-xs"
            />
          </label>
          <button
            aria-label="Zoom out"
            onClick={() => setZoom(value => Math.max(75, value - 10))}
            className="rounded-lg border p-2 hover:bg-gray-50"
          >
            <ZoomOut size={15} />
          </button>
          <span className="text-xs font-semibold text-gray-500 w-9 text-center">{zoom}%</span>
          <button
            aria-label="Zoom in"
            onClick={() => setZoom(value => Math.min(130, value + 10))}
            className="rounded-lg border p-2 hover:bg-gray-50"
          >
            <ZoomIn size={15} />
          </button>
        </div>
      </div>

      {selectedStyle === "standard" ? (
        filteredEntries.length > 0 ? (
          <CuratedStudyNotebook
            data={{
              title: version.title || documentTitle,
              subtitle: version.subtitle,
              overview: version.overview,
              learningObjectives: version.learningObjectives,
              sections: filteredEntries,
            }}
            activeSection={activePage}
            onSectionChange={setActivePage}
            zoom={zoom}
            editing={editing}
            onEditSection={(idx, field, val) => updateEntry(field, val)}
          />
        ) : (
          <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500">
            No sections match your search query.
          </div>
        )
      ) : filteredEntries.length > 0 ? (
        <SketchnoteNotebook
          title={version.title || documentTitle}
          subtitle={version.subtitle}
          overview={version.overview}
          learningObjectives={version.learningObjectives}
          entries={filteredEntries}
          activePage={activePage}
          onPageChange={setActivePage}
          zoom={zoom}
          editing={editing}
          onEditEntry={(idx, field, val) => updateEntry(field, val)}
        />
      ) : (
        <div className="rounded-2xl border bg-white p-8 text-center text-sm text-gray-500 font-hand">
          No sketchnote concepts match your search query.
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4">
        <span className="text-xs font-bold uppercase tracking-wide text-gray-500">Continue learning from these notes</span>
        <div className="flex flex-wrap gap-2">{[
          ["flashcards", "Create flashcards"], ["quizzes", "Create quiz"], ["mind-map", "Create mind map"],
          ["questions", "Document questions"], ["ask-ai", "Ask AI"], ["focus", "Start Focus"],
        ].map(([tool, label]) => <Button key={tool} size="sm" variant="outline" onClick={() => void onCreateTool(tool as ToolId)}>{label}</Button>)}</div>
      </div>
    </>}
  </div>;
}

function ToolResult({ toolId, result }: { toolId: ToolId; result: Record<string, any> }) {
  const [revealed, setRevealed] = useState<number[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState<number[]>([]);
  const [seconds, setSeconds] = useState((Number(result.durationMinutes) || 25) * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  useEffect(() => {
    if (!timerRunning) return;
    const interval = window.setInterval(() => setSeconds(value => {
      if (value <= 1) {
        setTimerRunning(false);
        return 0;
      }
      return value - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [timerRunning]);
  const items = result.items || [];
  const cards = result.cards || [];
  const nodes = result.nodes || [];
  const data = cards.length ? cards : nodes.length ? nodes : items;
  const generationNotice = result.generationNotice as string | undefined;
  if (toolId === "mind-map") return <MindMap data={mindMapData(result)} />;
  return <div className="space-y-3">
    {generationNotice && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">{generationNotice}</div>}
    {toolId === "focus" && <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl bg-emerald-50 p-4"><div><p className="text-lg font-extrabold text-[#1b7a52]">{Math.floor(seconds / 60).toString().padStart(2, "0")}:{(seconds % 60).toString().padStart(2, "0")}</p><p className="text-sm font-bold text-gray-700">{result.goal}</p></div><div className="flex gap-2"><Button size="sm" onClick={() => setTimerRunning(!timerRunning)} className="bg-[#1b7a52] text-white">{timerRunning ? "Pause" : seconds ? "Start focus" : "Complete"}</Button><Button size="sm" variant="outline" onClick={() => { setTimerRunning(false); setSeconds((Number(result.durationMinutes) || 25) * 60); }}>Reset</Button></div></div>}
    {toolId === "podcast" && <article className="rounded-2xl border bg-white p-5"><div className="mb-3 flex justify-end"><Button size="sm" variant="outline" onClick={() => { if (!("speechSynthesis" in window)) return; if (speaking) { window.speechSynthesis.cancel(); setSpeaking(false); } else { const speech = new SpeechSynthesisUtterance(result.transcript || ""); speech.onend = () => setSpeaking(false); window.speechSynthesis.speak(speech); setSpeaking(true); } }}>{speaking ? "Stop audio" : "Play audio explanation"}</Button></div><p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{result.transcript}</p></article>}
    {toolId === "quizzes" && items.map((item: any, index: number) => {
      const isSubmitted = submitted.includes(index);
      const isCorrect = answers[index]?.trim().toLowerCase() === String(item.correctAnswer).trim().toLowerCase();
      const isMultipleChoice = String(item.type).toLowerCase().replace("_", "-") === "multiple-choice";
      return <article key={item.id || index} className="rounded-2xl border bg-white p-5 shadow-sm sm:p-7">
        <p className="mb-3 text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#1b7a52]">{isMultipleChoice ? "Interactive checkpoint" : item.type} · {item.difficulty}</p>
        <p className="text-lg font-extrabold leading-snug text-gray-900">{item.question}</p>
        {String(item.type).toLowerCase().replace("_", "-") === "short-answer"
          ? <textarea aria-label={`Answer quiz question ${index + 1}`} disabled={isSubmitted} value={answers[index] || ""} onChange={event => setAnswers(current => ({ ...current, [index]: event.target.value }))} className="mt-4 w-full rounded-xl border p-3 text-sm" placeholder="Write your answer…" />
          : <div className="mt-4 space-y-2.5">{(item.options || []).map((option: string, optionIndex: number) => <button key={option} aria-label={isMultipleChoice ? `Option ${String.fromCharCode(65 + optionIndex)}: ${option}` : option} disabled={isSubmitted} onClick={() => setAnswers(current => ({ ...current, [index]: option }))} className={`flex w-full items-start gap-3 rounded-xl border-2 p-3.5 text-left text-sm transition sm:p-4 ${answers[index] === option ? "border-[#1b7a52] bg-emerald-50 text-[#145c3e]" : "border-gray-200 bg-white text-gray-800 hover:border-gray-400"}`}>
            {isMultipleChoice && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-extrabold text-gray-700">{String.fromCharCode(65 + optionIndex)}</span>}
            <span className="pt-1">{isMultipleChoice ? compactOption(option) : option}</span>
          </button>)}</div>}
        {isSubmitted
          ? <div className={`mt-4 rounded-xl p-4 text-sm ${isCorrect ? "bg-green-50 text-green-900" : "bg-amber-50 text-amber-950"}`}>
              <strong>{isCorrect ? "Correct!" : "Not quite — here’s why."}</strong>
              {!isCorrect && <>
                <p className="mt-2"><strong>Correct answer:</strong> {item.correctAnswer}</p>
                <p className="mt-2">{item.explanation}</p>
                {item.sourceReference?.quote && <blockquote className="mt-3 border-l-2 border-[#1b7a52] pl-3 text-xs italic text-gray-700">
                  <span className="mb-1 block not-italic font-bold">Find it in your document{[item.sourceReference.section, item.sourceReference.page ? `Page ${item.sourceReference.page}` : null, item.sourceReference.paragraph ? `Paragraph ${item.sourceReference.paragraph}` : null].filter(Boolean).length ? ` · ${[item.sourceReference.section, item.sourceReference.page ? `Page ${item.sourceReference.page}` : null, item.sourceReference.paragraph ? `Paragraph ${item.sourceReference.paragraph}` : null].filter(Boolean).join(" · ")}` : ""}</span>
                  “{item.sourceReference.quote}”
                </blockquote>}
              </>}
            </div>
          : <Button size="sm" disabled={!answers[index]?.trim()} onClick={() => setSubmitted(current => [...current, index])} className="mt-4 bg-[#1b7a52] text-white">Check answer</Button>}
      </article>;
    })}
    {data.map((item: any, index: number) => {
      if (toolId === "quizzes") return null;
      const text = item.text || item.detail || item.back || item.question || item.front || item.match || "";
      return <article key={item.id || index} className="rounded-2xl border bg-white p-5 shadow-sm">
        {cards.length > 0 && <><p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-[#1b7a52]">Flashcard {index + 1}</p><p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{revealed.includes(index) ? item.back : item.front}</p><Button size="sm" variant="outline" onClick={() => setRevealed(current => current.includes(index) ? current.filter(value => value !== index) : [...current, index])} className="mt-3">{revealed.includes(index) ? "Show prompt" : "Reveal answer"}</Button></>}
        {!cards.length && <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-800">{text || item.question}</p>}
        {item.options?.length > 0 && <ul className="mt-3 list-inside list-disc text-sm text-gray-700">{item.options.map((option: string) => <li key={option}>{option}</li>)}</ul>}
        {item.correctAnswer && <p className="mt-3 text-sm text-gray-700"><strong>Answer:</strong> {item.correctAnswer} · {item.explanation}</p>}
      </article>;
    })}
  </div>;
}
