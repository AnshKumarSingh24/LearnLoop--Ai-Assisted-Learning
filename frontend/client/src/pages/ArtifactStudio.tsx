import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, FileText, Brain, BookOpen, Layers, Clock, GraduationCap, Loader2, ChevronRight, RotateCcw, Bookmark, Trash2, UploadCloud, Headphones, Play, Pause, ExternalLink } from 'lucide-react';
import { useLocation, useSearch } from 'wouter';
import { Button } from '../components/ui/button';
import { trpc } from '@/lib/trpc';
import { captureApiHeaders, captureApiUrl } from '@/lib/captureApi';
import { resolveWorkspaceId } from '@/lib/workspace';

type ArtifactType = 'mindmap' | 'summary' | 'flashcards' | 'key_concepts' | 'timeline' | 'study_guide' | 'podcast';

interface MindmapNode {
  id: string;
  label: string;
  children?: MindmapNode[];
}

interface Flashcard {
  front: string;
  back: string;
  difficulty: string;
}

interface KeyConcept {
  term: string;
  definition: string;
  importance: string;
}

interface TimelineEvent {
  label: string;
  description: string;
  order: number;
}

interface StudyArtifact {
  id: string;
  artifact_type: ArtifactType;
  title: string;
  source_title: string;
  mindmap?: MindmapNode;
  content?: string;
  flashcards?: Flashcard[];
  key_concepts?: KeyConcept[];
  timeline?: TimelineEvent[];
  generation_mode?: string | null;
  generation_notice?: string | null;
}

interface SavedArtifact extends StudyArtifact {
  savedAt: string;
}

const SAVED_ARTIFACTS_KEY = 'learnloop-saved-artifacts';

const ARTIFACT_OPTIONS: { type: ArtifactType; label: string; icon: React.ReactNode; desc: string; color: string }[] = [
  { type: 'mindmap', label: 'Mind Map', icon: <Brain size={22} />, desc: 'Visual concept hierarchy', color: '#7c3aed' },
  { type: 'summary', label: 'Summary', icon: <FileText size={22} />, desc: 'Condensed overview', color: '#2563eb' },
  { type: 'flashcards', label: 'Flashcards', icon: <Layers size={22} />, desc: 'Study & memorize', color: '#059669' },
  { type: 'key_concepts', label: 'Key Concepts', icon: <Sparkles size={22} />, desc: 'Important terms', color: '#d97706' },
  { type: 'timeline', label: 'Timeline', icon: <Clock size={22} />, desc: 'Sequence of events', color: '#dc2626' },
  { type: 'study_guide', label: 'Study Guide', icon: <GraduationCap size={22} />, desc: 'Comprehensive guide', color: '#0891b2' },
  { type: 'podcast', label: 'Podcast', icon: <Headphones size={22} />, desc: 'Listen to a source-grounded recap', color: '#4f46e5' },
];

function MindmapView({ node, depth = 0 }: { node: MindmapNode; depth?: number }) {
  const colors = ['#7c3aed', '#2563eb', '#059669', '#d97706'];
  const color = colors[depth % colors.length];
  return (
    <div style={{ marginLeft: depth * 24 }} className="my-1">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color, opacity: 0.8 }} />
        <span className={`${depth === 0 ? 'text-lg font-extrabold text-gray-900' : depth === 1 ? 'font-bold text-gray-800 text-sm' : 'text-gray-600 text-sm'}`}>
          {node.label}
        </span>
      </div>
      {node.children?.map((child) => (
        <MindmapView key={child.id} node={child} depth={depth + 1} />
      ))}
    </div>
  );
}

function FlashcardView({ cards }: { cards: Flashcard[] }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const diffColors: Record<string, string> = { easy: '#059669', medium: '#d97706', hard: '#dc2626' };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {cards.map((card, i) => (
        <div
          key={i}
          onClick={() => setFlipped(prev => ({ ...prev, [i]: !prev[i] }))}
          className="cursor-pointer rounded-2xl border-2 p-5 min-h-[140px] flex flex-col justify-between transition-all hover:shadow-lg"
          style={{ borderColor: diffColors[card.difficulty] || '#d97706', background: flipped[i] ? '#f0fdf4' : '#fff' }}
        >
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-full" style={{ backgroundColor: `${diffColors[card.difficulty]}15`, color: diffColors[card.difficulty] }}>
              {card.difficulty}
            </span>
            <span className="text-[10px] text-gray-400 font-bold">{flipped[i] ? 'ANSWER' : 'QUESTION'}</span>
          </div>
          <p className={`text-sm leading-relaxed ${flipped[i] ? 'text-green-800 font-medium' : 'text-gray-800 font-bold'}`}>
            {flipped[i] ? card.back : card.front}
          </p>
          <p className="text-[10px] text-gray-400 mt-3 text-right">Click to flip</p>
        </div>
      ))}
    </div>
  );
}

function KeyConceptsView({ concepts }: { concepts: KeyConcept[] }) {
  const impColors: Record<string, string> = { high: '#dc2626', medium: '#d97706', low: '#6b7280' };
  return (
    <div className="space-y-3">
      {concepts.map((c, i) => (
        <div key={i} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0" style={{ backgroundColor: impColors[c.importance] || '#6b7280' }}>
            {i + 1}
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-sm">{c.term}</h4>
            <p className="text-gray-600 text-sm mt-0.5">{c.definition}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineView({ events }: { events: TimelineEvent[] }) {
  return (
    <div className="relative pl-8">
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full" />
      {events.sort((a, b) => a.order - b.order).map((e, i) => (
        <div key={i} className="relative mb-6 last:mb-0">
          <div className="absolute -left-5 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-500 shadow-sm" />
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm ml-2">
            <h4 className="font-bold text-gray-900 text-sm">{e.label}</h4>
            <p className="text-gray-600 text-sm mt-1">{e.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function MarkdownView({ content }: { content: string }) {
  // Simple markdown renderer for bold, headers, bullets
  const lines = content.split('\n');
  return (
    <div className="prose prose-sm max-w-none">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        if (trimmed.startsWith('## ')) return <h2 key={i} className="text-lg font-extrabold text-gray-900 mt-6 mb-2">{trimmed.slice(3)}</h2>;
        if (trimmed.startsWith('# ')) return <h1 key={i} className="text-xl font-extrabold text-gray-900 mt-6 mb-2">{trimmed.slice(2)}</h1>;
        if (trimmed.startsWith('### ')) return <h3 key={i} className="text-base font-bold text-gray-800 mt-4 mb-1">{trimmed.slice(4)}</h3>;
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const text = trimmed.slice(2);
          return <div key={i} className="flex items-start gap-2 ml-2 my-1"><span className="mt-2 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" /><span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} /></div>;
        }
        if (trimmed.match(/^\d+\. /)) {
          const text = trimmed.replace(/^\d+\.\s*/, '');
          return <div key={i} className="ml-2 my-1 text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
        }
        if (!trimmed) return <div key={i} className="h-2" />;
        return <p key={i} className="text-sm text-gray-700 leading-relaxed my-1" dangerouslySetInnerHTML={{ __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />;
      })}
    </div>
  );
}

function PodcastView({ content }: { content: string }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const togglePlayback = () => {
    if (!("speechSynthesis" in window)) return;
    if (playing) {
      window.speechSynthesis.cancel();
      setPlaying(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(content);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  return (
    <div className="space-y-4">
      <button type="button" onClick={togglePlayback} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-indigo-700">
        {playing ? <Pause size={16} /> : <Play size={16} />}
        {playing ? "Pause podcast" : "Listen to podcast"}
      </button>
      <article className="whitespace-pre-wrap rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 text-sm leading-7 text-gray-800">{content}</article>
    </div>
  );
}

export default function ArtifactStudio() {
  const [sourceText, setSourceText] = useState('');
  const [sourceTitle, setSourceTitle] = useState('');
  const [selectedType, setSelectedType] = useState<ArtifactType | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [artifact, setArtifact] = useState<StudyArtifact | null>(null);
  const [savedArtifacts, setSavedArtifacts] = useState<SavedArtifact[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [uploadingSource, setUploadingSource] = useState(false);
  const [uploadStatus, setUploadStatus] = useState("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState("");
  const uploadInputRef = useRef<HTMLInputElement>(null);
  const bootstrap = trpc.workspace.bootstrap.useQuery();

  const searchString = useSearch();
  const [, setLocation] = useLocation();
  const searchParams = new URLSearchParams(searchString);
  const captureId = searchParams.get("captureId");
  const initialType = searchParams.get("type") as ArtifactType | null;

  useEffect(() => {
    if (initialType) {
      setSelectedType(initialType);
    }
  }, [initialType]);

  useEffect(() => {
    if (captureId) {
      fetch(captureApiUrl(`/captures/${encodeURIComponent(captureId)}`), {
        headers: { "Authorization": "Bearer demo-user" }
      })
      .then(res => res.json())
      .then(data => {
        setSourceTitle(data.title || "");
        setSourceText(data.normalized_content || data.original_content || "");
      })
      .catch(err => console.error("Failed to load capture for artifact", err));
    }
  }, [captureId]);

  const handleSourceUpload = async (file: File) => {
    setError(null);
    setUploadingSource(true);
    setUploadStatus("Uploading");
    setArtifact(null);
    try {
      const workspaceId = await resolveWorkspaceId(bootstrap);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("workspaceId", String(workspaceId));
      const uploadResponse = await fetch(captureApiUrl("/api/v1/documents"), {
        method: "POST",
        headers: captureApiHeaders(),
        body: formData,
      });
      const uploadPayload = await uploadResponse.json().catch(() => ({}));
      if (!uploadResponse.ok) throw new Error(uploadPayload.detail || `Upload failed (${uploadResponse.status}).`);
      const documentId = uploadPayload.document?.id;
      if (!documentId) throw new Error("The document service did not return an ID for this upload.");
      setUploadedDocumentId(documentId);

      let isReady = false;
      for (let attempt = 0; attempt < 300; attempt++) {
        const statusResponse = await fetch(captureApiUrl(`/api/v1/documents/${encodeURIComponent(documentId)}/status`), {
          headers: captureApiHeaders(),
        });
        const statusPayload = await statusResponse.json().catch(() => ({}));
        if (!statusResponse.ok) throw new Error(statusPayload.detail || "Could not check document processing status.");
        setUploadStatus(statusPayload.stage || statusPayload.status || "Processing");
        if (statusPayload.status === "failed") throw new Error(statusPayload.error || "Document extraction failed.");
        if (statusPayload.status === "ready") {
          isReady = true;
          break;
        }
        await new Promise(resolve => window.setTimeout(resolve, 1000));
      }
      if (!isReady) throw new Error("Document processing is taking longer than expected. You can retry by uploading again.");

      const documentResponse = await fetch(captureApiUrl(`/api/v1/documents/${encodeURIComponent(documentId)}`), {
        headers: captureApiHeaders(),
      });
      const documentPayload = await documentResponse.json().catch(() => ({}));
      if (!documentResponse.ok) throw new Error(documentPayload.detail || "Could not load the extracted document.");
      const document = documentPayload.document;
      const extractedContent = String(document?.extractedContent || "");
      if (!extractedContent.trim()) throw new Error("The uploaded file did not contain enough readable text to create artifacts.");
      setSourceTitle(document.title || file.name);
      setSourceText(extractedContent);
      setUploadStatus("Ready");
    } catch (uploadError) {
      console.error("Artifact Studio source upload failed:", uploadError);
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload and extract this source.");
      setUploadStatus("Failed");
    } finally {
      setUploadingSource(false);
    }
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_ARTIFACTS_KEY) || '[]');
      if (Array.isArray(saved)) setSavedArtifacts(saved);
    } catch {
      // A malformed older value should not stop Artifact Studio from loading.
      setSavedArtifacts([]);
    }
  }, []);

  const saveArtifacts = (next: SavedArtifact[]) => {
    setSavedArtifacts(next);
    localStorage.setItem(SAVED_ARTIFACTS_KEY, JSON.stringify(next));
  };

  const handleSaveArtifact = () => {
    if (!artifact) return;
    const alreadySaved = savedArtifacts.some(item => item.id === artifact.id);
    if (alreadySaved) return;
    saveArtifacts([{ ...artifact, savedAt: new Date().toISOString() }, ...savedArtifacts]);
  };

  const handleOpenSavedArtifact = (saved: SavedArtifact) => {
    setArtifact(saved);
    setSourceTitle(saved.source_title || 'Saved source');
  };

  const handleDeleteSavedArtifact = (id: string) => {
    saveArtifacts(savedArtifacts.filter(item => item.id !== id));
  };

  const handleGenerate = async () => {
    if (!sourceText.trim() || !sourceTitle.trim() || !selectedType) return;
    setError(null);
    setIsGenerating(true);
    try {
      const res = await fetch(captureApiUrl("/artifacts/generate"), {
        method: 'POST',
        headers: { ...captureApiHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ source_text: sourceText, source_title: sourceTitle, artifact_type: selectedType })
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.detail || `Generation failed (${res.status}).`);
      }
      const data = await res.json();
      setArtifact(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderArtifact = () => {
    if (!artifact) return null;
    switch (artifact.artifact_type) {
      case 'mindmap': return artifact.mindmap ? <MindmapView node={artifact.mindmap} /> : null;
      case 'summary': return artifact.content ? <MarkdownView content={artifact.content} /> : null;
      case 'study_guide': return artifact.content ? <MarkdownView content={artifact.content} /> : null;
      case 'flashcards': return artifact.flashcards ? <FlashcardView cards={artifact.flashcards} /> : null;
      case 'key_concepts': return artifact.key_concepts ? <KeyConceptsView concepts={artifact.key_concepts} /> : null;
      case 'timeline': return artifact.timeline ? <TimelineView events={artifact.timeline} /> : null;
      case 'podcast': return artifact.content ? <PodcastView content={artifact.content} /> : null;
      default: return null;
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto font-sans min-h-screen">
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Sparkles className="text-purple-500" />
          Artifact Studio
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Transform any source material into interactive study artifacts.</p>
      </header>

      <input
        ref={uploadInputRef}
        type="file"
        className="hidden"
        accept=".pdf,.docx,.pptx,.txt,.md,.csv,.html,.htm,.png,.jpg,.jpeg,.webp,.tif,.tiff,.mp3,.m4a,.wav,.ogg,.webm"
        onChange={event => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void handleSourceUpload(file);
        }}
      />

      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl">
          <span className="font-semibold">Error:</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Input */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Source Material</h2>
            <button
              type="button"
              onClick={() => uploadInputRef.current?.click()}
              disabled={uploadingSource}
              className="mb-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-purple-300 bg-purple-50 px-4 py-3 text-sm font-bold text-purple-700 hover:bg-purple-100 disabled:opacity-60"
            >
              {uploadingSource ? <Loader2 className="animate-spin" size={18} /> : <UploadCloud size={18} />}
              {uploadingSource ? `Uploading and ${uploadStatus.toLowerCase()}...` : "Upload source material"}
            </button>
            {uploadingSource && <p role="status" className="mb-3 text-xs text-gray-500">Ingestion status: {uploadStatus}</p>}
            {uploadedDocumentId && !uploadingSource && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                <span>Extracted source is ready to use · {uploadStatus}</span>
                <button type="button" onClick={() => setLocation(`/learn?documentId=${encodeURIComponent(uploadedDocumentId)}`)} className="inline-flex items-center gap-1 font-bold hover:underline">
                  Open full toolkit <ExternalLink size={13} />
                </button>
              </div>
            )}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-gray-50/50"
                placeholder="e.g., Chapter 3: Cell Biology"
                value={sourceTitle}
                onChange={e => setSourceTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition bg-gray-50/50 resize-none font-mono text-sm"
                placeholder="Paste your notes, textbook text, or lecture transcript..."
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-bold mb-4 text-gray-800">Choose Artifact Type</h2>
            <div className="grid grid-cols-2 gap-3">
              {ARTIFACT_OPTIONS.map(opt => (
                <button
                  key={opt.type}
                  onClick={() => setSelectedType(opt.type)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                    selectedType === opt.type
                      ? 'border-current shadow-md scale-[1.02]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={{ color: selectedType === opt.type ? opt.color : undefined }}
                >
                  <div className="shrink-0 w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${opt.color}12`, color: opt.color }}>
                    {opt.icon}
                  </div>
                  <div>
                    <h3 className={`font-bold text-xs ${selectedType === opt.type ? '' : 'text-gray-800'}`}>{opt.label}</h3>
                    <p className="text-[10px] text-gray-500">{opt.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !sourceText || !sourceTitle || !selectedType}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 text-lg font-bold rounded-xl shadow-md disabled:opacity-50"
          >
            {isGenerating ? (
              <><Loader2 className="animate-spin mr-2" size={22} /> Generating...</>
            ) : (
              <><Sparkles className="mr-2" size={22} /> Generate Artifact</>
            )}
          </Button>
        </div>

        {/* Right: Output */}
        <div className="lg:col-span-3">
          {artifact ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="font-extrabold text-gray-900 text-lg">{artifact.title}</h2>
                  <p className="text-xs text-gray-500 mt-0.5">Generated from: {artifact.source_title}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveArtifact}
                    disabled={savedArtifacts.some(item => item.id === artifact.id)}
                    className="text-purple-600 hover:text-purple-800 disabled:text-gray-400 flex items-center gap-1 text-sm font-bold"
                  >
                    <Bookmark size={14} fill={savedArtifacts.some(item => item.id === artifact.id) ? 'currentColor' : 'none'} />
                    {savedArtifacts.some(item => item.id === artifact.id) ? 'Saved' : 'Save artifact'}
                  </button>
                  <button onClick={() => setArtifact(null)} className="text-gray-400 hover:text-gray-600 flex items-center gap-1 text-sm font-bold">
                    <RotateCcw size={14} /> New
                  </button>
                </div>
              </div>
              {artifact.generation_notice && <p role="status" className="mx-6 mt-5 rounded-lg bg-indigo-50 p-3 text-xs text-indigo-800">{artifact.generation_notice}</p>}
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                {renderArtifact()}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-12 h-full min-h-[500px]">
              <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                <Sparkles size={48} className="text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-700 mb-2">No Artifact Generated Yet</h3>
              <p className="text-gray-500 max-w-sm">
                Paste your source material, pick an artifact type, and click Generate. The AI will create interactive study material for you.
              </p>
            </div>
          )}

          {savedArtifacts.length > 0 && (
            <section className="mt-6 bg-white rounded-2xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bookmark size={16} className="text-purple-600" />
                <h2 className="font-extrabold text-gray-900">Saved artifacts</h2>
              </div>
              <div className="space-y-2">
                {savedArtifacts.map(saved => (
                  <div key={`${saved.id}-${saved.savedAt}`} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <button onClick={() => handleOpenSavedArtifact(saved)} className="min-w-0 text-left hover:text-purple-700">
                      <p className="font-bold text-sm truncate">{saved.title}</p>
                      <p className="text-xs text-gray-500 capitalize">{saved.artifact_type.replace('_', ' ')} · {new Date(saved.savedAt).toLocaleDateString()}</p>
                    </button>
                    <button onClick={() => handleDeleteSavedArtifact(saved.id)} className="p-1.5 text-gray-400 hover:text-red-600" aria-label={`Delete ${saved.title}`}>
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
