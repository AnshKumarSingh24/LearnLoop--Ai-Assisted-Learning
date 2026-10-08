import { useMemo, useRef, useState, useEffect } from "react";
import { useParams } from "wouter";
import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { useCompanion } from "@/contexts/CompanionContext";
import {
  Archive,
  ArrowDownToLine,
  ArrowUpRight,
  Bold,
  BookOpen,
  Check,
  ChevronDown,
  CircleHelp,
  Cloud,
  Command,
  Copy,
  FileText,
  Hand,
  Highlighter,
  Italic,
  LayoutGrid,
  Link2,
  List,
  Lock,
  Maximize2,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Move,
  PanelRight,
  Plus,
  Redo2,
  Search,
  Send,
  Share2,
  SlidersHorizontal,
  Sparkles,
  SquarePen,
  StickyNote,
  Strikethrough,
  Trash2,
  Underline,
  Undo2,
  Users,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

type Note = {
  id: string;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  x: number;
  y: number;
  width?: number;
  height?: number;
  updated: string;
  pinned?: boolean;
};

type Group = {
  id: string;
  title: string;
  caption: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  border: string;
};

type Connection = { from: string; to: string };

const initialNotes: Note[] = [
  {
    id: "signal",
    title: "The signal is in the edges",
    body: `<p>Most meaningful ideas don't arrive as finished thoughts. They surface in the <strong>relationship between two things</strong> that were previously kept apart.</p><p>I'm collecting examples of this in books, product teams, and my own research practice.</p><ul><li>Notice the unexpected adjacency</li><li>Write down the tension before resolving it</li><li>Give the idea enough room to develop</li></ul>`,
    tag: "Core idea",
    tagColor: "#d8f2e3",
    x: 112,
    y: 222,
    width: 246,
    height: 236,
    updated: "Edited just now",
    pinned: true,
  },
  {
    id: "friction",
    title: "Friction is a creative material",
    body: `<p>When a workflow feels slightly difficult, it may be revealing a boundary worth exploring rather than asking to be smoothed away.</p><blockquote>Good tools don't remove every edge. They make the useful edges visible.</blockquote><p><mark>Question:</mark> where does a little resistance create more thoughtful work?</p>`,
    tag: "Product notes",
    tagColor: "#f8cdc0",
    x: 414,
    y: 174,
    width: 254,
    height: 222,
    updated: "Edited 12 min ago",
  },
  {
    id: "models",
    title: "Mental models are portable scaffolds",
    body: `<p>A mental model is not a conclusion. It is a temporary structure for seeing more clearly.</p><p>The best ones are:</p><ul><li>Specific enough to use</li><li>Loose enough to adapt</li><li>Memorable enough to share</li></ul>`,
    tag: "Reading notes",
    tagColor: "#e9e5fb",
    x: 720,
    y: 132,
    width: 246,
    height: 222,
    updated: "Edited yesterday",
  },
  {
    id: "studio",
    title: "Build a studio, not a storage unit",
    body: `<p>A workspace should make it easy to move from collecting to composing.</p><p>That means:</p><ul><li>Low-friction capture</li><li>Visible relationships</li><li>A comfortable place to return and edit</li></ul>`,
    tag: "Working thesis",
    tagColor: "#d4edf5",
    x: 177,
    y: 555,
    width: 258,
    height: 214,
    updated: "Edited 2 days ago",
  },
  {
    id: "weekly",
    title: "Weekly synthesis ritual",
    body: `<p>Every Friday, move three fragments from the margins into the center.</p><ol><li>Review loose notes</li><li>Group by a shared tension</li><li>Write one sentence that surprises you</li></ol>`,
    tag: "Rituals",
    tagColor: "#f0e6c4",
    x: 508,
    y: 490,
    width: 242,
    height: 195,
    updated: "Edited 4 days ago",
  },
  {
    id: "questions",
    title: "Questions worth carrying",
    body: `<p>What if the goal of a notes app isn't retrieval, but better questions?</p><p>What kind of interface gives unfinished thoughts enough dignity to stay unfinished?</p>`,
    tag: "Open loops",
    tagColor: "#ece4cf",
    x: 812,
    y: 492,
    width: 250,
    height: 188,
    updated: "Edited 1 week ago",
  },
];

const groups: Group[] = [
  { id: "observe", title: "01  OBSERVE", caption: "What keeps catching my attention", x: 72, y: 78, width: 620, height: 404, color: "#f7eee5", border: "#ead1bf" },
  { id: "compose", title: "02  COMPOSE", caption: "Turn fragments into a point of view", x: 42, y: 512, width: 706, height: 292, color: "#eef4ed", border: "#cddfcd" },
  { id: "carry", title: "03  CARRY FORWARD", caption: "Questions that deserve another pass", x: 756, y: 74, width: 350, height: 732, color: "#f0eff8", border: "#d8d3ee" },
];

const initialConnections: Connection[] = [
  { from: "signal", to: "friction" },
  { from: "friction", to: "models" },
  { from: "signal", to: "studio" },
  { from: "studio", to: "weekly" },
  { from: "weekly", to: "questions" },
  { from: "models", to: "questions" },
];

function loadCanvas(storageKey: string) {
  try {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return { notes: initialNotes, connections: initialConnections };
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed.notes) && Array.isArray(parsed.connections)) return parsed as { notes: Note[]; connections: Connection[] };
  } catch {
    // Keep the starter canvas available if browser storage is unavailable/corrupt.
  }
  return { notes: initialNotes, connections: initialConnections };
}

const iconButton = "icon-button";

const EditorContent = ({ note, onUpdate }: { note: Note, onUpdate: (id: string, body: string) => void }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== note.body) {
      ref.current.innerHTML = note.body;
    }
  }, [note.id]);
  
  return (
    <div
      ref={ref}
      className="editor-body"
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onUpdate(note.id, e.currentTarget.innerHTML)}
      onBlur={(e) => onUpdate(note.id, e.currentTarget.innerHTML)}
    />
  );
};

export default function Workspace() {
  const { spaceId, pageId } = useParams();
  const { state: store, dispatch } = useDarwinity();
  const { setContext } = useCompanion();
  const page = store.pages.find(item => item.id === pageId);
  const space = store.spaces.find(item => item.id === (spaceId || page?.spaceId));
  const canvasKey = `darwinity-canvas-${pageId || "main"}-v1`;
  const [canvas] = useState(() => loadCanvas(canvasKey));
  const [notes, setNotes] = useState<Note[]>(canvas.notes);
  const [connections, setConnections] = useState<Connection[]>(canvas.connections);
  const [selectedId, setSelectedId] = useState("signal");
  const [activeTool, setActiveTool] = useState<"select" | "hand" | "note" | "connect">("select");
  const [linkStart, setLinkStart] = useState<string | null>(null);
  const [showInspector, setShowInspector] = useState(true);
  const [search, setSearch] = useState("");
  const [zoom, setZoom] = useState(0.78);
  const [pan, setPan] = useState({ x: 30, y: 28 });
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const [panning, setPanning] = useState<{ x: number; y: number; px: number; py: number } | null>(null);
  const [saveState, setSaveState] = useState("Saved locally");
  const [toast, setToast] = useState("Canvas ready");
  const [showToast, setShowToast] = useState(true);
  const boardRef = useRef<HTMLDivElement>(null);

  // Canvas cards, links, and edits now survive navigation and browser reloads.
  useEffect(() => {
    try {
      localStorage.setItem(canvasKey, JSON.stringify({ notes, connections }));
    } catch {
      setSaveState("Couldn’t save locally");
    }
  }, [notes, connections, canvasKey]);

  useEffect(() => {
    if (!page || !space) return;
    dispatch({ type: "SET_ACTIVE_SPACE", id: space.id });
    dispatch({ type: "SET_ACTIVE_PAGE", id: page.id });
    setContext({ workspace: "Canvas", spaceId: space.id, pageId: page.id, selection: `${space.name} / ${page.title}` });
  }, [page, space, dispatch, setContext]);

  const selected = notes.find((note) => note.id === selectedId) ?? notes[0];
  const visibleNotes = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return notes;
    return notes.filter((note) => `${note.title} ${note.tag} ${note.body}`.toLowerCase().includes(query));
  }, [notes, search]);

  const notify = (message: string) => {
    setToast(message);
    setShowToast(true);
    window.setTimeout(() => setShowToast(false), 2600);
  };

  const updateNote = (id: string, patch: Partial<Note>) => {
    setNotes((current) => current.map((note) => (note.id === id ? { ...note, ...patch, updated: "Saving…" } : note)));
    setSaveState("Saving…");
    window.setTimeout(() => {
      setNotes((current) => current.map((note) => (note.id === id ? { ...note, updated: "Edited just now" } : note)));
      setSaveState("Saved locally");
    }, 550);
  };

  const addNote = (x = 540, y = 320) => {
    const id = `note-${Date.now()}`;
    const next: Note = {
      id,
      title: "Untitled thought",
      body: "<p>Start writing here…</p>",
      tag: "New note",
      tagColor: "#d8f2e3",
      x,
      y,
      width: 246,
      height: 190,
      updated: "Edited just now",
    };
    setNotes((current) => [...current, next]);
    setSelectedId(id);
    setActiveTool("select");
    notify("New note added to the canvas");
  };

  const boardPoint = (event: React.PointerEvent) => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return { x: 420, y: 320 };
    return {
      x: Math.max(24, Math.round((event.clientX - rect.left - pan.x) / zoom - 120)),
      y: Math.max(72, Math.round((event.clientY - rect.top - pan.y) / zoom - 80)),
    };
  };

  const handleBoardPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (activeTool === "note") {
      const point = boardPoint(event);
      addNote(point.x, point.y);
      return;
    }
    if (activeTool === "hand" || event.button === 1) {
      setPanning({ x: pan.x, y: pan.y, px: event.clientX, py: event.clientY });
      event.currentTarget.setPointerCapture(event.pointerId);
    }
  };

  const handleBoardPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = Math.max(20, Math.round((event.clientX - rect.left - pan.x) / zoom - dragging.dx));
      const y = Math.max(60, Math.round((event.clientY - rect.top - pan.y) / zoom - dragging.dy));
      setNotes((current) => current.map((note) => (note.id === dragging.id ? { ...note, x, y } : note)));
    }
    if (panning) {
      setPan({ x: panning.x + event.clientX - panning.px, y: panning.y + event.clientY - panning.py });
    }
  };

  const stopPointerWork = () => {
    setDragging(null);
    setPanning(null);
  };

  const handleCardPointerDown = (event: React.PointerEvent<HTMLDivElement>, note: Note) => {
    if (activeTool === "connect") return;
    event.stopPropagation();
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragging({
      id: note.id,
      dx: (event.clientX - rect.left - pan.x) / zoom - note.x,
      dy: (event.clientY - rect.top - pan.y) / zoom - note.y,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleCardClick = (note: Note) => {
    if (activeTool === "connect") {
      if (!linkStart) {
        setLinkStart(note.id);
        notify("Choose another note to connect");
      } else if (linkStart !== note.id) {
        setConnections((current) => [...current, { from: linkStart, to: note.id }]);
        setLinkStart(null);
        setActiveTool("select");
        notify("Connection added");
      }
      return;
    }
    setSelectedId(note.id);
  };

  const removeSelected = () => {
    if (notes.length <= 1) return;
    const next = notes.filter((note) => note.id !== selected.id);
    setNotes(next);
    setConnections((current) => current.filter((connection) => connection.from !== selected.id && connection.to !== selected.id));
    setSelectedId(next[0].id);
    notify("Note removed");
  };

  const zoomBy = (amount: number) => setZoom((current) => Math.min(1.25, Math.max(0.45, Number((current + amount).toFixed(2)))));

  const format = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    setSaveState("Saving…");
    window.setTimeout(() => setSaveState("Saved locally"), 450);
  };

  const notePosition = (id: string) => {
    const note = notes.find((item) => item.id === id);
    return note ? { x: note.x, y: note.y, width: note.width ?? 246, height: note.height ?? 200 } : { x: 0, y: 0, width: 246, height: 200 };
  };

  return (
    <div className="mindspace-shell">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap');
        :root { --ink:#1e2a22; --muted:#7e857c; --line:#dedfd6; --paper:#f8f8f4; --lime:#d9fa62; --lime-deep:#b7d928; --sidebar:#f4f4ef; --panel:#fbfbf8; --ease:cubic-bezier(.23,1,.32,1); }
        * { box-sizing:border-box; }
        .mindspace-shell { min-height:100vh; height:100vh; overflow:hidden; background:var(--paper); color:var(--ink); font-family:'DM Sans',ui-sans-serif,system-ui,sans-serif; display:flex; }
        .left-rail { width:68px; background:#f1f2ec; border-right:1px solid #e1e2db; display:flex; flex-direction:column; align-items:center; justify-content:space-between; padding:18px 0 16px; flex:none; z-index:20; }
        .brand-mark { width:34px; height:34px; border-radius:11px; background:var(--ink); color:var(--lime); display:grid; place-items:center; font-family:'Space Grotesk',sans-serif; font-size:17px; font-weight:700; box-shadow:0 5px 12px #1e2a2214; }
        .rail-stack { display:flex; flex-direction:column; align-items:center; gap:8px; }
        .rail-divider { height:1px; width:24px; background:#d8d9d1; margin:8px 0; }
        .rail-button { width:38px; height:38px; border:0; border-radius:11px; color:#969c93; background:transparent; display:grid; place-items:center; transition:all .18s var(--ease); }
        .rail-button:hover { background:#e7e9df; color:var(--ink); transform:translateY(-1px); }
        .rail-button.active { background:var(--ink); color:var(--lime); box-shadow:0 5px 12px #1e2a221a; }
        .avatar { width:30px; height:30px; background:#e9d2c3; color:#654539; border:2px solid #fff; border-radius:50%; display:grid; place-items:center; font-size:10px; font-weight:700; }
        .main-column { min-width:0; min-height:0; flex:1; display:flex; flex-direction:column; position:relative; }
        .topbar { height:64px; flex:none; display:flex; align-items:center; justify-content:space-between; padding:0 22px 0 20px; border-bottom:1px solid #e4e5df; background:rgba(248,248,244,.9); backdrop-filter:blur(18px); z-index:12; }
        .crumbs { display:flex; align-items:center; gap:11px; color:#848b82; font-size:13px; font-weight:600; }
        .crumbs .current { color:var(--ink); }
        .canvas-title-input { min-width:0; max-width:260px; border:1px solid transparent; border-radius:7px; background:transparent; color:var(--ink); font:600 13px 'DM Sans'; padding:5px 7px; outline:0; }
        .canvas-title-input:hover, .canvas-title-input:focus { border-color:#d9ddd3; background:#fff; }
        .crumb-icon { width:26px; height:26px; border-radius:8px; background:var(--lime); display:grid; place-items:center; color:var(--ink); }
        .top-actions { display:flex; align-items:center; gap:10px; }
        .top-search { width:188px; height:34px; border:1px solid #e0e1d9; border-radius:9px; background:#fff; display:flex; align-items:center; gap:8px; padding:0 10px; color:#929990; }
        .top-search input { width:100%; border:0; outline:0; background:transparent; font:500 12px 'DM Sans'; color:var(--ink); }
        .top-search input::placeholder { color:#a1a69f; }
        .top-button { height:34px; border:1px solid #dfe1d8; border-radius:9px; background:#fff; color:#626a61; display:flex; align-items:center; gap:7px; padding:0 11px; font:600 12px 'DM Sans'; transition:all .18s var(--ease); }
        .top-button:hover { border-color:#c8cabf; color:var(--ink); transform:translateY(-1px); }
        .share-button { background:var(--ink); color:#f7faec; border-color:var(--ink); }
        .share-button:hover { background:#314238; color:#fff; }
        .workspace { flex:1; min-height:0; display:flex; position:relative; }
        .canvas-wrap { flex:1; min-width:0; position:relative; overflow:hidden; background-color:#f8f8f4; background-image:radial-gradient(#d9ddd1 1.1px, transparent 1.1px); background-size:25px 25px; }
        .canvas-wrap:after { content:''; pointer-events:none; position:absolute; inset:0; background:linear-gradient(110deg, rgba(255,255,255,.42), transparent 40%, rgba(223,229,207,.15)); }
        .canvas-board { position:absolute; inset:0; cursor:default; touch-action:none; z-index:1; }
        .canvas-board.is-hand { cursor:grab; }
        .canvas-board.is-hand:active { cursor:grabbing; }
        .canvas-scene { position:absolute; left:0; top:0; width:1160px; height:850px; transform-origin:0 0; transition:transform .18s var(--ease); }
        .group-zone { position:absolute; border:1px solid; border-radius:19px; padding:15px 17px; overflow:hidden; }
        .group-zone:before { content:''; position:absolute; left:18px; right:18px; top:52px; border-top:1px solid currentColor; opacity:.16; }
        .group-head { position:relative; display:flex; align-items:baseline; gap:11px; }
        .group-title { font:700 11px 'Space Grotesk'; letter-spacing:.11em; }
        .group-caption { color:#7d827b; font-size:11px; font-weight:500; }
        .connections { position:absolute; inset:0; width:100%; height:100%; overflow:visible; pointer-events:none; z-index:2; }
        .connection-path { fill:none; stroke:#a1a79d; stroke-width:1.5; stroke-dasharray:5 5; opacity:.72; }
        .note-card { position:absolute; z-index:4; background:#fff; border:1px solid rgba(35,48,39,.1); border-radius:13px; box-shadow:0 9px 24px rgba(47,57,47,.08), 0 1px 2px rgba(47,57,47,.05); padding:15px 16px 13px; overflow:hidden; cursor:grab; user-select:none; transition:box-shadow .18s var(--ease), border-color .18s var(--ease), transform .18s var(--ease); }
        .note-card:hover { box-shadow:0 13px 28px rgba(47,57,47,.13), 0 2px 3px rgba(47,57,47,.06); transform:translateY(-2px); }
        .note-card:active { cursor:grabbing; }
        .note-card.selected { border:2px solid var(--lime-deep); box-shadow:0 0 0 4px rgba(217,250,98,.25), 0 15px 30px rgba(47,57,47,.14); padding:14px 15px 12px; }
        .note-card.link-start { border-color:#8c76d9; box-shadow:0 0 0 4px rgba(140,118,217,.18); }
        .note-ribbon { width:max-content; padding:4px 7px; border-radius:5px; color:#586257; font-size:9px; line-height:1; font-weight:700; letter-spacing:.05em; text-transform:uppercase; margin-bottom:11px; }
        .note-title { margin:0; font:600 15px/1.2 'Space Grotesk'; letter-spacing:-.02em; color:#273128; }
        .note-preview { color:#748077; font-size:11px; line-height:1.55; margin:9px 0 0; display:-webkit-box; -webkit-line-clamp:4; -webkit-box-orient:vertical; overflow:hidden; }
        .note-preview p { margin:0 0 7px; }
        .note-preview strong { color:#4d5f48; font-weight:700; }
        .note-footer { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:13px; padding-top:10px; border-top:1px solid #edf0e9; color:#a1a99f; font-size:9px; }
        .mini-pill { display:flex; align-items:center; gap:4px; color:#7d867a; }
        .mini-pill i { width:5px; height:5px; border-radius:50%; background:#c4cfc0; display:block; }
        .canvas-hud { position:absolute; left:18px; bottom:18px; display:flex; align-items:center; gap:8px; z-index:8; }
        .hud-group { display:flex; align-items:center; gap:2px; background:rgba(255,255,252,.9); backdrop-filter:blur(12px); border:1px solid #e0e2d9; border-radius:10px; box-shadow:0 6px 18px rgba(37,47,38,.08); padding:4px; }
        .hud-button { width:30px; height:28px; border:0; border-radius:7px; background:transparent; color:#7c857a; display:grid; place-items:center; }
        .hud-button:hover { background:#f0f2e8; color:var(--ink); }
        .zoom-label { min-width:43px; text-align:center; color:#6c766b; font-size:11px; font-weight:700; }
        .canvas-legend { position:absolute; right:18px; bottom:18px; z-index:8; display:flex; align-items:center; gap:13px; padding:10px 12px; border:1px solid #e3e4dc; border-radius:10px; background:rgba(255,255,252,.82); backdrop-filter:blur(12px); color:#8b9389; font-size:10px; }
        .legend-item { display:flex; align-items:center; gap:6px; }
        .legend-dot { width:8px; height:8px; border-radius:50%; }
        .floating-hint { position:absolute; top:17px; left:50%; transform:translateX(-50%); padding:7px 12px; border-radius:999px; background:rgba(255,255,251,.84); border:1px solid #e6e7e0; color:#8a9287; font-size:10px; font-weight:600; z-index:8; box-shadow:0 4px 12px rgba(52,64,52,.05); }
        .inspector { width:356px; flex:none; background:var(--panel); border-left:1px solid #dedfd8; display:flex; flex-direction:column; z-index:11; box-shadow:-9px 0 30px rgba(40,48,42,.045); }
        .inspector-top { height:58px; display:flex; align-items:center; justify-content:space-between; padding:0 17px; border-bottom:1px solid #e7e8e1; }
        .inspector-title { display:flex; align-items:center; gap:9px; font-size:12px; font-weight:700; color:#566055; }
        .inspector-title .tiny-dot { width:7px; height:7px; border-radius:50%; background:var(--lime-deep); box-shadow:0 0 0 3px #eaf6bd; }
        .inspector-actions { display:flex; gap:3px; }
        .icon-button { border:0; background:transparent; color:#929a90; display:grid; place-items:center; border-radius:7px; width:29px; height:29px; transition:all .15s var(--ease); }
        .icon-button:hover { background:#f0f1eb; color:var(--ink); }
        .editor-scroll { flex:1; min-height:0; overflow:auto; padding:22px 25px 46px; }
        .editor-scroll::-webkit-scrollbar { width:7px; }
        .editor-scroll::-webkit-scrollbar-thumb { background:#dfe2d8; border-radius:10px; }
        .editor-meta { display:flex; align-items:center; justify-content:space-between; color:#a1a79e; font-size:10px; margin-bottom:17px; }
        .editor-meta .meta-left { display:flex; align-items:center; gap:6px; }
        .editor-meta .meta-dot { width:5px; height:5px; border-radius:50%; background:#b7d928; }
        .note-tag { width:max-content; padding:5px 8px; border-radius:6px; color:#5f6b5b; font-size:9px; font-weight:700; letter-spacing:.05em; text-transform:uppercase; margin-bottom:14px; }
        .editor-title { width:100%; resize:none; border:0; outline:0; background:transparent; color:#243127; font:700 28px/1.12 'Space Grotesk'; letter-spacing:-.05em; margin-bottom:18px; }
        .editor-title::placeholder { color:#c0c6bc; }
        .editor-toolbar { position:sticky; top:-22px; z-index:3; margin:0 -25px 19px; padding:10px 21px; background:rgba(251,251,248,.92); backdrop-filter:blur(12px); border-top:1px solid #eef0e8; border-bottom:1px solid #e9ebe3; display:flex; align-items:center; gap:2px; }
        .editor-toolbar:before { content:''; position:absolute; top:-1px; left:0; right:0; border-top:1px solid rgba(255,255,255,.9); }
        .toolbar-button { width:28px; height:27px; border:0; border-radius:6px; background:transparent; color:#798378; display:grid; place-items:center; }
        .toolbar-button:hover, .toolbar-button.active { background:#edf0e6; color:var(--ink); }
        .toolbar-separator { width:1px; height:18px; background:#e0e3da; margin:0 5px; }
        .editor-body { min-height:360px; outline:0; color:#606d62; font-size:14px; line-height:1.72; }
        .editor-body:focus { color:#536255; }
        .editor-body p { margin:0 0 14px; }
        .editor-body strong { color:#3d5945; font-weight:700; }
        .editor-body em { color:#647464; }
        .editor-body ul, .editor-body ol { margin:2px 0 15px; padding-left:20px; }
        .editor-body li { margin:6px 0; padding-left:4px; }
        .editor-body blockquote { border-left:3px solid var(--lime-deep); margin:19px 0; padding:4px 0 4px 14px; color:#738174; font-style:italic; }
        .editor-body mark { background:#eff6c8; color:#5e702f; padding:1px 3px; border-radius:3px; }
        .editor-divider { height:1px; background:#e9ebe4; margin:25px 0 19px; }
        .backlinks-title { display:flex; align-items:center; justify-content:space-between; color:#8d968b; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; margin-bottom:12px; }
        .backlink { display:flex; align-items:center; gap:9px; border:1px solid #eceee7; border-radius:9px; padding:10px; color:#6e786f; font-size:11px; background:#fff; margin-bottom:7px; }
        .backlink-icon { width:21px; height:21px; background:#f0f2e8; border-radius:6px; display:grid; place-items:center; color:#8b9586; }
        .inspector-footer { min-height:46px; border-top:1px solid #e8e9e2; display:flex; align-items:center; justify-content:space-between; padding:0 18px; color:#a0a69e; font-size:10px; }
        .inspector-reopen { position:absolute; right:17px; top:18px; z-index:14; width:36px; height:36px; border:1px solid #dfe1d8; border-radius:10px; background:rgba(255,255,252,.92); color:#667064; display:grid; place-items:center; box-shadow:0 7px 16px rgba(37,47,38,.1); }
        .inspector-reopen:hover { background:#fff; color:var(--ink); transform:translateY(-1px); }
        .save-status { display:flex; align-items:center; gap:6px; }
        .save-status svg { color:#9bb729; }
        .inspector-footer button { border:0; background:transparent; color:#a0a69e; }
        .inspector-footer button:hover { color:#bc5a4c; }
        .toast { position:absolute; bottom:72px; left:50%; transform:translateX(-50%); z-index:20; display:flex; align-items:center; gap:8px; background:#263229; color:#f6f9ef; border-radius:99px; padding:10px 14px; box-shadow:0 10px 20px rgba(24,32,25,.2); font-size:11px; font-weight:600; animation:toast-in .24s var(--ease); }
        @keyframes toast-in { from { opacity:0; transform:translate(-50%,8px); } to { opacity:1; transform:translate(-50%,0); } }
        @media (max-width: 980px) { .inspector { width:320px; } .top-search { width:140px; } .canvas-legend { display:none; } }
        @media (max-width: 760px) { .left-rail { width:55px; } .inspector { position:absolute; right:0; top:0; bottom:0; width:min(356px, 88vw); } .topbar { padding-left:14px; } .crumbs span:not(.current) { display:none; } .top-search { display:none; } }
      `}</style>

      <aside className="left-rail">
        <div className="rail-stack">
          <div className="brand-mark" title="Mindspace">M</div>
          <div className="rail-divider" />
          <button className={`${iconButton} rail-button active`} title="Canvas"><LayoutGrid size={17} strokeWidth={1.8} /></button>
          <button className={`${iconButton} rail-button`} title="Notes" onClick={() => { setActiveTool("note"); notify("Click anywhere on the canvas to add a note"); }}><FileText size={17} strokeWidth={1.8} /></button>
          <button className={`${iconButton} rail-button`} title="Library" onClick={() => notify("Library view is ready for your next collection")}><Archive size={17} strokeWidth={1.8} /></button>
          <button className={`${iconButton} rail-button`} title="People" onClick={() => notify("Sharing is available from the top bar")}><Users size={17} strokeWidth={1.8} /></button>
        </div>
        <div className="rail-stack">
          <button className={`${iconButton} rail-button`} title="Help" onClick={() => notify("Tip: use H to pan and N to add a note")}><CircleHelp size={17} strokeWidth={1.8} /></button>
          <div className="avatar" title="Aarav Mehta">AM</div>
        </div>
      </aside>

      <main className="main-column">
        <header className="topbar">
          <div className="crumbs">
            <div className="crumb-icon"><BookOpen size={14} strokeWidth={2.1} /></div>
            <span>Workspaces</span><ChevronDown size={13} />
            <span>{space?.name || "Personal OS"}</span><span>/</span>
            {page ? <input aria-label="Canvas title" className="canvas-title-input" value={page.title} onChange={(event) => dispatch({ type: "UPDATE_PAGE", id: page.id, patch: { title: event.target.value || "Untitled Canvas" } })} /> : <span className="current">Thinking in public</span>}
          </div>
          <div className="top-actions">
            <label className="top-search"><Search size={14} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search this space" /><kbd>⌘ K</kbd></label>
            <button className="top-button" onClick={() => notify("Invite link copied to clipboard")}><Share2 size={14} /> Share</button>
            <button className="icon-button" title="More workspace actions" onClick={() => notify("Workspace menu opened")}><MoreHorizontal size={18} /></button>
          </div>
        </header>

        <div className="workspace">
          <section className={`canvas-wrap ${activeTool === "hand" ? "is-hand" : ""}`}>
            <div className={`canvas-board ${activeTool === "hand" ? "is-hand" : ""}`} ref={boardRef} onPointerDown={handleBoardPointerDown} onPointerMove={handleBoardPointerMove} onPointerUp={stopPointerWork} onPointerCancel={stopPointerWork} onWheel={(event) => { if (event.metaKey || event.ctrlKey) { event.preventDefault(); zoomBy(event.deltaY > 0 ? -.04 : .04); } }}>
              <div className="floating-hint">{activeTool === "connect" ? (linkStart ? "Select a second note" : "Select two notes to connect") : "Drag notes to make the thinking visible"}</div>
              <div className="canvas-scene" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
                {groups.map((group) => (
                  <div key={group.id} className="group-zone" style={{ left: group.x, top: group.y, width: group.width, height: group.height, background: group.color, borderColor: group.border, color: group.border }}>
                    <div className="group-head"><span className="group-title" style={{ color: "#516052" }}>{group.title}</span><span className="group-caption">{group.caption}</span></div>
                  </div>
                ))}
                <svg className="connections" viewBox="0 0 1160 850" preserveAspectRatio="none">
                  <defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7" fill="none" stroke="#a1a79d" strokeWidth="1.2" /></marker></defs>
                  {connections.map((connection, index) => {
                    const from = notePosition(connection.from);
                    const to = notePosition(connection.to);
                    const startX = from.x + from.width;
                    const startY = from.y + from.height / 2;
                    const endX = to.x;
                    const endY = to.y + to.height / 2;
                    const bend = Math.max(42, Math.abs(endX - startX) * .42);
                    return <path key={`${connection.from}-${connection.to}-${index}`} className="connection-path" markerEnd="url(#arrow)" d={`M ${startX} ${startY} C ${startX + bend} ${startY}, ${endX - bend} ${endY}, ${endX} ${endY}`} />;
                  })}
                </svg>
                {visibleNotes.map((note) => (
                  <div key={note.id} className={`note-card ${selectedId === note.id ? "selected" : ""} ${linkStart === note.id ? "link-start" : ""}`} style={{ left: note.x, top: note.y, width: note.width, minHeight: note.height }} onPointerDown={(event) => handleCardPointerDown(event, note)} onClick={() => handleCardClick(note)}>
                    <div className="note-ribbon" style={{ background: note.tagColor }}>{note.tag}</div>
                    <h3 className="note-title">{note.title}</h3>
                    <div className="note-preview" dangerouslySetInnerHTML={{ __html: note.body }} />
                    <div className="note-footer"><span className="mini-pill"><i /> {note.pinned ? "Pinned" : "Note"}</span><span>{note.updated.replace("Edited ", "")}</span></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="canvas-hud">
              <div className="hud-group">
                <button className={`hud-button ${activeTool === "select" ? "active" : ""}`} title="Select (V)" onClick={() => setActiveTool("select")}><Move size={15} /></button>
                <button className={`hud-button ${activeTool === "hand" ? "active" : ""}`} title="Pan canvas (H)" onClick={() => setActiveTool("hand")}><Hand size={15} /></button>
                <button className={`hud-button ${activeTool === "note" ? "active" : ""}`} title="Add note (N)" onClick={() => { setActiveTool("note"); notify("Click anywhere on the canvas to add a note"); }}><StickyNote size={15} /></button>
                <button className={`hud-button ${activeTool === "connect" ? "active" : ""}`} title="Connect notes" onClick={() => { setActiveTool("connect"); setLinkStart(null); notify("Select two notes to connect"); }}><Link2 size={15} /></button>
              </div>
              <div className="hud-group">
                <button className="hud-button" title="Zoom out" onClick={() => zoomBy(-.08)}><ZoomOut size={15} /></button>
                <span className="zoom-label">{Math.round(zoom * 100)}%</span>
                <button className="hud-button" title="Zoom in" onClick={() => zoomBy(.08)}><ZoomIn size={15} /></button>
                <button className="hud-button" title="Fit canvas" onClick={() => { setZoom(.78); setPan({ x: 30, y: 28 }); }}><Maximize2 size={14} /></button>
              </div>
            </div>
            <div className="canvas-legend"><span className="legend-item"><i className="legend-dot" style={{ background: "#d9fa62" }} /> Selected</span><span className="legend-item"><i className="legend-dot" style={{ background: "#d6eadd" }} /> Linked</span><span className="legend-item"><Lock size={11} /> Private space</span></div>
            {showToast && <div className="toast"><Check size={14} color="#d9fa62" /> {toast}</div>}
          </section>

          {showInspector && <aside className="inspector">
            <div className="inspector-top"><div className="inspector-title"><span className="tiny-dot" /> Note editor</div><div className="inspector-actions"><button className={iconButton} title="Duplicate note" onClick={() => { addNote(selected.x + 28, selected.y + 28); notify("Note duplicated"); }}><Copy size={15} /></button><button className={iconButton} title="Close inspector" onClick={() => setShowInspector(false)}><X size={16} /></button></div></div>
            <div className="editor-scroll">
              <div className="editor-meta"><span className="meta-left"><Cloud size={12} /> {saveState}</span><span>{selected.updated}</span></div>
              <div className="note-tag" style={{ background: selected.tagColor }}>{selected.tag}</div>
              <textarea className="editor-title" value={selected.title} onChange={(event) => updateNote(selected.id, { title: event.target.value })} rows={2} aria-label="Note title" />
              <div className="editor-toolbar">
                <button className="toolbar-button" title="Bold" onMouseDown={(event) => event.preventDefault()} onClick={() => format("bold")}><Bold size={14} /></button>
                <button className="toolbar-button" title="Italic" onMouseDown={(event) => event.preventDefault()} onClick={() => format("italic")}><Italic size={14} /></button>
                <button className="toolbar-button" title="Underline" onMouseDown={(event) => event.preventDefault()} onClick={() => format("underline")}><Underline size={14} /></button>
                <button className="toolbar-button" title="Highlight" onMouseDown={(event) => event.preventDefault()} onClick={() => format("hiliteColor", "#eff6c8")}><Highlighter size={14} /></button>
                <div className="toolbar-separator" />
                <button className="toolbar-button" title="Bulleted list" onMouseDown={(event) => event.preventDefault()} onClick={() => format("insertUnorderedList")}><List size={15} /></button>
                <button className="toolbar-button" title="Strikethrough" onMouseDown={(event) => event.preventDefault()} onClick={() => format("strikeThrough")}><Strikethrough size={14} /></button>
                <div className="toolbar-separator" />
                <button className="toolbar-button" title="Undo" onClick={() => format("undo")}><Undo2 size={14} /></button>
                <button className="toolbar-button" title="Redo" onClick={() => format("redo")}><Redo2 size={14} /></button>
                <button className="toolbar-button" title="More formatting" onClick={() => notify("More formatting options coming next")}><MoreHorizontal size={15} /></button>
              </div>
                <EditorContent note={selected} onUpdate={(id, body) => updateNote(id, { body })} />
              <div className="editor-divider" />
              <div className="backlinks-title"><span>Connected ideas</span><span>{connections.filter((connection) => connection.from === selected.id || connection.to === selected.id).length}</span></div>
              {connections.filter((connection) => connection.from === selected.id || connection.to === selected.id).slice(0, 3).map((connection) => {
                const otherId = connection.from === selected.id ? connection.to : connection.from;
                const other = notes.find((note) => note.id === otherId);
                return other ? <button key={otherId} className="backlink" onClick={() => setSelectedId(other.id)}><span className="backlink-icon"><Link2 size={12} /></span><span>{other.title}</span><ArrowUpRight size={13} style={{ marginLeft: "auto" }} /></button> : null;
              })}
              <button className="backlink" onClick={() => { setActiveTool("connect"); notify("Select a note to connect"); }}><span className="backlink-icon"><Plus size={13} /></span><span>Add a connected idea</span></button>
            </div>
            <div className="inspector-footer"><span className="save-status"><Check size={13} /> All changes saved</span><button title="Delete note" onClick={removeSelected}><Trash2 size={14} /></button></div>
          </aside>}

          {!showInspector && <button className="inspector-reopen" title="Open note editor" onClick={() => setShowInspector(true)}><PanelRight size={16} /></button>}
        </div>
      </main>
    </div>
  );
}
const _unused = [ArrowDownToLine, Command, Menu, MessageCircle, Send, SlidersHorizontal, SquarePen];
void _unused;
const _unused2 = [Share2, Sparkles];
void _unused2;
