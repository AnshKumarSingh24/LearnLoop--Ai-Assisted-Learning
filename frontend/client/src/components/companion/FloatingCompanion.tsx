import { CheckCircle2, Loader2, Send, Sparkles, X } from "lucide-react";
import { useCompanion } from "@/contexts/CompanionContext";
import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { generate10LevelCourse } from "@/lib/courseGenerator";
import { useEffect, useRef, useState } from "react";
import "./FloatingCompanion.css";

type Message = { role: "user" | "companion"; content: string };
type Run = { title: string; complete: boolean };
const CAPTURE_API_URL = import.meta.env.VITE_CAPTURE_API_URL || "http://localhost:8080";
const SAVED_ARTIFACTS_KEY = "learnloop-saved-artifacts";
const ACTION = /\b(create|make|build|generate|prepare|organize|turn .* into|simplif|rewrite|reorganize)\b/i;
const topicOf = (text: string, fallback: string) => text.replace(/\b(create|make|build|generate|prepare|organize|turn|into|a|an|the|me|my|this|these|about|from|notes?|flashcards?|quiz|study guide|revision plan|course|canvas)\b/gi, " ").replace(/\s+/g, " ").trim() || fallback;

export function FloatingCompanion() {
  const { profile, context, state, isOpen, open, close, setState } = useCompanion();
  const { state: store, dispatch } = useDarwinity();
  const [messages, setMessages] = useState<Message[]>([{ role: "companion", content: "Hey! I’m your Darwinity learning companion. Ask a question, or ask me to create notes, flashcards, a quiz, a course, or a revision plan—I’ll save the result in your learning space." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [run, setRun] = useState<Run | null>(null);
  const end = useRef<HTMLDivElement>(null);
  const displayContext = context.selection || context.course || context.workspace || "your learning space";
  useEffect(() => { end.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, run]);

  const savePage = (title: string, body: string, type: "paragraph" | "canvas" = "paragraph") => {
    const pageId = `ai-page-${Date.now()}`, now = new Date().toISOString();
    const spaceId = context.spaceId || store.activeSpaceId || store.spaces[0]?.id || "inbox";
    dispatch({ type: "CREATE_PAGE", page: { id: pageId, spaceId, title, icon: "✨", favorite: false, archived: false, createdAt: now, updatedAt: now } });
    dispatch({ type: "CREATE_BLOCK", block: { id: `ai-block-${Date.now()}`, pageId, parentId: null, type, content: body, order: 0 } });
    dispatch({ type: "SET_ACTIVE_PAGE", id: pageId });
    return title;
  };

  const saveArtifact = (title: string, type: "summary" | "flashcards" | "study_guide", content: string) => {
    try {
      const current = JSON.parse(localStorage.getItem(SAVED_ARTIFACTS_KEY) || "[]");
      const saved = Array.isArray(current) ? current : [];
      localStorage.setItem(SAVED_ARTIFACTS_KEY, JSON.stringify([{ id: `ai-artifact-${Date.now()}`, artifact_type: type, title, source_title: displayContext, content, savedAt: new Date().toISOString() }, ...saved]));
    } catch { /* The editable page remains saved even if artifact storage is unavailable. */ }
  };

  const act = (query: string): string | null => {
    if (!ACTION.test(query)) return null;
    const lower = query.toLowerCase(), topic = topicOf(query, displayContext), named = topic[0].toUpperCase() + topic.slice(1);
    setRun({ title: "Planning and saving your learning material", complete: false });
    if (/\b(course|learning path)\b/.test(lower)) {
      const course = generate10LevelCourse(named, "intermediate", "Master this topic", []);
      course.id = `ai-course-${Date.now()}`; course.spaceId = context.spaceId || store.activeSpaceId || undefined;
      dispatch({ type: "CREATE_COURSE", course }); dispatch({ type: "SET_ACTIVE_COURSE", id: course.id });
      setRun({ title: "Course created and saved", complete: true });
      return `Created ${course.title} with a structured learning path. It is now in your courses.`;
    }
    if (/\b(canvas|mind map|flowchart)\b/.test(lower)) {
      const title = savePage(`${named} canvas`, `Central idea: ${named}\n\nAdd connected concepts, examples, and open questions here.`, "canvas");
      setRun({ title: "Canvas created and saved", complete: true }); return `Created ${title} as an editable canvas page.`;
    }
    const quiz = /\b(flashcards?|quiz|practice questions?)\b/.test(lower);
    const revision = /\b(revision|exam|study guide|prepare)\b/.test(lower);
    const content = quiz ? `# ${named} practice\n\n1. What is the central idea?\n2. How would you apply it?\n3. What misconception should you avoid?\n\nAdd answers from your sources and ask Darwin to check them.` : revision ? `# ${named} revision plan\n\n1. Review the key ideas in ${displayContext}.\n2. Identify weak points.\n3. Test recall with questions.\n4. Correct and summarize mistakes.` : `# ${named}\n\nContext: ${displayContext}\n\n## Key ideas\n- Explain the core concept in your own words.\n- Add an example from your source.\n- Record a question to revisit.`;
    const title = savePage(`${named} ${quiz ? "practice" : revision ? "revision plan" : "notes"}`, content);
    saveArtifact(title, quiz ? "flashcards" : revision ? "study_guide" : "summary", content);
    setRun({ title: `${quiz ? "Practice set" : revision ? "Revision plan" : "Notes"} created and saved`, complete: true });
    return `Created ${title} as a persistent, editable page in your learning space.`;
  };

  const ask = async (query: string) => {
    if (!query.trim() || loading) return;
    setMessages(m => [...m, { role: "user", content: query }]); setInput(""); setLoading(true); setState("thinking" as never);
    try {
      const result = act(query);
      if (result) { setMessages(m => [...m, { role: "companion", content: result }]); setState("celebrating"); return; }
      let answer = "";
      try { const r = await fetch(`${CAPTURE_API_URL}/ask`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ query: `[Context: ${displayContext}] ${query}`, space_id: context.spaceId || null, top_k: 3 }) }); if (r.ok) answer = (await r.json()).answer || ""; } catch { /* use application fallback */ }
      if (!answer) { const r = await fetch("/api/trpc/companion.chat?batch=1", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ "0": { json: { workspaceId: 1, message: query, activeContext: `Viewing: ${displayContext}` } } }) }); if (r.ok) answer = (await r.json())?.[0]?.result?.data?.json?.reply || ""; }
      setMessages(m => [...m, { role: "companion", content: answer || `I’m looking at ${displayContext}. Ask me to explain it, or tell me what you’d like me to create.` }]); setState("explaining");
    } catch { setMessages(m => [...m, { role: "companion", content: "I couldn’t complete that request. Nothing was changed—please try again." }]); setState("needs-attention"); }
    finally { setLoading(false); window.setTimeout(() => setState("idle"), 3500); }
  };

  return <>
    <button className={`companion-orbit companion-${state}`} style={{ "--companion-primary": profile.primaryColor, "--companion-accent": profile.accentColor } as React.CSSProperties} onClick={open} aria-label={`Open ${profile.name}, your learning companion`}><span className="companion-aura" /><span className="companion-body"><span className="companion-eye companion-eye-left" /><span className="companion-eye companion-eye-right" /><span className="companion-mouth" />{profile.accessory === "leaf" && <span className="companion-leaf" />}</span><span className="companion-spark"><Sparkles size={12} /></span></button>
    {isOpen && <aside className="companion-panel flex flex-col h-[500px]" aria-label={`${profile.name} assistant`}>
      <header className="companion-panel-header shrink-0"><div><span className="companion-kicker">YOUR AGENTIC COMPANION</span><h2>{profile.name}</h2></div><button onClick={close} aria-label="Close companion panel"><X size={18} /></button></header>
      <div className="companion-context shrink-0"><span className="context-dot" /><span className="truncate">Seeing: {displayContext}</span></div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">{messages.length === 1 && <div className="companion-actions mb-4"><button onClick={() => ask("Explain this")}>Explain this</button><button onClick={() => ask("Create notes from this")}>Create notes</button><button onClick={() => ask("Make flashcards")}>Make flashcards</button><button onClick={() => ask("Create a revision plan")}>Revision plan</button></div>}{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.role === "user" ? "bg-[#123d2d] text-white" : "bg-white border border-[#e1e8e2] text-gray-800 shadow-sm"}`}>{m.content}</div></div>)}{run && <div className="rounded-2xl border border-[#dbe8df] bg-[#f4faf5] px-4 py-3 text-xs text-[#234536] flex gap-2 items-center">{run.complete ? <CheckCircle2 size={15} className="text-emerald-600" /> : <Loader2 size={15} className="animate-spin" />}{run.title}</div>}{loading && <div className="flex justify-start"><div className="bg-white border border-[#e1e8e2] rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2 text-gray-500"><Loader2 size={16} className="animate-spin text-[#123d2d]" /><span className="text-xs font-bold uppercase tracking-widest">{profile.name} is working…</span></div></div>}<div ref={end} /></div>
      <div className="companion-input-row shrink-0 bg-white border-t border-[#e1e8e2] p-4 flex items-center gap-2"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); ask(input); } }} placeholder="Ask, or tell Darwin to create something…" className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#123d2d] transition-colors" /><button onClick={() => ask(input)} disabled={loading || !input.trim()} className="w-10 h-10 rounded-xl bg-[#123d2d] text-white flex items-center justify-center disabled:opacity-50"><Send size={16} /></button></div>
    </aside>}
  </>;
}
