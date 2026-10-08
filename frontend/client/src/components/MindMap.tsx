import { AnimatePresence, motion } from "framer-motion";
import { Maximize2, Moon, Sun, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type MindMapSource = {
  page?: number | null;
  section?: string | null;
  paragraph?: number | null;
  quote?: string;
};

export type MindMapChild = {
  id: string;
  keyword: string;
  summary: string;
  details: string;
  example?: string;
  sourceReference?: MindMapSource;
};

export type MindMapBranch = MindMapChild & {
  children: MindMapChild[];
};

export type MindMapData = {
  topic: string;
  summary?: string;
  details?: string;
  sourceReference?: MindMapSource;
  branches: MindMapBranch[];
};

type MindMapProps = {
  data: MindMapData;
  onNodeOpen?: (node: MindMapData | MindMapBranch | MindMapChild) => void;
};

type PositionedNode = {
  node: MindMapBranch | MindMapChild;
  x: number;
  y: number;
  branchIndex: number;
  kind: "branch" | "child";
  childIndex?: number;
};

const WIDTH = 1200;
const HEIGHT = 800;
const CENTER = { x: WIDTH / 2, y: HEIGHT / 2 };
const BRANCH_COLORS = ["#FFE074", "#AEE4E5", "#FFD1A8", "#F6A9A1", "#C8B6E8", "#B9DCA6"];
const HIGHLIGHT_COLORS = ["#F6D85F", "#84D1D8", "#F4AA65", "#ED9288"];
const DOODLES = ["⚙", "✦", "☼", "★", "✳", "✿"];
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const shortKeyword = (value: string) => value.trim().split(/\s+/).filter(Boolean).slice(0, 3).join(" ");

function makeLayout(branches: MindMapBranch[]): PositionedNode[] {
  const visibleBranches = branches.slice(0, 6);
  return visibleBranches.flatMap((branch, branchIndex) => {
    const angle = (-90 + (360 / visibleBranches.length) * branchIndex) * Math.PI / 180;
    const direction = { x: Math.cos(angle), y: Math.sin(angle) };
    const branchPoint = {
      x: CENTER.x + direction.x * 310,
      y: CENTER.y + direction.y * 215,
    };
    const branchNode: PositionedNode = {
      node: branch,
      x: branchPoint.x,
      y: branchPoint.y,
      branchIndex,
      kind: "branch",
    };
    const children = (branch.children || []).slice(0, 4);
    const spread = children.length === 2 ? 120 : children.length === 3 ? 120 : 110;
    return [
      branchNode,
      ...children.map((child, childIndex): PositionedNode => {
        const offset = (childIndex - (children.length - 1) / 2) * spread;
        return {
          node: child,
          x: branchPoint.x + direction.x * 210 + (Math.abs(direction.x) > 0.45 ? 0 : offset),
          y: branchPoint.y + direction.y * 165 + (Math.abs(direction.x) > 0.45 ? offset : 0),
          branchIndex,
          kind: "child",
          childIndex,
        };
      }),
    ];
  });
}

function nodeKey(position: PositionedNode) {
  return position.kind === "branch"
    ? `branch-${position.branchIndex}`
    : `child-${position.branchIndex}-${position.childIndex}`;
}

function nodeTitle(node: MindMapData | MindMapBranch | MindMapChild) {
  return "keyword" in node ? node.keyword : node.topic;
}

function topicLines(topic: string) {
  const words = shortKeyword(topic).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  for (const word of words) {
    const last = lines.length - 1;
    if (last >= 0 && `${lines[last]} ${word}`.length <= 13) lines[last] += ` ${word}`;
    else lines.push(word);
  }
  return lines;
}

function RoughShape({ x, y, fill, kind, active }: { x: number; y: number; fill: string; kind: string; active: boolean }) {
  const common = {
    fill,
    stroke: "#343434",
    strokeWidth: active ? 3.5 : 2.6,
    strokeLinejoin: "round" as const,
    filter: "url(#mindmap-rough)",
  };
  if (kind === "bubble") return <path {...common} d={`M ${x - 88} ${y - 36} Q ${x} ${y - 44} ${x + 88} ${y - 36} Q ${x + 95} ${y + 27} ${x + 23} ${y + 38} L ${x + 10} ${y + 52} L ${x + 6} ${y + 38} Q ${x - 90} ${y + 37} ${x - 88} ${y - 36}`} />;
  if (kind === "circle") return <ellipse {...common} cx={x} cy={y} rx="82" ry="43" />;
  if (kind === "rounded") return <rect {...common} x={x - 88} y={y - 37} width="176" height="74" rx="25" transform={`rotate(-2 ${x} ${y})`} />;
  if (kind === "box") return <path {...common} d={`M ${x - 83} ${y - 35} L ${x + 83} ${y - 37} L ${x + 87} ${y + 34} L ${x - 85} ${y + 37} Z`} />;
  if (kind === "oval") return <ellipse {...common} cx={x} cy={y} rx="88" ry="42" transform={`rotate(2 ${x} ${y})`} />;
  return <path {...common} d={`M ${x - 83} ${y - 35} Q ${x - 82} ${y - 40} ${x - 75} ${y - 37} L ${x + 82} ${y - 34} L ${x + 85} ${y + 35} Q ${x} ${y + 39} ${x - 84} ${y + 34} Z`} />;
}

export default function MindMap({ data, onNodeOpen }: MindMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const nodeRefs = useRef(new Map<string, SVGGElement>());
  const popoverTimer = useRef<number | undefined>(undefined);
  const [theme, setTheme] = useState<"notebook" | "dark">("notebook");
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [popover, setPopover] = useState({ x: 0, y: 0 });
  const [panelNode, setPanelNode] = useState<MindMapData | MindMapBranch | MindMapChild | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [actionError, setActionError] = useState("");
  const layout = useMemo(() => makeLayout(data.branches || []), [data.branches]);
  const activeNode = layout.find(position => nodeKey(position) === activeKey)?.node
    || (activeKey === "topic" ? data : null);
  const dark = theme === "dark";

  const placePopover = useCallback((key: string) => {
    const node = nodeRefs.current.get(key);
    const container = containerRef.current;
    if (!node || !container) return;
    const nodeRect = node.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const popoverWidth = Math.min(300, containerRect.width - 24);
    const popoverHeight = 150;
    const preferredLeft = nodeRect.left - containerRect.left + nodeRect.width / 2 - popoverWidth / 2;
    const left = clamp(preferredLeft, 12, containerRect.width - popoverWidth - 12);
    let top = nodeRect.bottom - containerRect.top + 12;
    if (top + popoverHeight > containerRect.height) top = nodeRect.top - containerRect.top - popoverHeight - 12;
    setPopover({ x: left, y: clamp(top, 12, Math.max(12, containerRect.height - popoverHeight - 12)) });
  }, []);

  const showPopover = useCallback((key: string, isPinned = false) => {
    setActiveKey(key);
    setPinned(isPinned);
    requestAnimationFrame(() => placePopover(key));
  }, [placePopover]);

  const openNode = useCallback((node: MindMapData | MindMapBranch | MindMapChild) => {
    setPanelNode(node);
    setActiveKey(null);
    setPinned(false);
    onNodeOpen?.(node);
  }, [onNodeOpen]);

  const activateNode = useCallback((node: MindMapData | MindMapBranch | MindMapChild, key: string) => {
    const hasHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!hasHover && activeKey !== key) {
      showPopover(key, true);
      return;
    }
    openNode(node);
  }, [activeKey, openNode, showPopover]);

  useEffect(() => {
    if (!fullscreen) return;
    const update = () => setFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, [fullscreen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveKey(null);
        setPinned(false);
        setPanelNode(null);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActiveKey(null);
        setPinned(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  const downloadPng = useCallback(async () => {
    const svg = svgRef.current;
    if (!svg) return;
    const copy = svg.cloneNode(true) as SVGSVGElement;
    copy.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const serialized = new XMLSerializer().serializeToString(copy);
    const blob = new Blob([serialized], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    try {
      const image = new Image();
      image.src = url;
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("The mind map image could not be rendered."));
      });
      const canvas = document.createElement("canvas");
      canvas.width = WIDTH * 2;
      canvas.height = HEIGHT * 2;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("PNG export is unavailable in this browser.");
      context.fillStyle = dark ? "#17191f" : "#fff6d6";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(value => value ? resolve(value) : reject(new Error("The PNG file could not be created.")), "image/png");
      });
      const pngUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = `${shortKeyword(data.topic).replace(/\s+/g, "-").toLowerCase() || "mind-map"}.png`;
      link.click();
      URL.revokeObjectURL(pngUrl);
    } finally {
      URL.revokeObjectURL(url);
    }
  }, [dark, data.topic]);

  const toggleFullscreen = async () => {
    setActionError("");
    try {
      if (!containerRef.current) return;
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await containerRef.current.requestFullscreen();
        setFullscreen(true);
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Fullscreen is unavailable in this browser.");
    }
  };

  const renderNode = (position: PositionedNode) => {
    const { node, x, y, branchIndex, kind } = position;
    const key = nodeKey(position);
    const active = activeKey === key;
    const isBranch = kind === "branch";
    const label = shortKeyword(node.keyword);
    const shapeKind = ["box", "bubble", "rounded", "circle", "oval", "box"][branchIndex % 6];
    const color = isBranch ? BRANCH_COLORS[branchIndex % BRANCH_COLORS.length] : HIGHLIGHT_COLORS[branchIndex % HIGHLIGHT_COLORS.length];
    const description = `${label}. ${node.summary || "Select to explore this concept."}`;
    return <motion.g
      key={key}
      ref={element => { if (element) nodeRefs.current.set(key, element); else nodeRefs.current.delete(key); }}
      role="button"
      tabIndex={0}
      aria-label={`Mind map ${isBranch ? "branch" : "idea"}: ${label}`}
      aria-describedby={active ? "mindmap-popover" : undefined}
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: active ? 1.05 : 1, rotate: active ? [0, -1.5, 1.5, 0] : 0 }}
      transition={{ opacity: { delay: isBranch ? branchIndex * 0.14 + 0.18 : branchIndex * 0.14 + 0.38 }, scale: { duration: 0.18 }, rotate: { duration: 0.35 } }}
      onMouseEnter={() => showPopover(key)}
      onMouseLeave={() => {
        if (!pinned && activeKey === key) {
          popoverTimer.current = window.setTimeout(() => setActiveKey(null), 140);
        }
      }}
      onFocus={() => showPopover(key)}
      onBlur={() => { if (!pinned) setActiveKey(null); }}
      onClick={() => activateNode(node, key)}
      onKeyDown={event => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          activateNode(node, key);
        }
      }}
      className="cursor-pointer outline-none"
    >
      {isBranch
        ? <RoughShape x={x} y={y} fill={color} kind={shapeKind} active={active} />
        : <g filter="url(#mindmap-rough)">
          <path d={`M ${x - 54} ${y + 13} Q ${x - 20} ${y + 9} ${x + 55} ${y + 12} L ${x + 50} ${y + 25} Q ${x - 10} ${y + 29} ${x - 57} ${y + 25} Z`} fill={color} opacity="0.85" />
          <ellipse cx={x} cy={y + 11} rx="57" ry="18" fill={color} opacity="0.72" />
        </g>}
      <text x={x} y={y + 6} textAnchor="middle" dominantBaseline="middle" fontSize={isBranch ? 22 : 15} fontWeight="700" fill={dark ? "#f5f0e8" : "#303030"} className="mindmap-hand">{label}</text>
      {isBranch && <text x={x + 62} y={y - 23} textAnchor="middle" fontSize="22" aria-hidden="true">{DOODLES[branchIndex % DOODLES.length]}</text>}
      <title>{description}</title>
    </motion.g>;
  };

  return <div ref={containerRef} className={`mindmap-shell relative isolate overflow-hidden rounded-3xl border ${dark ? "mindmap-dark border-slate-700" : "mindmap-notebook border-amber-200"}`}>
    <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-4 pt-4 sm:px-6">
      <div className="min-w-0">
        <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${dark ? "text-orange-300" : "text-rose-600"}`}>Document Mind Map</p>
        <p className={`mt-1 text-xs ${dark ? "text-slate-300" : "text-amber-900/70"}`}>Explore a concept, then open it for the full explanation.</p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button type="button" onClick={() => setTheme(dark ? "notebook" : "dark")} aria-label={`Switch to ${dark ? "notebook" : "dark"} theme`} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition hover:scale-105 ${dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-amber-300 bg-white/80 text-amber-950"}`}>
          {dark ? <Sun size={14} /> : <Moon size={14} />}{dark ? "Notebook" : "Dark"}
        </button>
        <button type="button" onClick={() => { setActionError(""); void downloadPng().catch(error => setActionError(error instanceof Error ? error.message : "The PNG could not be downloaded.")); }} className={`rounded-full border px-3 py-2 text-xs font-bold transition hover:scale-105 ${dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-amber-300 bg-white/80 text-amber-950"}`}>Download as PNG</button>
        <button type="button" onClick={() => void toggleFullscreen()} aria-label={fullscreen ? "Exit fullscreen" : "Open fullscreen"} className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold transition hover:scale-105 ${dark ? "border-slate-600 bg-slate-800 text-slate-100" : "border-amber-300 bg-white/80 text-amber-950"}`}>
          <Maximize2 size={14} />{fullscreen ? "Exit" : "Fullscreen"}
        </button>
      </div>
    </div>
    {actionError && <p role="alert" className={`mx-4 mt-3 rounded-xl border p-3 text-xs ${dark ? "border-red-900 bg-red-950 text-red-100" : "border-red-200 bg-red-50 text-red-800"}`}>{actionError}</p>}
    <div className="relative mx-auto w-full max-w-[1400px]">
      <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="group" aria-label={`Mind map: ${shortKeyword(data.topic)}`} className="mindmap-svg block h-auto w-full">
        <defs>
          <filter id="mindmap-rough" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="12" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8" />
          </filter>
          <filter id="mindmap-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="2" dy="3" stdDeviation="1.5" floodColor="#423b31" floodOpacity="0.2" />
          </filter>
          <marker id="mindmap-arrow" markerWidth="12" markerHeight="12" refX="9" refY="5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10" fill="none" stroke={dark ? "#96cf92" : "#6d9d53"} strokeWidth="2.4" />
          </marker>
          <pattern id="mindmap-paper-lines" width={WIDTH} height="52" patternUnits="userSpaceOnUse">
            <path d="M 0 51.5 H 1200" stroke={dark ? "#3c424a" : "#a8a08c"} strokeWidth="1" opacity={dark ? "0.5" : "0.58"} />
          </pattern>
        </defs>
        <rect width={WIDTH} height={HEIGHT} fill={dark ? "#17191f" : "#fff6d6"} />
        <rect width={WIDTH} height={HEIGHT} fill="url(#mindmap-paper-lines)" />
        <path d="M 76 0 V 800" stroke={dark ? "#e8593c" : "#e88f9a"} strokeWidth="2" opacity="0.65" />
        {layout.filter(position => position.kind === "branch").map(position => {
          const dx = position.x - CENTER.x;
          const dy = position.y - CENTER.y;
          const length = Math.hypot(dx, dy);
          const sx = CENTER.x + dx / length * 110;
          const sy = CENTER.y + dy / length * 55;
          const ex = position.x - dx / length * 92;
          const ey = position.y - dy / length * 48;
          return <motion.path key={`connector-${position.branchIndex}`} d={`M ${sx} ${sy} Q ${(sx + ex) / 2 + (position.branchIndex % 2 ? 10 : -10)} ${(sy + ey) / 2} ${ex} ${ey}`} fill="none" stroke={activeKey?.includes(`-${position.branchIndex}`) ? "#e8593c" : dark ? "#96cf92" : "#6d9d53"} strokeWidth="8" strokeLinecap="round" markerEnd="url(#mindmap-arrow)" filter="url(#mindmap-rough)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.9 }} transition={{ delay: position.branchIndex * 0.12 + 0.1, duration: 0.5 }} />;
        })}
        {layout.filter(position => position.kind === "child").map(position => {
          const branch = layout.find(candidate => candidate.kind === "branch" && candidate.branchIndex === position.branchIndex);
          if (!branch) return null;
          const key = nodeKey(position);
          const active = activeKey === key || activeKey === `branch-${position.branchIndex}`;
          return <motion.path key={`child-line-${key}`} d={`M ${branch.x} ${branch.y} Q ${(branch.x + position.x) / 2 - 8} ${(branch.y + position.y) / 2 + (position.childIndex! % 2 ? 7 : -7)} ${position.x} ${position.y}`} fill="none" stroke={active ? "#e8593c" : dark ? "#b3a3ef" : "#766d60"} strokeWidth={active ? 3 : 2} strokeDasharray="5 6" strokeLinecap="round" filter="url(#mindmap-rough)" initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 0.85 }} transition={{ delay: position.branchIndex * 0.12 + 0.3, duration: 0.35 }} />;
        })}
        <motion.g ref={element => { if (element) nodeRefs.current.set("topic", element); else nodeRefs.current.delete("topic"); }} initial={{ opacity: 0, scale: 0.72 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 180, damping: 15 }} role="button" tabIndex={0} aria-label={`Main topic: ${shortKeyword(data.topic)}`} onMouseEnter={() => showPopover("topic")} onMouseLeave={() => { if (!pinned && activeKey === "topic") popoverTimer.current = window.setTimeout(() => setActiveKey(null), 140); }} onFocus={() => showPopover("topic")} onClick={() => activateNode(data, "topic")} onKeyDown={event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activateNode(data, "topic"); } }} className="cursor-pointer">
          <ellipse cx={CENTER.x} cy={CENTER.y} rx="142" ry="77" fill={dark ? "#E8593C" : "#ff83a5"} stroke={dark ? "#f8c0a7" : "#303030"} strokeWidth="4" filter="url(#mindmap-rough) url(#mindmap-shadow)" />
          <ellipse cx={CENTER.x} cy={CENTER.y} rx="151" ry="82" fill="none" stroke={dark ? "#f29a74" : "#303030"} strokeWidth="1.5" strokeDasharray="3 5" filter="url(#mindmap-rough)" />
          <text x={CENTER.x} y={CENTER.y} textAnchor="middle" fontSize="30" fontWeight="700" fill={dark ? "#fff7ee" : "#352e32"} className="mindmap-hand">{topicLines(data.topic).map((line, index) => <tspan key={line} x={CENTER.x} y={CENTER.y + (index - (topicLines(data.topic).length - 1) / 2) * 34} dominantBaseline="middle">{line}</tspan>)}</text>
          <title>{data.summary || `${data.topic} mind map`}</title>
        </motion.g>
        <g>{layout.map(renderNode)}</g>
      </svg>
      <AnimatePresence>
        {activeNode && activeKey && <motion.div id="mindmap-popover" role="tooltip" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} className={`absolute z-20 w-[min(300px,calc(100%-24px))] rounded-2xl border p-4 shadow-xl ${dark ? "border-slate-600 bg-slate-900 text-slate-100" : "border-amber-200 bg-white text-slate-800"}`} style={{ left: popover.x, top: popover.y }} onMouseEnter={() => { window.clearTimeout(popoverTimer.current); setPinned(true); }} onMouseLeave={() => { setPinned(false); setActiveKey(null); }}>
          <p className={`font-bold ${dark ? "text-orange-200" : "text-rose-700"}`}>{nodeTitle(activeNode)}</p>
          <p className="mt-1.5 text-xs leading-relaxed">{activeNode.summary || "Explore this key idea from your document."}</p>
          {"example" in activeNode && activeNode.example && <p className={`mt-2 text-xs ${dark ? "text-slate-300" : "text-slate-600"}`}>Example: {activeNode.example}</p>}
          <button type="button" className={`mt-3 text-xs font-extrabold underline underline-offset-2 ${dark ? "text-orange-200" : "text-[#1b7a52]"}`} onClick={() => openNode(activeNode)}>Learn more</button>
        </motion.div>}
      </AnimatePresence>
    </div>
    <AnimatePresence>
      {panelNode && <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/30" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => { if (event.target === event.currentTarget) setPanelNode(null); }}>
        <motion.aside role="dialog" aria-modal="true" aria-label={`Details for ${nodeTitle(panelNode)}`} initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28 }} className={`h-full w-full max-w-lg overflow-y-auto p-6 shadow-2xl sm:p-8 ${dark ? "bg-slate-950 text-slate-100" : "bg-[#fffdf7] text-slate-800"}`}>
          <div className="flex items-start justify-between gap-4">
            <div><p className={`text-xs font-bold uppercase tracking-widest ${dark ? "text-orange-300" : "text-rose-600"}`}>Learn more</p><h2 className="mt-2 text-2xl font-extrabold">{nodeTitle(panelNode)}</h2></div>
            <button type="button" autoFocus aria-label="Close details" onClick={() => setPanelNode(null)} className={`rounded-full p-2 ${dark ? "hover:bg-slate-800" : "hover:bg-amber-100"}`}><X size={20} /></button>
          </div>
          {panelNode.summary && <p className="mt-6 text-sm font-semibold leading-relaxed">{panelNode.summary}</p>}
          <p className={`mt-4 whitespace-pre-wrap text-sm leading-7 ${dark ? "text-slate-300" : "text-slate-700"}`}>{panelNode.details || panelNode.summary || "There are no further notes for this keyword."}</p>
          {"example" in panelNode && panelNode.example && <div className={`mt-6 rounded-2xl p-4 ${dark ? "bg-slate-900" : "bg-amber-50"}`}><p className="text-xs font-extrabold uppercase tracking-wider">Example</p><p className="mt-2 text-sm leading-relaxed">{panelNode.example}</p></div>}
          {panelNode.sourceReference && <div className={`mt-7 rounded-2xl border p-4 ${dark ? "border-slate-700 bg-slate-900" : "border-amber-200 bg-amber-50/80"}`}>
            <p className="text-xs font-extrabold uppercase tracking-wider">Source</p>
            <p className="mt-2 text-xs">{[panelNode.sourceReference.section, panelNode.sourceReference.page ? `Page ${panelNode.sourceReference.page}` : null, panelNode.sourceReference.paragraph ? `Paragraph ${panelNode.sourceReference.paragraph}` : null].filter(Boolean).join(" · ") || "Uploaded document"}</p>
            {panelNode.sourceReference.quote && <blockquote className="mt-3 border-l-2 border-emerald-600 pl-3 text-sm italic leading-relaxed">“{panelNode.sourceReference.quote}”</blockquote>}
          </div>}
        </motion.aside>
      </motion.div>}
    </AnimatePresence>
    <style>{`
      .mindmap-shell { min-height: 300px; }
      .mindmap-notebook { background-color: #fff6d6; }
      .mindmap-dark { background-color: #17191f; }
      .mindmap-hand { font-family: "Patrick Hand", "Caveat", "Comic Sans MS", cursive; letter-spacing: .02em; }
      .mindmap-svg g[role="button"]:focus-visible, .mindmap-svg g[tabindex]:focus-visible { outline: 3px solid #e8593c; outline-offset: 5px; }
      @media (prefers-reduced-motion: reduce) { .mindmap-shell *, .mindmap-shell *::before, .mindmap-shell *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
      :fullscreen.mindmap-shell { overflow: auto; }
    `}</style>
  </div>;
}
