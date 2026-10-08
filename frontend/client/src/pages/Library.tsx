import { Search, FileText, CheckCircle2, Clock, AlertCircle, Sparkles, Brain, Eye, Loader2, Plus, Upload, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useCompanion } from "@/contexts/CompanionContext";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

type SourceStatus = "ready" | "extracting" | "synthesizing" | "failed";

const CAPTURE_API_URL = import.meta.env.VITE_CAPTURE_API_URL || "http://localhost:8080";
const SAVED_ARTIFACTS_KEY = "learnloop-saved-artifacts";

export default function Library() {
  const { setContext } = useCompanion();
  const [, setLocation] = useLocation();
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSource, setExpandedSource] = useState<string | null>(null);
  
  const [captures, setCaptures] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);
  const [previewCapture, setPreviewCapture] = useState<any | null>(null);
  const [savedArtifacts, setSavedArtifacts] = useState<any[]>([]);
  const uploadRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setContext({ workspace: "Library" });
    
    // Fetch captures from Python backend
    fetch(`${CAPTURE_API_URL}/captures`, { headers: { "Authorization": "Bearer demo-user" } })
      .then(res => res.json())
      .then(data => setCaptures(Array.isArray(data) ? data : []))
      .catch(err => console.error("Failed to load captures", err));
  }, [setContext]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(SAVED_ARTIFACTS_KEY) || "[]");
      setSavedArtifacts(Array.isArray(saved) ? saved : []);
    } catch { setSavedArtifacts([]); }
  }, []);

  const handleAddSource = () => uploadRef.current?.click();

  const createSourceMutation = trpc.workspace.createSource.useMutation();

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    let uploadedSuccessfully = false;
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", file.name);
      const res = await fetch(`${CAPTURE_API_URL}/captures/upload`, {
        method: "POST",
        headers: { "Authorization": "Bearer demo-user" },
        body: formData
      });
      if (res.ok) {
        const newCap = await res.json();
        setCaptures(prev => [newCap, ...prev]);
        uploadedSuccessfully = true;
      }
    } catch (err) {
      console.warn("Python backend upload failed, attempting fallback:", err);
    }

    if (!uploadedSuccessfully) {
      try {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const base64 = (event.target?.result as string).split(',')[1];
          const newSource = {
            id: Date.now().toString(),
            title: file.name,
            capture_type: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "document",
            processing_status: "ready",
            original_content: `Content extracted from ${file.name}`,
            created_at: new Date().toISOString()
          };
          setCaptures(prev => [newSource, ...prev]);
          createSourceMutation.mutate({
            workspaceId: 1,
            title: file.name,
            fileName: file.name,
            mimeType: file.type,
            fileBase64: base64,
            sourceType: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "document"
          });
        };
        reader.readAsDataURL(file);
        uploadedSuccessfully = true;
      } catch (e) {
        alert("Upload failed.");
      }
    }

    setUploading(false);
    if (uploadRef.current) uploadRef.current.value = "";
  };

  // Semantic search via backend
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`${CAPTURE_API_URL}/ask`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: searchQuery, top_k: 5 })
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults([{ type: "ai", answer: data.answer, sources: data.sources || [] }]);
        }
      } catch {
        // Fallback to client-side filter
      } finally {
        setIsSearching(false);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready": return <CheckCircle2 size={16} className="text-green-600" />;
      case "extracting": 
      case "synthesizing": return <Clock size={16} className="text-amber-600" />;
      case "failed": return <AlertCircle size={16} className="text-red-600" />;
      default: return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready": return "Ready for review";
      case "extracting": return "Extracting content...";
      case "synthesizing": return "Synthesizing course...";
      case "failed": return "Processing failed";
      default: return status;
    }
  };

  const filteredSources = captures.filter((s: any) => {
    if (activeFilter !== "All" && s.capture_type?.toLowerCase() !== activeFilter.toLowerCase()) return false;
    if (searchQuery && !s.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1000px] mx-auto py-10 px-6">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-4xl font-extrabold tracking-tight mb-4">Library</h1>
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              {isSearching ? <Loader2 className="h-5 w-5 text-[#123d2d] animate-spin" /> : <Search className="h-5 w-5 text-gray-400" />}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-11 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-gray-900 focus:ring-[#123d2d] focus:border-[#123d2d] shadow-sm text-lg" 
              placeholder="Search what you remember..."
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <input ref={uploadRef} type="file" className="hidden" accept=".pdf,.txt,.doc,.docx,.png,.jpg,.mp3,.m4a" onChange={handleFileSelected} />
          <Button onClick={handleAddSource} disabled={uploading} className="bg-[#123d2d] hover:bg-[#0d2a1f] text-white font-bold rounded-xl px-6 py-4 h-auto">
            {uploading ? <Loader2 size={20} className="mr-2 animate-spin" /> : <Upload size={20} className="mr-2" />}
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </div>

      {/* AI Search Results */}
      {searchResults.length > 0 && searchResults[0].type === "ai" && (
        <div className="mb-8 p-6 bg-gradient-to-br from-[#f1f5f2] to-white border border-[#e1e8e2] rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-[#123d2d]" />
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#123d2d]">AI Answer</span>
          </div>
          <p className="text-gray-800 leading-relaxed text-sm">{searchResults[0].answer}</p>
          {searchResults[0].sources?.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#e1e8e2]">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Sources used</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {searchResults[0].sources.map((src: any, i: number) => (
                  <span key={i} className="px-2 py-1 bg-white rounded-lg text-xs font-medium text-gray-600 border border-gray-200">{src.title || `Source ${i + 1}`}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {["All", "PDF", "Document", "URL", "Audio"].map(filter => (
          <button 
            key={filter} 
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${filter === activeFilter ? 'bg-[#123d2d] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {savedArtifacts.length > 0 && <section className="mb-8">
        <h2 className="text-lg font-extrabold text-gray-900 mb-3">Saved artifacts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedArtifacts.map(artifact => <button key={artifact.id} onClick={() => setLocation("/artifacts")} className="min-w-0 rounded-2xl border border-violet-100 bg-violet-50/40 p-5 text-left hover:border-violet-300 transition-colors">
            <div className="flex items-center gap-4"><div className="w-12 h-12 shrink-0 rounded-xl bg-white flex items-center justify-center border border-violet-100"><Sparkles className="text-violet-600" size={22} /></div><div className="min-w-0"><h3 className="truncate font-bold text-gray-900">{artifact.title}</h3><p className="mt-1 text-xs font-bold uppercase tracking-wide text-violet-700">{String(artifact.artifact_type || "artifact").replace("_", " ")} · Saved artifact</p></div></div>
          </button>)}
        </div>
      </section>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSources.map((source: any) => (
          <div key={source.id}>
            <div 
              className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm flex min-w-0 items-center gap-4 hover:border-gray-300 transition-colors cursor-pointer" 
              onClick={() => setPreviewCapture(source)}
            >
              <div className="flex min-w-0 flex-1 items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <FileText className="text-gray-500" size={24} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-900 line-clamp-1">{source.title || "Untitled"}</h3>
                  <div className="flex items-center gap-3 mt-1 text-xs">
                    <span className="text-gray-500 font-medium uppercase tracking-wider">{source.capture_type || "DOCUMENT"}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                    <span className="text-gray-500">{new Date(source.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1 text-right">
                {getStatusIcon(source.processing_status || "ready")}
                <span className={`whitespace-nowrap text-[10px] font-extrabold uppercase tracking-wide ${source.processing_status === "failed" ? "text-red-700" : "text-green-700"}`}>
                  {getStatusText(source.processing_status || "ready")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {previewCapture && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 lg:p-10" onClick={() => setPreviewCapture(null)}>
          <div className="bg-white w-full h-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                  <FileText size={20} className="text-gray-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{previewCapture.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">Uploaded on {new Date(previewCapture.created_at || Date.now()).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={(e) => { e.stopPropagation(); setLocation(`/artifacts?captureId=${previewCapture.id}`); }}
                  className="flex items-center gap-2 px-4 py-2 bg-[#123d2d] text-white rounded-xl text-xs font-bold hover:bg-[#0d2a1f] transition-colors"
                >
                  <Sparkles size={14} /> Generate Artifacts
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setLocation(`/?generateCourse=1&captureId=${encodeURIComponent(previewCapture.id)}&sourceTitle=${encodeURIComponent(previewCapture.title || "Uploaded source")}`);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-200 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
                >
                  <Brain size={14} /> Create Course
                </button>
                <div className="w-px h-6 bg-gray-300 mx-1"></div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={14} /> AI Processed
                </div>
                <button onClick={() => setPreviewCapture(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors bg-gray-100 text-gray-600">
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 bg-white">
              {(previewCapture.capture_type === 'screenshot' || previewCapture.capture_type === 'image') && previewCapture.file_url && (
                <div className="flex justify-center mb-8">
                  <img src={`http://localhost:8080${previewCapture.file_url}`} alt={previewCapture.title} className="max-w-full max-h-[50vh] object-contain rounded-xl shadow-md border border-gray-200" />
                </div>
              )}
              <div className="prose prose-sm max-w-none text-gray-700">
                {(previewCapture.normalized_content || previewCapture.original_content || "No content available.").split('\n').map((paragraph: string, idx: number) => (
                  <p key={idx} className="mb-4 text-base leading-relaxed">{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
