import React, { useState, useEffect, useRef } from "react";
import { 
  Pencil, Highlighter, Eraser, Move, Type, Trash2, Undo, Redo, 
  Download, Plus, Check, Play, Copy, X, FileText, Image as ImageIcon,
  Sun, Moon
} from "lucide-react";

declare const pdfjsLib: any;

interface WriteDrawEditorProps {
  initialTitle?: string;
  initialContent?: string;
  initialDrawData?: any;
  onSave?: (data: { title: string; content: string; drawData: any }) => void;
}

export function WriteDrawEditor({
  initialTitle = "Untitled Note",
  initialContent = "",
  initialDrawData = { pages: [[]], page: 0 },
  onSave
}: WriteDrawEditorProps) {
  const [mode, setMode] = useState<"write" | "draw">("write");
  const [title, setTitle] = useState(initialTitle);
  const [wordCount, setWordCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // Draw Mode State
  const [drawTool, setDrawTool] = useState<string>("pen");
  const [drawColor, setDrawColor] = useState<string>("#1a1916");
  const [drawSize, setDrawSize] = useState<number>(3);
  const [drawBg, setDrawBg] = useState<"plain" | "grid" | "lined" | "dots">("grid");
  const [zoom, setZoom] = useState<number>(1);
  const [drawData, setDrawData] = useState<any>(initialDrawData);

  const editorRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);
  const bgCanvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const canvasAreaRef = useRef<HTMLDivElement>(null);

  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const isDrawingRef = useRef(false);
  const currentStrokeRef = useRef<any>(null);

  // Update Word Count
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const txt = editorRef.current.innerText || "";
    const words = txt.trim() ? txt.trim().split(/\s+/).length : 0;
    setWordCount(words);
    if (onSave) {
      onSave({ title, content: editorRef.current.innerHTML, drawData });
    }
  };

  useEffect(() => {
    if (editorRef.current && initialContent && !editorRef.current.innerHTML) {
      editorRef.current.innerHTML = initialContent;
      handleEditorInput();
    }
  }, [initialContent]);

  // Init canvas background & dimensions
  useEffect(() => {
    if (mode === "draw" && canvasAreaRef.current && mainCanvasRef.current && bgCanvasRef.current) {
      const area = canvasAreaRef.current;
      const w = area.clientWidth;
      const h = area.clientHeight;

      [mainCanvasRef.current, bgCanvasRef.current, overlayCanvasRef.current].forEach(cvs => {
        if (cvs) { cvs.width = w; cvs.height = h; }
      });
      redrawBg();
      redrawMain();
    }
  }, [mode, drawBg, zoom]);

  const redrawBg = () => {
    const cvs = bgCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    const w = cvs.width;
    const h = cvs.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = isDark ? "#13130f" : "#fffffe";
    ctx.fillRect(0, 0, w, h);

    if (drawBg === "plain") return;

    const gridPx = 28 * zoom;
    ctx.save();
    if (drawBg === "grid") {
      ctx.strokeStyle = isDark ? "rgba(255,248,230,0.04)" : "rgba(0,0,0,0.055)";
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += gridPx) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y <= h; y += gridPx) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (drawBg === "lined") {
      ctx.strokeStyle = isDark ? "rgba(255,248,230,0.06)" : "rgba(0,0,0,0.07)";
      ctx.lineWidth = 1;
      for (let y = 0; y <= h; y += gridPx) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    } else if (drawBg === "dots") {
      ctx.fillStyle = isDark ? "rgba(255,248,230,0.18)" : "rgba(0,0,0,0.12)";
      for (let x = 0; x <= w; x += gridPx) {
        for (let y = 0; y <= h; y += gridPx) {
          ctx.beginPath(); ctx.arc(x, y, 1.2, 0, Math.PI * 2); ctx.fill();
        }
      }
    }
    ctx.restore();
  };

  const redrawMain = () => {
    const cvs = mainCanvasRef.current;
    if (!cvs) return;
    const ctx = cvs.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, cvs.width, cvs.height);

    const currentPageStrokes = drawData.pages[drawData.page || 0] || [];
    currentPageStrokes.forEach((stroke: any) => {
      ctx.save();
      ctx.strokeStyle = stroke.color || drawColor;
      ctx.lineWidth = stroke.size || drawSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      if (stroke.tool === "eraser") {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = stroke.size * 6;
      }

      if (stroke.pts && stroke.pts.length > 0) {
        ctx.beginPath();
        stroke.pts.forEach((pt: any, i: number) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();
      }
      ctx.restore();
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (mode !== "draw" || !canvasAreaRef.current) return;
    const rect = canvasAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    isDrawingRef.current = true;
    currentStrokeRef.current = { tool: drawTool, color: drawColor, size: drawSize, pts: [{ x, y }] };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawingRef.current || !currentStrokeRef.current || !canvasAreaRef.current) return;
    const rect = canvasAreaRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    currentStrokeRef.current.pts.push({ x, y });

    const cvs = mainCanvasRef.current;
    if (cvs) {
      const ctx = cvs.getContext("2d");
      if (ctx) {
        ctx.save();
        ctx.strokeStyle = currentStrokeRef.current.color;
        ctx.lineWidth = currentStrokeRef.current.size;
        ctx.lineCap = "round";
        ctx.beginPath();
        const pts = currentStrokeRef.current.pts;
        const p1 = pts[pts.length - 2];
        const p2 = pts[pts.length - 1];
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
        ctx.restore();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDrawingRef.current || !currentStrokeRef.current) return;
    isDrawingRef.current = false;

    const p = drawData.page || 0;
    const newPages = [...drawData.pages];
    if (!newPages[p]) newPages[p] = [];
    newPages[p].push(currentStrokeRef.current);

    const updated = { ...drawData, pages: newPages };
    setDrawData(updated);
    setUndoStack(prev => [...prev, currentStrokeRef.current]);
    currentStrokeRef.current = null;
    if (onSave && editorRef.current) {
      onSave({ title, content: editorRef.current.innerHTML, drawData: updated });
    }
  };

  return (
    <div className={`w-full h-full flex flex-col ${isDark ? "dark bg-[#0d0d0b] text-[#f0ead8]" : "bg-[#f5f4f0] text-[#1a1916]"}`}>
      {/* Topbar */}
      <div className="h-12 border-b border-gray-200 dark:border-gray-800 px-4 flex items-center justify-between bg-white/80 dark:bg-black/80 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg italic font-bold">Write<span className="text-amber-600">.</span>Draw</span>
          <div className="w-px h-5 bg-gray-200 dark:bg-gray-800" />
          <div className="flex bg-gray-100 dark:bg-gray-900 rounded-lg p-0.5 border border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setMode("write")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === "write" ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}
            >
              Write
            </button>
            <button
              onClick={() => setMode("draw")}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${mode === "draw" ? "bg-white dark:bg-gray-800 shadow-sm text-gray-900 dark:text-white" : "text-gray-500"}`}
            >
              Draw
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-800 text-xs font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            {isDark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {mode === "write" ? (
          <div className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto w-full">
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); handleEditorInput(); }}
              placeholder="Untitled Note..."
              className="w-full text-4xl font-serif italic font-bold bg-transparent border-none outline-none mb-2 text-gray-900 dark:text-gray-100"
            />
            <div className="text-xs text-gray-400 font-mono mb-6 pb-2 border-b border-gray-100 dark:border-gray-800">
              {wordCount} words
            </div>

            <div
              ref={editorRef}
              contentEditable
              onInput={handleEditorInput}
              data-placeholder="Start writing... Type / for blocks"
              className="min-h-[60vh] outline-none prose prose-lg dark:prose-invert max-w-none font-serif text-lg leading-relaxed text-gray-800 dark:text-gray-200"
            />
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* Tool Sidebar */}
            <div className="w-14 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col items-center py-4 gap-3 shrink-0">
              <button onClick={() => setDrawTool("pen")} className={`p-2 rounded-lg ${drawTool === "pen" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40" : "text-gray-600"}`} title="Pen"><Pencil size={18} /></button>
              <button onClick={() => setDrawTool("highlighter")} className={`p-2 rounded-lg ${drawTool === "highlighter" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40" : "text-gray-600"}`} title="Highlighter"><Highlighter size={18} /></button>
              <button onClick={() => setDrawTool("eraser")} className={`p-2 rounded-lg ${drawTool === "eraser" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40" : "text-gray-600"}`} title="Eraser"><Eraser size={18} /></button>

              <div className="w-8 h-px bg-gray-200 dark:bg-gray-800 my-1" />

              {["#1a1916", "#d4580a", "#2563eb", "#16a34a", "#dc2626"].map(c => (
                <button
                  key={c}
                  onClick={() => setDrawColor(c)}
                  className={`w-5 h-5 rounded-full border-2 ${drawColor === c ? "border-black dark:border-white scale-110" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}

              <div className="mt-auto flex flex-col gap-2">
                <button onClick={() => setDrawBg("plain")} className={`text-[10px] font-mono px-1 py-0.5 border rounded ${drawBg === "plain" ? "border-amber-600 text-amber-600" : ""}`}>Plain</button>
                <button onClick={() => setDrawBg("grid")} className={`text-[10px] font-mono px-1 py-0.5 border rounded ${drawBg === "grid" ? "border-amber-600 text-amber-600" : ""}`}>Grid</button>
                <button onClick={() => setDrawBg("lined")} className={`text-[10px] font-mono px-1 py-0.5 border rounded ${drawBg === "lined" ? "border-amber-600 text-amber-600" : ""}`}>Lines</button>
              </div>
            </div>

            {/* Canvas Area */}
            <div
              ref={canvasAreaRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              className="flex-1 relative cursor-crosshair touch-none overflow-hidden bg-gray-50 dark:bg-gray-950"
            >
              <canvas ref={bgCanvasRef} className="absolute inset-0 pointer-events-none" />
              <canvas ref={mainCanvasRef} className="absolute inset-0" />
              <canvas ref={overlayCanvasRef} className="absolute inset-0 pointer-events-none" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WriteDrawEditor;
