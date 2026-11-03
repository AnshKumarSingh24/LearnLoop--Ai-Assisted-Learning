import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Check,
  Star,
  Sparkles,
  Quote,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  Grid,
  BookOpen,
  RotateCcw,
  Lightbulb,
  ArrowRight,
  HelpCircle,
  Layers,
  Award,
} from "lucide-react";

export type SketchnoteVisual = {
  type?: string;
  caption?: string;
  labels?: string[];
  steps?: string[];
  dataPoints?: { label: string; value: number }[];
  comparison?: { titleA: string; titleB: string; itemsA: string[]; itemsB: string[] };
};

export type SketchnoteEntry = {
  id?: string;
  pageNumber?: number;
  sectionNumber?: number;
  number?: number;
  heading?: string;
  title?: string;
  explanation?: string;
  summary?: string;
  keyPoints?: string[];
  highlightedTerms?: { term: string; definition: string }[];
  visual?: SketchnoteVisual;
  example?: string | null;
  takeaway?: string;
  sourceReference?: {
    quote?: string;
    section?: string | null;
    page?: number | null;
    paragraph?: number | null;
  };
};

export type SketchnoteNotebookProps = {
  title: string;
  subtitle?: string;
  overview?: string;
  learningObjectives?: string[];
  entries: SketchnoteEntry[];
  activePage?: number;
  onPageChange?: (page: number) => void;
  zoom?: number;
  editing?: boolean;
  onEditEntry?: (index: number, field: string, value: any) => void;
};

// Pastel badge colors matching the circled numbers in the reference notebook pages
const BADGE_COLORS = [
  { bg: "#FEF9C3", border: "#1E293B", text: "#0F172A", name: "Butter Yellow" }, // #5 in Page 4
  { bg: "#FCE7F3", border: "#1E293B", text: "#0F172A", name: "Rose Pink" },      // #6 in Page 4
  { bg: "#E0F2FE", border: "#1E293B", text: "#0F172A", name: "Sky Blue" },       // #7
  { bg: "#DCFCE7", border: "#1E293B", text: "#0F172A", name: "Mint Green" },     // #8
  { bg: "#FFEDD5", border: "#1E293B", text: "#0F172A", name: "Soft Orange" },    // #9
  { bg: "#F3E8FF", border: "#1E293B", text: "#0F172A", name: "Lavender" },       // #10
  { bg: "#CCFBF1", border: "#1E293B", text: "#0F172A", name: "Aqua" },           // #11
  { bg: "#FEF08A", border: "#1E293B", text: "#0F172A", name: "Lemon" },          // #12
];

// Hand-drawn radiating blue ink accent dashes around the main heading
function RadiatingHeadingAccents({ direction }: { direction: "left" | "right" }) {
  if (direction === "left") {
    return (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 text-[#2563EB] inline-block align-middle mr-1.5"
        aria-hidden="true"
      >
        <path d="M19 12H5" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M17 6L7 10" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M17 18L7 14" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 text-[#2563EB] inline-block align-middle ml-1.5"
      aria-hidden="true"
    >
      <path d="M5 12H19" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 6L17 10" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M7 18L17 14" stroke="#2563EB" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

// Text formatter that adds blue ink underlines to key phrases, terms, or quoted words
function HandDrawnUnderlinedText({
  text,
  highlightTerms = [],
  className = "",
}: {
  text: string;
  highlightTerms?: string[];
  className?: string;
}) {
  if (!text) return null;

  // If specific highlight terms are supplied, underline them
  if (highlightTerms.length > 0) {
    const pattern = new RegExp(`(${highlightTerms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
    const parts = text.split(pattern);
    return (
      <span className={className}>
        {parts.map((part, i) => {
          const isMatch = highlightTerms.some(t => t.toLowerCase() === part.toLowerCase());
          if (isMatch) {
            return (
              <span key={i} className="underline decoration-[#38BDF8] decoration-[2px] underline-offset-[3px] font-semibold text-slate-900">
                {part}
              </span>
            );
          }
          return part;
        })}
      </span>
    );
  }

  // Automatic heuristic underline for terms preceding colons, quotes, or key action phrases
  // e.g. "Temperature: low = ...", "generation time", "text", "already done", "actual knowledge"
  const parts = text.split(/("[^"]+"|^[A-Za-z0-9\s()-]+:|\b(?:generation time|already done|actual knowledge|budget you spend|inflate the bill|low randomness|higher randomness)\b)/gi);

  return (
    <span className={className}>
      {parts.map((part, i) => {
        if (!part) return null;
        if (
          part.startsWith('"') && part.endsWith('"') ||
          part.endsWith(":") ||
          /^(generation time|already done|actual knowledge|budget you spend|inflate the bill|low randomness|higher randomness)$/i.test(part.trim())
        ) {
          return (
            <span key={i} className="underline decoration-[#38BDF8] decoration-[2px] underline-offset-[3px] font-semibold text-slate-900">
              {part}
            </span>
          );
        }
        return part;
      })}
    </span>
  );
}

// Circled checkmark bullet matching reference: (✓) in blue outline & blue checkmark
function CircledCheckmark() {
  return (
    <span
      className="inline-flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border-[1.6px] border-[#2563EB] bg-white text-[#2563EB] mt-[1.5px] shadow-2xs"
      aria-hidden="true"
    >
      <Check size={11} strokeWidth={3} />
    </span>
  );
}

// Hand-Drawn Diagrams rendering exact replicas of user reference images
function HandDrawnDiagram({
  visual,
  heading = "",
  explanation = "",
  themeIndex = 0,
}: {
  visual?: SketchnoteVisual;
  heading?: string;
  explanation?: string;
  themeIndex?: number;
}) {
  const combined = `${heading} ${explanation} ${visual?.type || ""} ${visual?.caption || ""}`.toLowerCase();

  // 1. DECODING PARAMETERS / TEMPERATURE (Page 4 Section 5 Reference Replica)
  if (
    combined.includes("decoding") ||
    combined.includes("temperature") ||
    combined.includes("top-k") ||
    combined.includes("top-p") ||
    combined.includes("probability") ||
    visual?.type === "comparison" && (combined.includes("token") || combined.includes("diverse"))
  ) {
    return (
      <div className="w-full flex flex-col font-hand">
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Temperature 0.2 (more focused) Column */}
          <div className="flex flex-col">
            <div className="rounded-lg border-[1.6px] border-slate-800 bg-[#DDF4FF] px-2 py-0.5 text-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 block leading-tight">
                Temperature 0.2
              </span>
            </div>
            <span className="text-[9px] text-slate-700 font-semibold text-center mt-0.5 block">
              (more focused)
            </span>

            {/* Horizontal Bar Chart */}
            <div className="mt-2 space-y-1">
              {[
                { token: "the", prob: "0.72", pct: 72, color: "#60A5FA" },
                { token: "a", prob: "0.12", pct: 24, color: "#FDE047" },
                { token: "it", prob: "0.07", pct: 16, color: "#F472B6" },
                { token: "there", prob: "0.05", pct: 12, color: "#4ADE80" },
                { token: "they", prob: "0.04", pct: 9, color: "#C084FC" },
              ].map(item => (
                <div key={item.token} className="flex items-center text-[9px] sm:text-[9.5px]">
                  <span className="w-7 text-right pr-1 font-semibold text-slate-800 truncate">{item.token}</span>
                  <div className="flex-1 h-[9px] bg-transparent flex items-center">
                    <div
                      className="h-full border border-slate-700"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="w-6 pl-1 text-[8.5px] font-bold text-slate-800">{item.prob}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[8.5px] sm:text-[9px] text-slate-700 text-center leading-tight">
              One token dominates<br />(low randomness)
            </p>
          </div>

          {/* Temperature 1.2 (more diverse) Column */}
          <div className="flex flex-col border-l border-dashed border-slate-400 pl-2 sm:pl-3">
            <div className="rounded-lg border-[1.6px] border-slate-800 bg-[#FCE7F3] px-2 py-0.5 text-center shadow-2xs">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-900 block leading-tight">
                Temperature 1.2
              </span>
            </div>
            <span className="text-[9px] text-slate-700 font-semibold text-center mt-0.5 block">
              (more diverse)
            </span>

            {/* Horizontal Bar Chart */}
            <div className="mt-2 space-y-1">
              {[
                { token: "the", prob: "0.28", pct: 36, color: "#60A5FA" },
                { token: "a", prob: "0.22", pct: 30, color: "#FDE047" },
                { token: "it", prob: "0.20", pct: 28, color: "#F472B6" },
                { token: "there", prob: "0.16", pct: 24, color: "#4ADE80" },
                { token: "they", prob: "0.14", pct: 20, color: "#C084FC" },
              ].map(item => (
                <div key={item.token} className="flex items-center text-[9px] sm:text-[9.5px]">
                  <span className="w-7 text-right pr-1 font-semibold text-slate-800 truncate">{item.token}</span>
                  <div className="flex-1 h-[9px] bg-transparent flex items-center">
                    <div
                      className="h-full border border-slate-700"
                      style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="w-6 pl-1 text-[8.5px] font-bold text-slate-800">{item.prob}</span>
                </div>
              ))}
            </div>
            <p className="mt-2 text-[8.5px] sm:text-[9px] text-slate-700 text-center leading-tight">
              Flatter distribution<br />(higher randomness)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 2. CONTEXT WINDOW & KV CACHE (Page 4 Section 6 Reference Replica)
  if (
    combined.includes("context window") ||
    combined.includes("kv cache") ||
    combined.includes("prefill") ||
    combined.includes("decode") ||
    combined.includes("cache") ||
    visual?.type === "memory-block"
  ) {
    return (
      <div className="w-full flex flex-col items-center font-hand py-1">
        <span className="text-[9.5px] sm:text-[10px] font-bold text-slate-800 mb-1">
          Context window (e.g. 128K tokens)
        </span>

        {/* Dual Segmented Block: PREFILL + DECODE */}
        <div className="w-full max-w-[280px] h-9 border-[1.8px] border-slate-900 rounded-md overflow-hidden flex shadow-2xs">
          <div className="w-[66%] bg-[#BAE6FD] border-r-[1.8px] border-slate-900 flex flex-col items-center justify-center p-1">
            <span className="text-[10px] font-extrabold text-slate-900 tracking-wide uppercase leading-tight">
              PREFILL:
            </span>
            <span className="text-[9px] text-slate-800 font-semibold leading-tight">
              your prompt
            </span>
          </div>
          <div className="w-[34%] bg-[#FEF08A] flex flex-col items-center justify-center p-1">
            <span className="text-[10px] font-extrabold text-slate-900 tracking-wide uppercase leading-tight">
              DECODE:
            </span>
            <span className="text-[9px] text-slate-800 font-semibold leading-tight">
              output
            </span>
          </div>
        </div>

        {/* Bottom Curly Bracket Annotations */}
        <div className="w-full max-w-[280px] flex justify-between mt-1 text-[8px] sm:text-[8.5px] text-slate-700">
          <div className="w-[66%] text-center pr-1">
            <div className="border-b border-l border-r border-slate-600 h-1.5 w-full mx-auto" />
            <p className="mt-0.5 leading-tight">
              Most of the cost<br />(process all tokens)
            </p>
          </div>
          <div className="w-[34%] text-center pl-1">
            <div className="border-b border-l border-r border-slate-600 h-1.5 w-full mx-auto" />
            <p className="mt-0.5 leading-tight">
              Most of the latency<br />(generates by token)
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 3. SCALING LAWS / LOSS VS COMPUTE
  if (
    combined.includes("scaling") ||
    combined.includes("loss") ||
    combined.includes("compute") ||
    combined.includes("curve") ||
    visual?.type === "curve"
  ) {
    return (
      <div className="w-full flex flex-col items-center font-hand">
        <svg viewBox="0 0 280 150" className="w-full max-w-[260px] overflow-visible">
          {/* Y Axis: Loss */}
          <line x1="38" y1="15" x2="38" y2="125" stroke="#1E293B" strokeWidth="1.8" />
          <polygon points="35,16 38,10 41,16" fill="#1E293B" />
          <text x="34" y="14" textAnchor="end" fontSize="9" fontWeight="bold" fill="#1E293B">Loss</text>
          <text x="34" y="23" textAnchor="end" fontSize="7" fill="#64748B">(log scale)</text>
          <text x="34" y="45" textAnchor="end" fontSize="7.5" fill="#475569">10⁰</text>
          <text x="34" y="80" textAnchor="end" fontSize="7.5" fill="#475569">10⁻¹</text>
          <text x="34" y="115" textAnchor="end" fontSize="7.5" fill="#475569">10⁻²</text>

          {/* X Axis: Compute */}
          <line x1="38" y1="125" x2="265" y2="125" stroke="#1E293B" strokeWidth="1.8" />
          <polygon points="263,122 269,125 263,128" fill="#1E293B" />
          <text x="80" y="137" textAnchor="middle" fontSize="7.5" fill="#475569">10²⁰</text>
          <text x="145" y="137" textAnchor="middle" fontSize="7.5" fill="#475569">10²²</text>
          <text x="210" y="137" textAnchor="middle" fontSize="7.5" fill="#475569">10²⁴</text>
          <text x="160" y="148" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#1E293B">Compute (log scale)</text>

          {/* Predictable Curve */}
          <path d="M 45,35 Q 75,90 120,108 T 245,122" fill="none" stroke="#0284C7" strokeWidth="2.4" strokeLinecap="round" />
          {[[45, 35], [78, 76], [115, 98], [155, 111], [200, 118], [240, 122]].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="3" fill="#0284C7" />
          ))}

          {/* Purple dashed callout box */}
          <rect x="175" y="15" width="90" height="34" rx="6" fill="#FAF5FF" stroke="#C084FC" strokeWidth="1.2" strokeDasharray="3 3" />
          <text x="220" y="28" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#6B21A8">A predictable</text>
          <text x="220" y="39" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#6B21A8">improvement curve</text>
          <path d="M 220,52 Q 215,70 195,95" fill="none" stroke="#475569" strokeWidth="1" />
          <polygon points="193,89 190,98 199,95" fill="#475569" />
        </svg>
      </div>
    );
  }

  // 4. LORA / ADAPTER / FINE-TUNING
  if (
    combined.includes("lora") ||
    combined.includes("adapter") ||
    combined.includes("fine-tuning") ||
    combined.includes("frozen") ||
    visual?.type === "architecture"
  ) {
    return (
      <div className="w-full flex flex-col items-center font-hand py-1">
        <div className="flex items-center justify-center gap-1.5 w-full max-w-[270px]">
          <div className="flex-1 rounded-lg border-[1.5px] border-slate-700 bg-slate-100 p-1.5 text-center shadow-2xs">
            <span className="text-[8px] font-bold text-slate-600 block">Base model (frozen)</span>
            <div className="text-base my-0.5">🤖 ❄️</div>
            <span className="text-[7.5px] text-slate-500 block">Gigabytes</span>
          </div>
          <span className="text-sm font-bold text-slate-600">+</span>
          <div className="flex-1 rounded-lg border-[1.5px] border-rose-500 bg-rose-50 p-1.5 text-center shadow-2xs">
            <span className="text-[8px] font-bold text-rose-800 block">LoRA adapter</span>
            <div className="text-base my-0.5">🔥 ⚡</div>
            <span className="text-[7.5px] text-rose-600 block">Trainable (MBs)</span>
          </div>
          <span className="text-sm font-bold text-slate-600">=</span>
          <div className="flex-1 rounded-lg border-[1.5px] border-emerald-600 bg-emerald-50 p-1.5 text-center shadow-2xs">
            <span className="text-[8px] font-bold text-emerald-900 block">Fine-tuned model</span>
            <div className="text-base my-0.5">✨ 🎯</div>
            <span className="text-[7.5px] text-emerald-700 block">Target Task</span>
          </div>
        </div>
        <p className="mt-1 text-[8.5px] text-slate-600 italic text-center">
          Keep base weights frozen, train only small rank decomposition matrices.
        </p>
      </div>
    );
  }

  // 5. ATTENTION / TRANSFORMER ARCS
  if (
    combined.includes("attention") ||
    combined.includes("transformer") ||
    combined.includes("token") ||
    visual?.type === "token-arc"
  ) {
    return (
      <div className="w-full flex flex-col items-center font-hand">
        <svg viewBox="0 0 270 95" className="w-full max-w-[260px] overflow-visible">
          {/* Arcs */}
          <path d="M 98,58 C 98,15 155,15 155,58" fill="none" stroke="#1E293B" strokeWidth="2" />
          <polygon points="152,50 155,58 158,50" fill="#1E293B" />
          <text x="126" y="24" textAnchor="middle" fontSize="7.5" fontWeight="bold" fill="#1E293B">strong attention</text>

          <path d="M 155,58 C 155,30 205,30 205,58" fill="none" stroke="#64748B" strokeWidth="1.2" strokeDasharray="3 2" />
          <text x="180" y="38" textAnchor="middle" fontSize="7" fill="#475569">weak</text>

          {/* Tokens */}
          {[
            { word: "The", bg: "#BAE6FD", x: 10, w: 32 },
            { word: "river", bg: "#DDD6FE", x: 50, w: 36 },
            { word: "bank", bg: "#FBCFE8", x: 94, w: 36 },
            { word: "flooded", bg: "#BBF7D0", x: 138, w: 46 },
            { word: "again", bg: "#FEF08A", x: 192, w: 38 },
            { word: ".", bg: "#E2E8F0", x: 238, w: 18 },
          ].map((tok, i) => (
            <g key={i} transform={`translate(${tok.x}, 60)`}>
              <rect x="0" y="0" width={tok.w} height="20" rx="4" fill={tok.bg} stroke="#1E293B" strokeWidth="1.2" />
              <text x={tok.w / 2} y="14" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#0F172A">
                {tok.word}
              </text>
            </g>
          ))}
        </svg>
      </div>
    );
  }

  // 6. PIPELINE / PROCESS / GENERAL STEPS
  const steps = visual?.steps?.length
    ? visual.steps
    : visual?.labels?.length
    ? visual.labels
    : [heading || "Concept", "Mechanism", "Impact"];

  return (
    <div className="w-full flex flex-col items-center font-hand py-1">
      <div className="flex items-center justify-between w-full max-w-[270px] gap-1">
        {steps.slice(0, 3).map((st: any, sIdx) => {
          const titleText = typeof st === "string" ? st : st.title || st.name || `Step ${sIdx + 1}`;
          const descText = typeof st === "string" ? "" : st.desc || st.description || "";
          const colors = [
            { bg: "#DDF4FF", border: "#38BDF8", text: "#0369A1" },
            { bg: "#FEF9C3", border: "#FACC15", text: "#854D0E" },
            { bg: "#FCE7F3", border: "#F472B6", text: "#9D174D" },
          ];
          const color = colors[sIdx % colors.length];

          return (
            <React.Fragment key={sIdx}>
              <div
                className="flex-1 rounded-lg border-[1.5px] p-1.5 text-center shadow-2xs min-h-[50px] flex flex-col justify-center"
                style={{ backgroundColor: color.bg, borderColor: color.border }}
              >
                <span className="text-[9.5px] font-extrabold uppercase leading-tight" style={{ color: color.text }}>
                  {titleText}
                </span>
                {descText && (
                  <span className="text-[7.5px] text-slate-700 leading-tight mt-0.5 line-clamp-2 block">
                    {descText}
                  </span>
                )}
              </div>
              {sIdx < Math.min(steps.length, 3) - 1 && (
                <span className="text-slate-500 font-bold text-xs">→</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
      {visual?.caption && (
        <span className="mt-1.5 text-[8.5px] text-slate-600 italic text-center">
          {visual.caption}
        </span>
      )}
    </div>
  );
}

// Single Concept Block replicating reference layout: Section Number + Radiating Heading + Explanation + Key Points + Diagram + Takeaway
function NotebookConceptBlock({
  entry,
  index,
  editing,
  onEditField,
}: {
  entry: SketchnoteEntry;
  index: number;
  editing?: boolean;
  onEditField?: (field: string, value: any) => void;
}) {
  const [showSource, setShowSource] = useState(false);
  const badgeTheme = BADGE_COLORS[index % BADGE_COLORS.length];
  const sectionNumber = entry.sectionNumber || entry.number || index + 1;
  const heading = entry.heading || entry.title || `Concept ${sectionNumber}`;
  const explanation = entry.explanation || entry.summary || "";
  const keyPoints = entry.keyPoints || [];
  const takeaway = entry.takeaway || "";

  return (
    <section className="space-y-3 font-hand" aria-labelledby={`concept-heading-${sectionNumber}`}>
      {/* Concept Header Row: Colored Circle Number + Radiating Dark Blue Heading */}
      <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
        {/* Pastel Circle Section Number */}
        <div
          className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-full border-[2px] shadow-xs hand-drawn-circle"
          style={{
            backgroundColor: badgeTheme.bg,
            borderColor: badgeTheme.border,
            color: badgeTheme.text,
          }}
        >
          <span className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {sectionNumber}
          </span>
        </div>

        {/* Heading with Radiating Blue Accent Dashes */}
        <div className="flex items-center flex-wrap flex-1 min-w-[200px]">
          <RadiatingHeadingAccents direction="left" />
          {editing ? (
            <input
              aria-label="Edit concept heading"
              value={heading}
              onChange={e => onEditField?.("heading", e.target.value)}
              className="text-xl sm:text-2xl font-extrabold ink-heading-blue bg-white border border-blue-300 rounded px-2 py-0.5 flex-1 min-w-[180px]"
            />
          ) : (
            <h2
              id={`concept-heading-${sectionNumber}`}
              className="text-xl sm:text-2xl font-extrabold tracking-tight ink-heading-blue leading-tight"
            >
              {heading}
            </h2>
          )}
          <RadiatingHeadingAccents direction="right" />
        </div>
      </div>

      {/* One-Sentence Definition/Explanation Directly Under Heading */}
      {explanation && (
        <div className="pl-1 sm:pl-2">
          {editing ? (
            <textarea
              aria-label="Edit explanation"
              value={explanation}
              onChange={e => onEditField?.("explanation", e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-[13px] ink-text-black bg-white border border-slate-300 rounded p-1.5"
            />
          ) : (
            <p className="text-xs sm:text-[13.5px] leading-snug ink-text-black">
              <HandDrawnUnderlinedText text={explanation} highlightTerms={entry.highlightedTerms?.map(t => t.term)} />
            </p>
          )}
        </div>
      )}

      {/* Two Column Grid: KEY POINTS on Left, Visual Diagram on Right */}
      <div className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] gap-3 sm:gap-4 items-start pt-1">
        {/* Left Column: KEY POINTS */}
        <div className="space-y-2">
          {/* Yellow Highlight Pill */}
          <div className="yellow-highlight-pill text-[11px] sm:text-xs tracking-wider">
            KEY POINTS:
          </div>

          {/* List of 3 to 5 Key Points with Circled Checkmarks */}
          <ul className="space-y-1.5 sm:space-y-2">
            {keyPoints.map((point, pIdx) => (
              <li key={pIdx} className="flex items-start gap-2 text-xs sm:text-[13px] leading-snug ink-text-black">
                <CircledCheckmark />
                <div className="flex-1">
                  <HandDrawnUnderlinedText text={point} highlightTerms={entry.highlightedTerms?.map(t => t.term)} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column: Hand-Drawn Diagram */}
        <div className="rounded-xl border border-slate-300/80 bg-white/50 p-2 sm:p-2.5 shadow-2xs flex items-center justify-center min-h-[135px]">
          <HandDrawnDiagram
            visual={entry.visual}
            heading={heading}
            explanation={explanation}
            themeIndex={index}
          />
        </div>
      </div>

      {/* Full-Width Takeaway Box (Purple Border + Purple Star) */}
      {takeaway && (
        <div className="takeaway-box-purple p-2 sm:p-2.5 flex items-start gap-2">
          <Star size={16} className="text-[#6366F1] shrink-0 mt-0.5 fill-[#6366F1]" aria-hidden="true" />
          <div className="flex-1 text-xs sm:text-[13px] leading-snug text-[#312E81]">
            <strong className="font-extrabold tracking-wide uppercase text-[11px] mr-1.5 text-[#4338CA]">
              TAKEAWAY:
            </strong>
            {editing ? (
              <input
                aria-label="Edit takeaway"
                value={takeaway}
                onChange={e => onEditField?.("takeaway", e.target.value)}
                className="w-full text-xs bg-white border border-indigo-200 rounded p-1 text-indigo-950 mt-1"
              />
            ) : (
              <HandDrawnUnderlinedText text={takeaway} highlightTerms={entry.highlightedTerms?.map(t => t.term)} />
            )}
          </div>
        </div>
      )}

      {/* Grounded Citation / Source Reference Link */}
      {entry.sourceReference?.quote && (
        <div className="text-right pt-0.5">
          <button
            type="button"
            onClick={() => setShowSource(!showSource)}
            className="text-[11px] font-bold text-[#1b7a52] hover:underline inline-flex items-center gap-1"
          >
            <Quote size={11} /> {showSource ? "Hide source citation" : "Source citation"}
          </button>
          {showSource && (
            <blockquote className="mt-1.5 rounded-lg border-l-2 border-[#1b7a52] bg-white/90 p-2 text-left text-[11px] italic text-slate-700 shadow-xs">
              “{entry.sourceReference.quote}”
              <span className="mt-1 block not-italic text-[10px] text-slate-500">
                {[
                  entry.sourceReference.section,
                  entry.sourceReference.page ? `Page ${entry.sourceReference.page}` : null,
                  entry.sourceReference.paragraph ? `Paragraph ${entry.sourceReference.paragraph}` : null,
                ]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </blockquote>
          )}
        </div>
      )}
    </section>
  );
}

// Horizontal Blue Ink Separator with Center Dot and End Dots
function InkSeparator() {
  return (
    <div className="my-5 sm:my-6 relative py-1" aria-hidden="true">
      <div className="ink-separator-line">
        <div className="ink-separator-dot" />
      </div>
    </div>
  );
}

// Photorealistic Spiral Binding down the left edge
function RealisticSpiralBinding({ loops = 16 }: { loops?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-y-0 left-0 w-12 sm:w-14 spiral-binding-gutter flex flex-col justify-between py-6 z-10 select-none pointer-events-none"
    >
      {Array.from({ length: loops }, (_, i) => (
        <div key={i} className="relative flex items-center justify-start pl-1 sm:pl-1.5 h-6">
          {/* Punch Hole */}
          <div className="spiral-hole" />
          {/* Metallic Wire Coils (Double Ring Wire-O) */}
          <div className="spiral-coil-loop" />
          <div className="spiral-coil-loop-lower" />
        </div>
      ))}
    </div>
  );
}

// Title Page Component (Replicating Section 3 of prompt specification)
function NotebookTitlePage({
  title,
  subtitle,
  overview,
  learningObjectives,
  entries,
  totalPages,
  onStartReading,
  onJumpToSection,
}: {
  title: string;
  subtitle?: string;
  overview?: string;
  learningObjectives?: string[];
  entries: SketchnoteEntry[];
  totalPages: number;
  onStartReading: () => void;
  onJumpToSection: (sectionIdx: number) => void;
}) {
  return (
    <div className="min-h-[760px] flex flex-col justify-between font-hand">
      {/* Top Header: PAGE 1 / N with Blue Pen Underline */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-300/60">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1b7a52] flex items-center gap-1.5">
          <BookOpen size={13} /> LearnLoop Study Notebook
        </span>
        <div className="text-right">
          <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wider underline decoration-[#2563EB] decoration-[2px] underline-offset-4">
            PAGE 1 / {totalPages}
          </span>
        </div>
      </div>

      {/* Main Title Area */}
      <div className="py-6 sm:py-8 text-center space-y-3">
        {/* Hand-drawn Decorative Sparks */}
        <div className="flex items-center justify-center gap-2 text-[#2563EB]">
          <Sparkles size={18} />
          <span className="text-xs font-bold uppercase tracking-widest text-slate-600">
            Visual Learning Guide
          </span>
          <Sparkles size={18} />
        </div>

        {/* Large Central Handwritten Title in Deep Blue Ink */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold ink-heading-blue ink-title-large leading-tight max-w-lg mx-auto">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base font-bold text-slate-700 max-w-md mx-auto">
          {subtitle || "Concepts You Actually Need"}
        </p>

        {/* Highlighted Learning Statement */}
        <div className="inline-block mt-2">
          <span className="yellow-highlight-pill text-xs sm:text-sm px-3 py-1 font-extrabold text-slate-900 shadow-xs">
            {overview
              ? overview.slice(0, 110) + (overview.length > 110 ? "…" : "")
              : "Core mental models & illustrated notebook notes, distilled directly from your source."}
          </span>
        </div>
      </div>

      {/* Two Column Section: Left = Concept Index | Right = Visual Callouts & Doodles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-3 items-start">
        {/* Left: Vertical Concept Index */}
        <div className="rounded-xl border border-slate-300/80 bg-white/60 p-3 sm:p-4 shadow-2xs space-y-2.5">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-extrabold uppercase tracking-wide text-slate-800 flex items-center gap-1.5">
              <Layers size={13} className="text-[#2563EB]" /> Concept Index
            </span>
            <span className="text-[10px] font-bold text-slate-500">
              {entries.length} concepts total
            </span>
          </div>

          <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
            {entries.map((entry, idx) => {
              const secNum = entry.sectionNumber || entry.number || idx + 1;
              const theme = BADGE_COLORS[idx % BADGE_COLORS.length];
              return (
                <button
                  key={entry.id || idx}
                  onClick={() => onJumpToSection(idx)}
                  className="flex items-center gap-2.5 w-full text-left p-1.5 rounded-lg hover:bg-slate-100/80 transition group"
                >
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-extrabold shadow-2xs"
                    style={{ backgroundColor: theme.bg, borderColor: theme.border, color: theme.text }}
                  >
                    {secNum}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-[#2563EB] truncate flex-1">
                    {entry.heading || entry.title || `Concept ${secNum}`}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 group-hover:text-[#2563EB]">
                    p. {Math.floor(idx / 2) + 2}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Sketched Visual Features & Summary Stats */}
        <div className="space-y-3">
          {/* Topic-Related Illustration / Motivational Box */}
          <div className="rounded-xl border border-sky-300 bg-sky-50/70 p-3 sm:p-4 shadow-2xs space-y-2">
            <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs uppercase tracking-wide">
              <Lightbulb size={16} className="text-sky-600" />
              <span>How To Read This Notebook</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-700">
              Each turn of the page covers <strong>one or two key concepts</strong> with hand-drawn diagrams, key-point lists, and actionable takeaways.
            </p>
          </div>

          {/* Quick Summary Pill Stats */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-slate-300 bg-white/70 p-2 shadow-2xs">
              <span className="text-base font-extrabold text-slate-900 block">{entries.length}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Core Concepts</span>
            </div>
            <div className="rounded-lg border border-slate-300 bg-white/70 p-2 shadow-2xs">
              <span className="text-base font-extrabold text-slate-900 block">{totalPages}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">Total Pages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Callout & Turn Page Button */}
      <div className="pt-4 border-t border-slate-300/60 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 italic">
          Hand-crafted visual notes · LearnLoop
        </span>
        <button
          type="button"
          onClick={onStartReading}
          className="inline-flex items-center gap-1.5 rounded-xl border-[1.8px] border-slate-800 bg-[#FEF08A] px-4 py-2 text-xs sm:text-sm font-extrabold text-slate-900 shadow-xs hover:bg-[#FDE047] transition transform active:scale-95"
        >
          <span>Turn to Page 2</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// Main SketchnoteNotebook Component
export default function SketchnoteNotebook({
  title,
  subtitle,
  overview,
  learningObjectives,
  entries = [],
  activePage = 0,
  onPageChange,
  zoom = 100,
  editing = false,
  onEditEntry,
}: SketchnoteNotebookProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [viewMode, setViewMode] = useState<"single" | "grid">("single");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync zoom prop
  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  // Group concept entries into pairs (2 concepts per page)
  // Page 0 = Title Page
  // Page 1 = Concepts 1 & 2 (Page 2 in human number)
  // Page 2 = Concepts 3 & 4 (Page 3 in human number)
  // Page 3 = Concepts 5 & 6 (Page 4 in human number) etc.
  const conceptPages = useMemo(() => {
    const pages: SketchnoteEntry[][] = [];
    for (let i = 0; i < entries.length; i += 2) {
      pages.push(entries.slice(i, i + 2));
    }
    return pages;
  }, [entries]);

  const totalPages = 1 + conceptPages.length; // 1 title page + N concept pages
  const validActivePage = Math.min(activePage, Math.max(0, totalPages - 1));

  // Handle page navigation
  const goToPage = (pageIdx: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, pageIdx));
    onPageChange?.(clamped);
    setViewMode("single");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editing) return;
      if (e.key === "ArrowLeft") {
        goToPage(validActivePage - 1);
      } else if (e.key === "ArrowRight") {
        goToPage(validActivePage + 1);
      } else if (e.key === "Home") {
        goToPage(0);
      } else if (e.key === "End") {
        goToPage(totalPages - 1);
      } else if (e.key.toLowerCase() === "g") {
        setViewMode(curr => (curr === "single" ? "grid" : "single"));
      } else if (e.key.toLowerCase() === "f") {
        toggleFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [validActivePage, totalPages, editing]);

  // Touch Swipe for mobile devices
  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swiped left -> next page
        goToPage(validActivePage + 1);
      } else {
        // Swiped right -> prev page
        goToPage(validActivePage - 1);
      }
    }
    touchStartX.current = null;
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Render a single notebook page sheet
  const renderPageSheet = (pageIdx: number, isThumbnail = false) => {
    const isCover = pageIdx === 0;
    const concepts = isCover ? [] : conceptPages[pageIdx - 1] || [];

    return (
      <article
        key={pageIdx}
        className={`relative overflow-hidden rounded-2xl sm:rounded-3xl notebook-page-canvas transition-all ${
          isThumbnail
            ? "cursor-pointer hover:ring-4 hover:ring-[#2563EB] shadow-md hover:shadow-xl"
            : "shadow-2xl"
        }`}
        style={{
          aspectRatio: "9 / 15",
          width: "100%",
          maxWidth: isThumbnail ? "100%" : "640px",
        }}
        onClick={isThumbnail ? () => goToPage(pageIdx) : undefined}
      >
        {/* Photorealistic Spiral Binding down the left edge */}
        <RealisticSpiralBinding loops={16} />

        {/* Paper Content Area with Margin indent past spiral coils */}
        <div className="relative h-full pl-14 sm:pl-16 pr-4 sm:pr-7 py-5 sm:py-7 flex flex-col justify-between overflow-y-auto">
          {isCover ? (
            <NotebookTitlePage
              title={title}
              subtitle={subtitle}
              overview={overview}
              learningObjectives={learningObjectives}
              entries={entries}
              totalPages={totalPages}
              onStartReading={() => goToPage(1)}
              onJumpToSection={secIdx => goToPage(Math.floor(secIdx / 2) + 1)}
            />
          ) : (
            <div className="space-y-4">
              {/* Header: PAGE X / Y in Top Right with Blue Pen Underline */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-300/60">
                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[200px]">
                  {title}
                </span>
                <div className="text-right">
                  <span className="text-xs sm:text-sm font-extrabold text-slate-800 tracking-wider underline decoration-[#2563EB] decoration-[2px] underline-offset-4">
                    PAGE {pageIdx + 1} / {totalPages}
                  </span>
                </div>
              </div>

              {/* Concepts Stacked on this Page (1 or 2 concepts per page) */}
              <div className="space-y-4">
                {concepts.map((concept, cIdx) => {
                  const globalIdx = (pageIdx - 1) * 2 + cIdx;
                  return (
                    <React.Fragment key={concept.id || globalIdx}>
                      {cIdx > 0 && <InkSeparator />}
                      <NotebookConceptBlock
                        entry={concept}
                        index={globalIdx}
                        editing={editing}
                        onEditField={(field, val) => onEditEntry?.(globalIdx, field, val)}
                      />
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </article>
    );
  };

  return (
    <div
      ref={containerRef}
      className={`notebook-desk-bg p-3 sm:p-6 rounded-2xl relative select-none font-hand ${
        isFullscreen ? "fixed inset-0 z-50 overflow-y-auto rounded-none" : ""
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Desktop Controls Toolbar */}
      <div className="mx-auto max-w-4xl mb-4 flex flex-wrap items-center justify-between gap-2.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 text-white shadow-lg">
        {/* Left: View Mode Toggle */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setViewMode("single")}
            aria-pressed={viewMode === "single"}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "single"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <BookOpen size={14} /> Page View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-pressed={viewMode === "grid"}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === "grid"
                ? "bg-[#2563EB] text-white shadow-xs"
                : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            <Grid size={14} /> Grid View
          </button>
        </div>

        {/* Center: Page Navigation Indicator */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={validActivePage === 0}
            onClick={() => goToPage(validActivePage - 1)}
            aria-label="Previous page"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-extrabold text-slate-200 min-w-[90px] text-center tracking-wider">
            Page {validActivePage + 1} of {totalPages}
          </span>

          <button
            type="button"
            disabled={validActivePage >= totalPages - 1}
            onClick={() => goToPage(validActivePage + 1)}
            aria-label="Next page"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Right: Zoom Controls & Fullscreen */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentZoom(z => Math.max(70, z - 10))}
            aria-label="Zoom out"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            <ZoomOut size={14} />
          </button>
          <button
            type="button"
            onClick={() => setCurrentZoom(100)}
            className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-300 hover:bg-slate-800 transition"
          >
            {currentZoom}%
          </button>
          <button
            type="button"
            onClick={() => setCurrentZoom(z => Math.min(130, z + 10))}
            aria-label="Zoom in"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Toggle full screen"
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition ml-1"
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === "single" ? (
        <div className="flex flex-col items-center justify-center py-2 sm:py-4">
          <div
            className="w-full flex justify-center transition-all duration-200"
            style={{ transform: `scale(${currentZoom / 100})`, transformOrigin: "top center" }}
          >
            {renderPageSheet(validActivePage)}
          </div>
        </div>
      ) : (
        /* Page Grid Gallery View */
        <div className="max-w-6xl mx-auto py-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: totalPages }, (_, idx) => (
              <div key={idx} className="relative group">
                {renderPageSheet(idx, true)}
                <div className="mt-2 text-center text-xs font-bold text-slate-300">
                  {idx === 0 ? "Title Page" : `Page ${idx + 1}`}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Page Thumbnails Bar for Quick Navigation */}
      {viewMode === "single" && (
        <div className="mt-6 mx-auto max-w-xl flex items-center justify-center gap-1.5 overflow-x-auto py-2">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToPage(idx)}
              className={`h-2.5 rounded-full transition-all ${
                validActivePage === idx
                  ? "w-8 bg-[#2563EB]"
                  : "w-2.5 bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Jump to page ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
