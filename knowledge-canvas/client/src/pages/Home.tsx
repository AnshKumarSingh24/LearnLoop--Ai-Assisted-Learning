import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { ArrowDownRight, ArrowLeft, ArrowRight, BookOpen, ChevronDown, Command, FileText, FolderOpen, Grip, Link2, Maximize2, MessageCircle, Minus, MoreHorizontal, Move, Plus, Search, Sparkles, StickyNote, Upload, WandSparkles, X, ZoomIn, ZoomOut } from "lucide-react";

type Accent = "mint" | "lilac" | "peach" | "sky" | "sand";
type CardType = "note" | "quote" | "question" | "insight" | "summary";
type CanvasCard = { id: number; title: string; body: string; cardType: CardType; accent: Accent; x: number; y: number; width: number; height: number; sourceId?: number };
type CanvasLink = { id: number; fromCardId: number; toCardId: number; label?: string | null };
type Source = { id: number; title: string; type: string; meta: string; excerpt: string; color: string };

const starterCards: CanvasCard[] = [
  { id: 1, title: "Learning is a change in mental models", body: "A working thesis captured from the reading. Keep the wording close to the source, then add your own interpretation below.", cardType: "quote", accent: "mint", x: 70, y: 220, width: 280, height: 188, sourceId: 1 },
  { id: 2, title: "Models become useful when they connect", body: "The value of an idea often comes from the bridges it creates between different observations.", cardType: "insight", accent: "lilac", x: 430, y: 350, width: 282, height: 188, sourceId: 1 },
  { id: 3, title: "What changes when the source is local?", body: "Question for the next pass through the research. Add evidence, counterexamples, and a synthesis card.", cardType: "question", accent: "peach", x: 830, y: 205, width: 280, height: 180, sourceId: 2 },
  { id: 4, title: "The computer as a thinking partner", body: "A pattern across three excerpts: tools become formative when they let people externalize, revisit, and rearrange ideas.", cardType: "note", accent: "sky", x: 1180, y: 430, width: 286, height: 192, sourceId: 3 },
  { id: 5, title: "A small synthesis", body: "Better learning may be less about collecting more information and more about seeing relationships clearly.", cardType: "summary", accent: "sand", x: 1200, y: 110, width: 270, height: 172, sourceId: 1 },
];

const starterSources: Source[] = [
  { id: 1, title: "Point of View Is Worth 80 IQ Points", type: "Book excerpt", meta: "Alan Kay · 8 highlights", excerpt: "Learning happens through the improvement of our mental models and computers are the best way to mediate this kind of learning.", color: "#d9f4e8" },
  { id: 2, title: "The Design of Everyday Things", type: "PDF document", meta: "Don Norman · 12 highlights", excerpt: "Good design makes the actions we can take visible and the results of our actions intelligible.", color: "#f8dfd5" },
  { id: 3, title: "Open Notebook research thread", type: "SurfSense import", meta: "14 sources · synced today", excerpt: "A connected collection of research notes, citations, and questions gathered across the web.", color: "#e5def8" },
];

const groups = [
  { title: "Why models matter", x: 35, y: 155, w: 755, h: 465, color: "#d7f1e7" },
  { title: "Learning through making", x: 790, y: 80, w: 740, h: 555, color: "#e5def8" },
  { title: "Questions to carry forward", x: 1010, y: 665, w: 495, h: 300, color: "#f8e1d9" },
];

function CanvasCardView({ card, selected, onSelect, onMove }: { card: CanvasCard; selected: boolean; onSelect: () => void; onMove: (id: number, x: number, y: number) => void }) {
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    drag.current = { dx: event.clientX - rect.left, dy: event.clientY - rect.top };
    event.currentTarget.setPointerCapture(event.pointerId);
    onSelect();
  };
  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const stage = event.currentTarget.closest("[data-canvas-stage]") as HTMLElement | null;
    if (!stage) return;
    const bounds = stage.getBoundingClientRect();
    const zoom = Number(stage.dataset.zoom || 1);
    const x = (event.clientX - bounds.left) / zoom - drag.current.dx / zoom;
    const y = (event.clientY - bounds.top) / zoom - drag.current.dy / zoom;
    onMove(card.id, Math.max(0, x), Math.max(0, y));
  };
  const onPointerUp = () => { drag.current = null; };
  return <div className={`canvas-card card-${card.accent} ${selected ? "is-selected" : ""}`} style={{ left: card.x, top: card.y, width: card.width, minHeight: card.height }} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
    <div className="card-grip"><Grip size={14} /><span>{card.cardType}</span><MoreHorizontal size={16} /></div>
    <h3>{card.title}</h3>
    <p>{card.body}</p>
    {card.sourceId && <div className="card-source"><BookOpen size={13} /> Source passage linked</div>}
  </div>;
}

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [cards, setCards] = useState<CanvasCard[]>(starterCards);
  const [links, setLinks] = useState<CanvasLink[]>([{ id: 1, fromCardId: 1, toCardId: 2 }, { id: 2, fromCardId: 2, toCardId: 3 }, { id: 3, fromCardId: 3, toCardId: 4 }, { id: 4, fromCardId: 5, toCardId: 2 }]);
  const [sources] = useState<Source[]>(starterSources);
  const [selectedId, setSelectedId] = useState(1);
  const [zoom, setZoom] = useState(0.78);
  const [pan, setPan] = useState({ x: 90, y: 15 });
  const [activePanel, setActivePanel] = useState<"inspector" | "sources">("inspector");
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [commandOpen, setCommandOpen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const panStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const [workspaceId, setWorkspaceId] = useState<number | null>(null);
  const [authSettled, setAuthSettled] = useState(false);
  const [canvasId, setCanvasId] = useState<number | null>(null);
  const bootstrap = trpc.workspace.bootstrap.useQuery(undefined, { enabled: isAuthenticated });
  const canvasQuery = trpc.workspace.canvas.useQuery({ workspaceId: workspaceId ?? 0, canvasId: canvasId ?? undefined }, { enabled: Boolean(workspaceId) });
  const createCard = trpc.workspace.createCard.useMutation();
  const createSyncRun = trpc.workspace.createSyncRun.useMutation();
  const moveCard = trpc.workspace.moveCard.useMutation();
  const updateViewport = trpc.workspace.updateViewport.useMutation();
  const searchQuery = trpc.workspace.search.useQuery({ workspaceId: workspaceId ?? 0, query: search }, { enabled: Boolean(workspaceId && search.length > 1) });

  useEffect(() => {
    const timer = window.setTimeout(() => setAuthSettled(true), 900);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    if (bootstrap.data?.id) { setWorkspaceId(bootstrap.data.id); }
  }, [bootstrap.data]);
  useEffect(() => {
    if (canvasQuery.data?.canvas) {
      setCanvasId(canvasQuery.data.canvas.id);
      if (canvasQuery.data.cards.length) setCards(canvasQuery.data.cards as CanvasCard[]);
      if (canvasQuery.data.links.length) setLinks(canvasQuery.data.links as CanvasLink[]);
      setZoom(canvasQuery.data.canvas.zoom);
      setPan({ x: canvasQuery.data.canvas.viewportX, y: canvasQuery.data.canvas.viewportY });
    }
  }, [canvasQuery.data]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") { event.preventDefault(); setCommandOpen(true); }
      if (event.key === "/" && document.activeElement?.tagName !== "INPUT") { event.preventDefault(); setSearchOpen(true); }
      if (event.key === "Escape") { setCommandOpen(false); setSearchOpen(false); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  }, []);

  const selected = cards.find(card => card.id === selectedId) ?? cards[0];
  const syncRuns = trpc.workspace.syncRuns.useQuery({ workspaceId: workspaceId ?? 0 }, { enabled: Boolean(workspaceId) });
  const selectedSource = sources.find(source => source.id === selected?.sourceId) ?? sources[0];
  const filteredCards = useMemo(() => search.length > 1 ? cards.filter(card => `${card.title} ${card.body}`.toLowerCase().includes(search.toLowerCase())) : cards, [cards, search]);
  const handleMove = (id: number, x: number, y: number) => {
    setCards(current => current.map(card => card.id === id ? { ...card, x, y } : card));
    if (canvasId) moveCard.mutate({ cardId: id, x, y });
  };
  const handleStagePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest(".canvas-card")) return;
    setIsPanning(true); panStart.current = { x: event.clientX, y: event.clientY, px: pan.x, py: pan.y }; event.currentTarget.setPointerCapture(event.pointerId);
  };
  const handleStagePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!isPanning) return; setPan({ x: panStart.current.px + event.clientX - panStart.current.x, y: panStart.current.py + event.clientY - panStart.current.y });
  };
  const finishPan = () => { setIsPanning(false); if (canvasId) updateViewport.mutate({ canvasId, x: pan.x, y: pan.y, zoom }); };
  const addCard = () => {
    const next: CanvasCard = { id: Date.now(), title: "New idea", body: "Write a thought, question, or evidence here…", cardType: "note", accent: "mint", x: 420 - pan.x / zoom, y: 260 - pan.y / zoom, width: 270, height: 170 };
    setCards(current => [...current, next]); setSelectedId(next.id); setCommandOpen(false);
    if (canvasId) createCard.mutate({ canvasId, title: next.title, body: next.body, cardType: next.cardType, accent: next.accent, x: next.x, y: next.y });
  };
  const changeZoom = (delta: number) => { const next = Math.max(0.45, Math.min(1.35, zoom + delta)); setZoom(next); if (canvasId) updateViewport.mutate({ canvasId, x: pan.x, y: pan.y, zoom: next }); };

  if (loading && !authSettled) return <div className="app-loading"><div className="loading-mark">K</div><p>Opening your garden…</p></div>;
  if (!isAuthenticated) return <div className="welcome-screen"><div className="welcome-orbit"><div className="orbit-dot dot-one" /><div className="orbit-dot dot-two" /><div className="welcome-core">K</div></div><p className="eyebrow">A quieter way to think</p><h1>Make the shape of your thinking visible.</h1><p className="welcome-copy">A calm, visual workspace for collecting sources, connecting ideas, and returning to the questions that matter.</p><Button onClick={() => startLogin()} className="welcome-button">Enter your garden <ArrowRight size={16} /></Button></div>;

  return <div className="knowledge-app">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark">K</div><div><strong>Knowledge Garden</strong><span>Private workspace</span></div></div>
      <div className="breadcrumb"><span>Library</span><ChevronDown size={14} /><strong>Learning Garden</strong><span className="saved-pill">Saved just now</span></div>
      <div className="top-actions"><button className="icon-button" title="Search" onClick={() => setSearchOpen(true)}><Search size={17} /></button><button className="icon-button" title="Command menu" onClick={() => setCommandOpen(true)}><Command size={17} /></button><div className="avatar">{user?.name?.slice(0, 1) ?? "Y"}</div></div>
    </header>
    <div className="work-area">
      <aside className="left-rail">
        <div className="rail-section"><button className="rail-item active"><Move size={17} /><span>Canvas</span></button><button className="rail-item" onClick={() => setActivePanel("sources")}><BookOpen size={17} /><span>Sources</span><em>{sources.length}</em></button><button className="rail-item"><StickyNote size={17} /><span>Notes</span></button></div>
        <div className="rail-divider" />
        <div className="rail-section small"><button className="rail-item"><FolderOpen size={16} /><span>All boards</span></button><button className="rail-item"><Link2 size={16} /><span>Connections</span></button><button className="rail-item"><Sparkles size={16} /><span>AI studio</span></button></div>
        <div className="rail-bottom"><button className="rail-item"><MoreHorizontal size={17} /><span>More</span></button></div>
      </aside>
      <main className="canvas-shell">
        <div className="canvas-toolbar"><div className="toolbar-left"><button className="tool-button selected"><Move size={15} /></button><button className="tool-button" onClick={addCard}><StickyNote size={15} /></button><button className="tool-button"><ArrowDownRight size={15} /></button><span className="toolbar-divider" /><button className="tool-button" onClick={() => setCommandOpen(true)}><Plus size={15} /></button></div><div className="toolbar-center"><span className="board-state"><span className="state-dot" /> Live canvas</span></div><div className="toolbar-right"><button className="tool-button" onClick={() => setZoom(0.78)}><Maximize2 size={15} /></button><button className="tool-button" onClick={() => changeZoom(-0.1)}><ZoomOut size={15} /></button><span className="zoom-value">{Math.round(zoom * 100)}%</span><button className="tool-button" onClick={() => changeZoom(0.1)}><ZoomIn size={15} /></button></div></div>
        <div className={`canvas-viewport ${isPanning ? "is-panning" : ""}`} data-canvas-stage data-zoom={zoom} onPointerDown={handleStagePointerDown} onPointerMove={handleStagePointerMove} onPointerUp={finishPan} onPointerLeave={finishPan}>
          <div className="canvas-grid" style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}>
            {groups.map(group => <div key={group.title} className="card-group" style={{ left: group.x, top: group.y, width: group.w, height: group.h, background: group.color }}><div className="group-title">{group.title}<MoreHorizontal size={16} /></div></div>)}
            <svg className="link-layer" width="1700" height="1100" aria-hidden="true"><defs><marker id="canvas-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#9eb6a6" /></marker></defs>{links.map(link => { const from = cards.find(card => card.id === link.fromCardId); const to = cards.find(card => card.id === link.toCardId); if (!from || !to) return null; const x1 = from.x + from.width; const y1 = from.y + from.height / 2; const x2 = to.x; const y2 = to.y + to.height / 2; const bend = Math.max(50, Math.abs(x2 - x1) / 2); return <path key={link.id} d={`M${x1} ${y1} C${x1 + bend} ${y1}, ${x2 - bend} ${y2}, ${x2} ${y2}`} markerEnd="url(#canvas-arrow)" />; })}</svg>
            {filteredCards.map(card => <CanvasCardView key={card.id} card={card} selected={card.id === selectedId} onSelect={() => { setSelectedId(card.id); setActivePanel("inspector"); }} onMove={handleMove} />)}
          </div>
        </div>
        <div className="canvas-status"><span><span className="state-dot" /> Autosaved</span><span>Drag to pan · Scroll to zoom · Double click to add</span></div>
      </main>
      <aside className="inspector">
        <div className="inspector-tabs"><button className={activePanel === "inspector" ? "active" : ""} onClick={() => setActivePanel("inspector")}>Inspector</button><button className={activePanel === "sources" ? "active" : ""} onClick={() => setActivePanel("sources")}>Sources <span>{sources.length}</span></button></div>
        {activePanel === "sources" ? <div className="source-panel"><div className="panel-heading"><div><p className="eyebrow">Library</p><h2>Research sources</h2></div><button className="round-button"><Upload size={15} /></button></div><div className="source-search"><Search size={15} /><input placeholder="Filter sources" /></div>{sources.map(source => <button className="source-item" key={source.id} onClick={() => { const linked = cards.find(card => card.sourceId === source.id); if (linked) setSelectedId(linked.id); setActivePanel("inspector"); }}><div className="source-icon" style={{ background: source.color }}><FileText size={16} /></div><div><strong>{source.title}</strong><span>{source.type} · {source.meta}</span></div><ArrowRight size={15} /></button>)}<button className="add-source"><Plus size={15} /> Add a source</button></div> : <div className="inspector-content">{selected && <><div className={`inspector-banner banner-${selected.accent}`}><span>{selected.cardType}</span><button><MoreHorizontal size={17} /></button></div><div className="inspector-heading"><div className="editable-title">{selected.title}</div><button className="round-button"><WandSparkles size={15} /></button></div><div className="inspector-meta"><span><span className="state-dot" /> Card saved</span><span>Just now</span></div><div className="inspector-block"><label>Thought</label><div className="inspector-body"><Streamdown>{selected.body}</Streamdown></div></div>{selectedSource && <div className="linked-source"><div className="linked-source-top"><BookOpen size={15} /><span>Linked source</span><ArrowRight size={14} /></div><strong>{selectedSource.title}</strong><p>“{selectedSource.excerpt}”</p><div className="citation-row"><span>Passage 04</span><span>Open reading view</span></div></div>}<div className="ai-suggestion"><Sparkles size={15} /><div><strong>Ask the garden</strong><p>Summarize this card with its connected sources.</p></div><button onClick={() => toast("AI suggestion queued for this card")}>Ask</button></div><div className="inspector-footer"><button><Link2 size={15} /> Add connection</button><button><MessageCircle size={15} /> Discuss</button></div></>}</div>}
      </aside>
    </div>
    {searchOpen && <div className="overlay-layer" onMouseDown={() => setSearchOpen(false)}><div className="search-dialog" onMouseDown={e => e.stopPropagation()}><div className="dialog-input"><Search size={19} /><Input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search cards and sources…" /><kbd>esc</kbd></div><div className="search-results">{search.length > 1 ? <>{filteredCards.map(card => <button key={card.id} onClick={() => { setSelectedId(card.id); setSearchOpen(false); }}><StickyNote size={15} /><span><strong>{card.title}</strong><em>{card.cardType} · Learning Garden</em></span><ArrowRight size={15} /></button>)}{searchQuery.data?.sources?.map(source => <button key={source.id}><BookOpen size={15} /><span><strong>{source.title}</strong><em>Source · {source.sourceType}</em></span><ArrowRight size={15} /></button>)}</> : <div className="empty-search"><Search size={22} /><p>Type to search across your garden</p><span>Cards, sources, notes, and boards</span></div>}</div></div></div>}
    {commandOpen && <div className="overlay-layer" onMouseDown={() => setCommandOpen(false)}><div className="command-dialog" onMouseDown={e => e.stopPropagation()}><div className="command-heading"><div className="command-symbol"><Command size={17} /></div><div><strong>Command garden</strong><span>Quick actions for your workspace</span></div><button onClick={() => setCommandOpen(false)}><X size={16} /></button></div><div className="command-list"><button onClick={addCard}><StickyNote size={17} /><span><strong>New card</strong><em>Capture a thought on the canvas</em></span><kbd>n</kbd></button><button onClick={() => { setActivePanel("sources"); setCommandOpen(false); }}><BookOpen size={17} /><span><strong>Open source library</strong><em>Browse reading material and excerpts</em></span><kbd>s</kbd></button><button onClick={() => { setSearchOpen(true); setCommandOpen(false); }}><Search size={17} /><span><strong>Search this garden</strong><em>Find cards, sources, and notes</em></span><kbd>/</kbd></button><button onClick={() => { if (workspaceId) createSyncRun.mutate({ workspaceId, adapter: "surfsense" }, { onSuccess: () => { toast("SurfSense sync started"); syncRuns.refetch(); } }); }}><Sparkles size={17} /><span><strong>Sync research adapters</strong><em>Open Notebook · SurfSense · NotebookLlama</em></span><kbd>↵</kbd></button></div></div></div>}
  </div>;
}
