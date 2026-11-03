import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { useTheme } from "@/contexts/ThemeContext";
import {
  ArrowLeft,
  ArrowDown,
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  Clock3,
  Flame,
  Headphones,
  Layers3,
  Lock,
  Mail,
  Menu,
  Moon,
  Play,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  Trophy,
  UserRound,
  X,
  Zap,
  Sun,
} from "lucide-react";
import { profileInitials, prepareProfileAvatar } from "@/lib/profileAvatar";

type Topic = {
  id: string;
  name: string;
  subject: string;
  emoji: string;
  color: string;
  tint: string;
  description: string;
};

type Level = "Beginner" | "Intermediate" | "Advanced";

type SetupStep = "topic" | "level" | "goal" | "format" | "explanation" | "role" | "grounding" | "review";

const topics: Topic[] = [
  { id: "english", name: "English", subject: "Language", emoji: "Aa", color: "#2e8b57", tint: "#e4f2e8", description: "Speak, write, and communicate with confidence" },
  { id: "math", name: "Mathematics", subject: "STEM", emoji: "∑", color: "#2e8b57", tint: "#edf7f0", description: "Build intuition before formulas and proofs" },
  { id: "computer-science", name: "Computer science", subject: "Technology", emoji: "</>", color: "#1d6841", tint: "#e4f2e8", description: "Understand code, systems, and the digital world" },
  { id: "business", name: "Business", subject: "Career", emoji: "↗", color: "#2e8b57", tint: "#edf7f0", description: "Build practical skills for work and ideas" },
  { id: "biology", name: "Biology", subject: "Science", emoji: "🧬", color: "#2e8b57", tint: "#e4f2e8", description: "Cells, ecosystems & the science of life" },
  { id: "physics", name: "Physics", subject: "Science", emoji: "◉", color: "#1d6841", tint: "#e4f2e8", description: "Explore matter, energy, motion, and space" },
  { id: "chemistry", name: "Chemistry", subject: "Science", emoji: "⚗", color: "#2e8b57", tint: "#edf7f0", description: "Make sense of reactions and materials" },
  { id: "spanish", name: "Spanish", subject: "Language", emoji: "✦", color: "#2e8b57", tint: "#edf7f0", description: "Build confidence through everyday conversation" },
  { id: "french", name: "French", subject: "Language", emoji: "é", color: "#1d6841", tint: "#e4f2e8", description: "Learn useful phrases for real conversations" },
  { id: "history", name: "World history", subject: "Humanities", emoji: "🏛", color: "#2e8b57", tint: "#edf7f0", description: "See the people, patterns & turning points" },
  { id: "psychology", name: "Psychology", subject: "Humanities", emoji: "◌", color: "#1d6841", tint: "#e4f2e8", description: "Understand minds, behavior, and relationships" },
  { id: "economics", name: "Economics", subject: "Social science", emoji: "₿", color: "#2e8b57", tint: "#edf7f0", description: "Understand markets, choices, and incentives" },
  { id: "finance", name: "Personal finance", subject: "Life skills", emoji: "₹", color: "#1d6841", tint: "#e4f2e8", description: "Make money concepts feel clear and useful" },
  { id: "design", name: "Design", subject: "Creative", emoji: "✳", color: "#2e8b57", tint: "#edf7f0", description: "Think visually and create better experiences" },
  { id: "music", name: "Music", subject: "Creative", emoji: "♫", color: "#1d6841", tint: "#e4f2e8", description: "Learn theory, instruments, and composition" },
  { id: "health", name: "Health & wellness", subject: "Life skills", emoji: "＋", color: "#2e8b57", tint: "#edf7f0", description: "Build sustainable habits for everyday life" },
];

const levelDetails: Record<Level, { eyebrow: string; title: string; copy: string; lessons: number; xp: number; badge: string }> = {
  Beginner: { eyebrow: "Start from solid ground", title: "No pressure. Just progress.", copy: "We’ll build the vocabulary first, then layer in the interesting stuff.", lessons: 18, xp: 420, badge: "Foundations" },
  Intermediate: { eyebrow: "You already have the basics", title: "Let’s connect the dots.", copy: "We’ll skip what you know and spend more time applying ideas to real problems.", lessons: 14, xp: 360, badge: "Momentum" },
  Advanced: { eyebrow: "Ready for the deep end", title: "Challenge accepted.", copy: "Expect dense concepts, edge cases, and fewer guardrails. You’re here to stretch.", lessons: 11, xp: 330, badge: "Deep dive" },
};

const levelSequence: { label: string; sub: string; icon: string }[] = [
  { label: "Warm up", sub: "Get oriented", icon: "01" },
  { label: "Core ideas", sub: "Build your base", icon: "02" },
  { label: "Make connections", sub: "See the bigger picture", icon: "03" },
  { label: "Practice lab", sub: "Use what you know", icon: "04" },
  { label: "Final quest", sub: "Show your mastery", icon: "05" },
];

function ProgressBar({ value, color = "#58cc02" }: { value: number; color?: string }) {
  return <div className="progress-track"><div className="progress-fill" style={{ width: `${value}%`, background: color }} /></div>;
}

function Logo() {
  return (
    <div className="brand-mark">
      <div className="brand-orbit"><span /></div>
      <span className="brand-name">learn<span>loop</span></span>
    </div>
  );
}
function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return <button className="theme-toggle" onClick={toggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`} title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}><span className="theme-toggle-icon">{theme === "light" ? <Moon size={15} /> : <Sun size={15} />}</span><span>{theme === "light" ? "Dark mode" : "Light mode"}</span></button>;
}
function AppHeader({ courseBuilt, onReset }: { courseBuilt: boolean; onReset: () => void }) {
  return (
    <header className="topbar">
      <div className="topbar-left"><button className="icon-button mobile-menu" aria-label="Open menu"><Menu size={20} /></button><Logo /></div>
      <div className="topbar-right">
        <ThemeToggle />
        {courseBuilt ? <>
          <div className="top-stat"><Flame size={17} fill="#f4b942" color="#f4b942" /><strong>7</strong><span>day streak</span></div>
          <div className="top-stat"><Zap size={17} fill="#7b69d9" color="#7b69d9" /><strong>1,240</strong><span>XP</span></div>
          <button className="avatar" aria-label="Profile">AK</button>
        </> : null}
      </div>
    </header>
  );
}

function StepDots({ current }: { current: SetupStep }) {
  const steps: SetupStep[] = ["topic", "level", "goal", "format", "explanation", "role", "grounding", "review"];
  return <div className="step-dots" aria-label="Course setup progress">{steps.map((step, index) => <span key={step} className={steps.indexOf(current) >= index ? "active" : ""} />)}</div>;
}

function TopicStep({ selectedTopic, setSelectedTopic, customTopic, setCustomTopic, onNext }: { selectedTopic: Topic | null; setSelectedTopic: (topic: Topic | null) => void; customTopic: string; setCustomTopic: (value: string) => void; onNext: () => void }) {
  const canContinue = selectedTopic || customTopic.trim().length > 2;
  const [showMore, setShowMore] = useState(false);
  return <>
    <div className="setup-eyebrow"><span className="eyebrow-dot" /> 01 / 07 · Choose your path</div>
    <h1>What do you want<br /><em>to get good at?</em></h1>
    <p className="lead">Tell us what’s on your mind. We’ll turn it into a course that feels made for you.</p>
    <div className={`topic-grid ${showMore ? "expanded" : ""}`}>{topics.slice(0, showMore ? topics.length : 4).map((topic) => <button key={topic.id} className={`topic-option ${selectedTopic?.id === topic.id ? "selected" : ""}`} style={{ "--topic": topic.color, "--tint": topic.tint } as React.CSSProperties} onClick={() => { setSelectedTopic(topic); setCustomTopic(""); }}>
      <span className="topic-icon">{topic.emoji}</span><span className="topic-copy"><strong>{topic.name}</strong><small>{topic.description}</small></span>{selectedTopic?.id === topic.id && <span className="selected-check"><Check size={14} /></span>}
    </button>)}</div>
    {!showMore && <button className="view-more-button" onClick={() => setShowMore(true)}>View more subjects <ArrowDown size={15} /></button>}
    <div className="custom-row"><span className="custom-label">Others? Tell us.</span><div className="input-wrap"><Plus size={17} /><input value={customTopic} onChange={(event) => { setCustomTopic(event.target.value); setSelectedTopic(null); }} placeholder="Type a subject, skill, or goal…" /></div></div>
    <div className="setup-footer"><span>We’ll personalize the course around your choice.</span><button className="primary-button" disabled={!canContinue} onClick={onNext}>Next <ArrowRight size={17} /></button></div>
  </>;
}

function LevelStep({ level, setLevel, selectedTopic, onBack, onNext }: { level: Level; setLevel: (level: Level) => void; selectedTopic: Topic | null; onBack: () => void; onNext: () => void }) {
  const current = levelDetails[level];
  return <>
    <div className="setup-eyebrow"><span className="eyebrow-dot" /> 02 / 07 · Find your starting line</div>
    <h1>Where are you<br /><em>right now?</em></h1>
    <p className="lead">No wrong answer. Your starting level changes the pace, examples, and the kind of challenges you’ll see.</p>
    <div className="level-layout"><div className="level-list">{(Object.keys(levelDetails) as Level[]).map((item) => <button key={item} className={`level-option ${level === item ? "selected" : ""}`} onClick={() => setLevel(item)}><span className="level-radio">{level === item && <span />}</span><span><strong>{item}</strong><small>{item === "Beginner" ? "I’m starting from scratch" : item === "Intermediate" ? "I know the basics" : "I want the hard stuff"}</small></span><ArrowRight size={16} /></button>)}</div><div className="level-preview" style={{ "--level-accent": level === "Beginner" ? "#58cc02" : level === "Intermediate" ? "#f4b942" : "#e86a53" } as React.CSSProperties}><div className="preview-orb"><Sparkles size={28} /></div><span className="preview-eyebrow">{current.eyebrow}</span><h3>{current.title}</h3><p>{current.copy}</p><div className="preview-stats"><span><strong>{current.lessons}</strong> lessons</span><span><strong>{current.xp}</strong> XP to earn</span></div><div className="preview-course"><span className="mini-course-dot" /> {selectedTopic?.name || "Your subject"} <b>·</b> {current.badge}</div></div></div>
    <div className="setup-footer"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back</button><button className="primary-button" onClick={onNext}>That’s me <ArrowRight size={17} /></button></div>
  </>;
}

function GoalStep({ goal, setGoal, timeBudget, setTimeBudget, onBack, onNext }: { goal: string; setGoal: (goal: string) => void; timeBudget: string; setTimeBudget: (time: string) => void; onBack: () => void; onNext: () => void }) {
  const goals = [{ id: "exam", icon: Target, title: "Ace an exam", copy: "Give me focused practice & checkpoints" }, { id: "career", icon: Award, title: "Grow for work", copy: "Make it practical and applied" }, { id: "curious", icon: Brain, title: "Learn for life", copy: "Keep it interesting and low-pressure" }];
  return <>
    <div className="setup-eyebrow"><span className="eyebrow-dot" /> 03 / 07 · Set your rhythm</div>
    <h1>What’s the reason<br /><em>you’re here?</em></h1>
    <p className="lead">Your goal helps us choose the right balance between explanation, practice, and playful challenge.</p>
    <div className="goal-list">{goals.map(({ id, icon: Icon, title, copy }) => <button key={id} className={`goal-option ${goal === id ? "selected" : ""}`} onClick={() => setGoal(id)}><span className="goal-icon"><Icon size={20} /></span><span><strong>{title}</strong><small>{copy}</small></span>{goal === id && <Check size={18} />}</button>)}</div>
    <div className="time-block"><div><span className="section-kicker">DAILY TIME BUDGET</span><h3>How much can you give it?</h3></div><div className="time-options">{["5 min", "10 min", "15 min", "20+ min"].map((time) => <button key={time} className={timeBudget === time ? "selected" : ""} onClick={() => setTimeBudget(time)}>{time}</button>)}</div></div>
    <div className="setup-footer"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back</button><button className="primary-button" onClick={onNext}>Keep going <ArrowRight size={17} /></button></div>
  </>;
}

function ChoiceStep({ stepNumber, title, accent, lead, value, setValue, options, onBack, onNext, final = false }: { stepNumber: string; title: React.ReactNode; accent: string; lead: string; value: string; setValue: (value: string) => void; options: { id: string; icon: React.ElementType; title: string; copy: string }[]; onBack: () => void; onNext: () => void; final?: boolean }) {
  return <>
    <div className="setup-eyebrow"><span className="eyebrow-dot" /> {stepNumber} / 07 · {accent}</div>
    <h1>{title}</h1>
    <p className="lead">{lead}</p>
    <div className="choice-grid">{options.map(({ id, icon: Icon, title: optionTitle, copy }) => <button key={id} className={`choice-option ${value === id ? "selected" : ""}`} onClick={() => setValue(id)}><span className="choice-icon"><Icon size={21} /></span><span><strong>{optionTitle}</strong><small>{copy}</small></span><span className="choice-radio">{value === id && <Check size={13} />}</span></button>)}</div>
    {final && <div className="privacy-note"><Sparkles size={16} /><span>Your course will follow this source policy. You can tune it later for individual lessons.</span></div>}
    <div className="setup-footer"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back</button><button className={`primary-button ${final ? "build-button" : ""}`} onClick={onNext}>{final ? "Build my course" : "Continue"} {final ? <Sparkles size={17} /> : <ArrowRight size={17} />}</button></div>
  </>;
}

function StyleStep({ style, setStyle, onBack, onBuild }: { style: string; setStyle: (style: string) => void; onBack: () => void; onBuild: () => void }) {
  const styles = [{ id: "balanced", icon: Layers3, title: "A bit of everything", copy: "A balanced mix of lessons, practice, and review." }, { id: "visual", icon: Sparkles, title: "Show me the big picture", copy: "More maps, examples, and visual explanations." }, { id: "practice", icon: Target, title: "Let’s get hands-on", copy: "Less talking. More questions, challenges, and feedback." }];
  return <>
    <div className="setup-eyebrow"><span className="eyebrow-dot" /> 04 / 04 · Make it yours</div>
    <h1>How do you like<br /><em>to learn best?</em></h1>
    <p className="lead">You can change this later. We’ll use it to tune the feel of every lesson.</p>
    <div className="style-grid">{styles.map(({ id, icon: Icon, title, copy }) => <button key={id} className={`style-option ${style === id ? "selected" : ""}`} onClick={() => setStyle(id)}><span className="style-icon"><Icon size={22} /></span><strong>{title}</strong><small>{copy}</small><span className="style-radio">{style === id && <Check size={13} />}</span></button>)}</div>
    <div className="privacy-note"><Sparkles size={16} /><span>Your answers shape your course — they’re not a test and there’s nothing to get “wrong”.</span></div>
    <div className="setup-footer"><button className="back-button" onClick={onBack}><ArrowLeft size={17} /> Back</button><button className="primary-button build-button" onClick={onBuild}>Build my course <Sparkles size={17} /></button></div>
  </>;
}

function AuthShell({ children }: { children: React.ReactNode }) {
  return <div className="auth-screen"><div className="auth-art"><div className="auth-quote"><span className="quote-mark">“</span><h2>Learning works better when it feels <em>like yours.</em></h2><p>Start with your profile. We’ll use it to shape every explanation, challenge, and revision session.</p></div><div className="auth-learning-card"><div className="auth-card-top"><span className="auth-card-icon"><BookOpen size={18} /></span><span>YOUR LEARNING SPACE</span><b>01</b></div><div className="auth-card-rule" /><h3>Make progress<br /><em>feel personal.</em></h3><div className="auth-card-bottom"><span><i /> 7 day streak</span><span>keep going →</span></div></div><span className="auth-footer">learnloop / personalized learning</span></div><main className="auth-main"><div className="auth-topline"><Logo /><ThemeToggle /></div>{children}</main></div>;
}

function ConnectStep({ onGoogle, onWeb, onBack }: { onGoogle: () => void; onWeb: () => void; onBack: () => void }) {
  return <AuthShell><div className="auth-card connect-card"><span className="setup-eyebrow"><span className="eyebrow-dot" /> WELCOME TO LEARNLOOP</span><h1>Your learning space<br /><em>starts here.</em></h1><p className="lead">Create your profile once. We’ll use it to shape every explanation, challenge, and revision session around you.</p><button className="web-signup-button auth-web-primary" onClick={onWeb}>Continue on web <ArrowRight size={16} /></button><button className="google-button" onClick={onGoogle}><span className="google-mark">G</span> Continue with Google <ArrowRight size={17} /></button><button className="auth-back-link" onClick={onBack}><ArrowLeft size={14} /> Back to LearnLoop</button><div className="auth-divider"><span>PRIVATE BY DEFAULT</span></div><p className="auth-microcopy"><Lock size={13} /> No credit card. No noisy notifications.</p></div></AuthShell>;
}

function ProfileStep({ firstName, setFirstName, lastName, setLastName, displayName, setDisplayName, email, setEmail, userType, setUserType, interests, setInterests, workspaceName, setWorkspaceName, language, setLanguage, dob, setDob, details, setDetails, avatarUrl, avatarError, onAvatarFile, onRemoveAvatar, terms, setTerms, saveError, saving, onBack, onContinue }: {
  firstName: string; setFirstName: (value: string) => void;
  lastName: string; setLastName: (value: string) => void;
  displayName: string; setDisplayName: (value: string) => void;
  email: string; setEmail: (value: string) => void;
  userType: "learner" | "creator" | "both"; setUserType: (value: "learner" | "creator" | "both") => void;
  interests: string; setInterests: (value: string) => void;
  workspaceName: string; setWorkspaceName: (value: string) => void;
  language: string; setLanguage: (value: string) => void;
  dob: string; setDob: (value: string) => void;
  details: string; setDetails: (value: string) => void;
  avatarUrl: string; avatarError: string; onAvatarFile: (file: File) => void; onRemoveAvatar: () => void;
  terms: boolean; setTerms: (value: boolean) => void;
  saveError: string; saving: boolean; onBack: () => void; onContinue: () => void;
}) {
  const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const validEmail = !email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const complete = Boolean((fullName || displayName.trim()) && validEmail && terms);
  const inputRef = useRef<HTMLInputElement>(null);
  return <AuthShell><div className="profile-card"><div className="profile-card-heading"><div><span className="setup-eyebrow"><span className="eyebrow-dot" /> STEP 02 / YOUR LEARNER PROFILE</span><h1>Tell us a little<br /><em>about yourself.</em></h1></div><span className="profile-step-badge">1 of 1</span></div><p className="lead">Add the details you want. Anything optional can be skipped and changed later.</p>
    <div className="mb-5 flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-[#1b7a52] text-lg font-extrabold text-white">{avatarUrl ? <img src={avatarUrl} alt="Profile preview" className="h-full w-full object-cover" /> : profileInitials(displayName || fullName || email)}</div><div className="flex flex-wrap gap-2"><input ref={inputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={event => { const file = event.target.files?.[0]; event.target.value = ""; if (file) onAvatarFile(file); }} /><button type="button" className="back-button !px-3 !py-2 text-sm" onClick={() => inputRef.current?.click()}><Camera size={15} /> {avatarUrl ? "Replace photo" : "Add a photo"}</button>{avatarUrl && <button type="button" className="back-button !px-3 !py-2 text-sm" onClick={onRemoveAvatar}>Remove</button>}</div></div>
    {avatarError && <p role="alert" className="mb-3 text-sm text-red-700">{avatarError}</p>}
    <div className="profile-form"><label><span>Full name</span><div className="field-wrap"><UserRound size={16} /><input value={firstName} onChange={event => setFirstName(event.target.value)} placeholder="First name" /></div></label><label><span>Last name <small>(optional)</small></span><div className="field-wrap"><UserRound size={16} /><input value={lastName} onChange={event => setLastName(event.target.value)} placeholder="Last name" /></div></label><label><span>Preferred display name <small>(optional)</small></span><div className="field-wrap"><UserRound size={16} /><input value={displayName} onChange={event => setDisplayName(event.target.value)} placeholder={fullName || "What should we call you?"} /></div></label><label><span>Email <small>(optional)</small></span><div className="field-wrap"><Mail size={16} /><input type="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" /></div></label><label><span>Preferred language</span><select value={language} onChange={event => setLanguage(event.target.value)} className="field-wrap w-full bg-transparent px-3 py-3 text-sm"><option value="en">English</option><option value="hi">Hindi</option><option value="es">Spanish</option><option value="fr">French</option><option value="de">German</option><option value="zh">Chinese</option><option value="ja">Japanese</option><option value="other">Other</option></select></label><label><span>How will you use LearnLoop?</span><select value={userType} onChange={event => setUserType(event.target.value as "learner" | "creator" | "both")} className="field-wrap w-full bg-transparent px-3 py-3 text-sm"><option value="learner">Learner</option><option value="creator">Creator</option><option value="both">Both</option></select></label><label className="full-field"><span>Areas of interest <small>(comma separated, optional)</small></span><div className="field-wrap"><Sparkles size={16} /><input value={interests} onChange={event => setInterests(event.target.value)} placeholder="Design, biology, languages…" /></div></label><label><span>Workspace name <small>(optional)</small></span><div className="field-wrap"><BookOpen size={16} /><input value={workspaceName} onChange={event => setWorkspaceName(event.target.value)} placeholder="My learning space" /></div></label><label><span>Date of birth <small>(optional)</small></span><div className="field-wrap"><CalendarDays size={16} /><input type="date" value={dob} onChange={event => setDob(event.target.value)} /></div></label><label className="full-field"><span>Anything else we should know? <small>(optional)</small></span><textarea value={details} onChange={event => setDetails(event.target.value)} placeholder="Learning goals, accessibility preferences, or context for personalization." /></label></div>
    <label className="terms-row"><input type="checkbox" checked={terms} onChange={event => setTerms(event.target.checked)} /><span>I agree to the <button type="button">Terms & Conditions</button> and understand how LearnLoop uses my profile to personalize learning.</span></label>{saveError && <p role="alert" className="text-sm text-amber-700 mt-3">{saveError}</p>}<div className="setup-footer"><button className="back-button" onClick={onBack} disabled={saving}><ArrowLeft size={17} /> Back</button><button className="primary-button" disabled={!complete || saving} onClick={onContinue}>Continue to onboarding <ArrowRight size={17} /></button></div></div></AuthShell>;
}

function SetupShell({ currentStep, children }: { currentStep: SetupStep; children: React.ReactNode }) {
  return <div className="setup-screen"><div className="setup-left"><div className="setup-glow setup-glow-one" /><div className="setup-glow setup-glow-two" /><div className="setup-grain" /><div className="setup-quote"><span className="quote-kicker">YOUR NEXT CHAPTER</span><span className="quote-mark">“</span><p>Make room for the ideas that stay with you <em className="shader-text">for life.</em></p><span className="quote-caption">A little progress, every day.</span></div><div className="setup-visual" aria-hidden="true"><div className="visual-card visual-card-main"><span className="visual-card-label">TODAY’S NOTE</span><strong>Small steps<br /><i>compound.</i></strong><span className="visual-card-footer"><span className="visual-dot" /> 04 min focus</span></div><div className="visual-card visual-card-mini"><span className="mini-check">✓</span><span>show up<br /><b>again</b></span></div><svg className="visual-stroke" viewBox="0 0 280 100" fill="none"><path d="M6 77C42 12 77 78 111 38C140 4 160 60 190 34C215 13 231 37 274 8" /></svg><span className="visual-spark spark-one">✦</span><span className="visual-spark spark-two">✦</span></div><div className="setup-message"><span className="message-line" /><span>learn with intention</span><div className="message-points"><span><b>01</b> learn</span><span><b>02</b> practice</span><span><b>03</b> remember</span></div></div><div className="setup-aside-footer"><span>learnloop / course builder</span><span>made for curious humans</span></div></div><main className="setup-main"><StepDots current={currentStep} /><div className="setup-content">{children}</div></main></div>;
}

function CourseSidebar({ topicName, level, onEdit }: { topicName: string; level: Level; onEdit: () => void }) {
  return <aside className="course-sidebar"><div className="sidebar-top"><Logo /><button className="icon-button"><ChevronDown size={18} /></button></div><div className="profile-mini"><div className="avatar large">AK</div><div><strong>Alex’s space</strong><small>Level 4 learner</small></div><button className="more-button">•••</button></div><nav className="side-nav"><button className="active"><BookOpen size={18} /> My learning <span className="nav-count">1</span></button><button><Trophy size={18} /> Achievements</button><button><Headphones size={18} /> Audio lessons <span className="new-badge">NEW</span></button></nav><div className="sidebar-course"><span className="section-kicker">CURRENT COURSE</span><div className="course-color-dot" /><h3>{topicName}</h3><p>{level} path · 14 lessons</p><ProgressBar value={38} color="#58cc02" /><span className="course-progress">38% complete</span><button className="edit-course" onClick={onEdit}>Edit course <RotateCcw size={13} /></button></div><div className="sidebar-bottom"><div className="streak-card"><Flame size={18} fill="#f4b942" color="#f4b942" /><span><strong>7 day streak</strong><small>Keep it going!</small></span><ArrowRight size={14} /></div><span className="version-note">Offline mode ready · v0.1</span></div></aside>;
}

function LessonNode({ index, title, copy, status, color, onClick }: { index: number; title: string; copy: string; status: "done" | "active" | "locked"; color: string; onClick?: () => void }) {
  return <button className={`lesson-node ${status}`} onClick={onClick} disabled={status === "locked"}><span className="node-number" style={{ background: status === "locked" ? "#e7e4df" : color }}>{status === "done" ? <Check size={17} /> : status === "locked" ? <Lock size={15} /> : `0${index}`}</span><span className="node-copy"><strong>{title}</strong><small>{copy}</small></span>{status === "active" && <span className="start-prompt"><Play size={12} fill="currentColor" /> Start</span>}{status === "done" && <span className="done-label">done</span>}</button>;
}

function GuidedWorkspace({ topic, customTopic, level, goal, timeBudget, style, format, role, grounding, onEdit }: { topic: Topic | null; customTopic: string; level: Level; goal: string; timeBudget: string; style: string; format: string; role: string; grounding: string; onEdit: () => void }) {
  const topicName = topic?.name || customTopic || "Your new skill";
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [stage, setStage] = useState(0);
  const [scrubProgress, setScrubProgress] = useState<number | null>(null);
  const [loopComplete, setLoopComplete] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [mindTopic, setMindTopic] = useState("Foundations");
  const [assistantOpen, setAssistantOpen] = useState(false);
  const stages = ["Learn", "Quiz", "Test", "Challenge", "Rapid revision"];
  const tools = [{ id: "notes", label: "Notes", icon: BookOpen, copy: "Read a concise lesson" }, { id: "mindmap", label: "Mindmap", icon: Brain, copy: "Navigate connected ideas" }, { id: "flashcards", label: "Flashcards", icon: Layers3, copy: "Recall key concepts" }, { id: "audio", label: "Audio note", icon: Headphones, copy: "Listen on the go" }, { id: "quiz", label: "Quizzer", icon: Target, copy: "Check your understanding" }, { id: "challenger", label: "Challenger", icon: Trophy, copy: "Stretch your thinking" }];
  const progress = scrubProgress ?? (stage + 1) * 20;
  const updateProgressFromPointer = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(100, Math.round(((event.clientX - bounds.left) / bounds.width) * 100)));
    setScrubProgress(next);
    if (next >= 100) setLoopComplete(true);
  };
  const groundingLabel = grounding === "grounded" ? "Your sources only" : grounding === "trusted" ? "Sources + trusted web" : "Sources + web + video";
  return <div className="guided-shell"><aside className="guided-sidebar"><div className="sidebar-top"><Logo /><button className="icon-button"><ChevronDown size={18} /></button></div><div className="profile-mini"><div className="avatar large">AK</div><div><strong>Alex’s space</strong><small>{level} learner</small></div></div><nav className="side-nav"><button className="active"><BookOpen size={18} /> My learning <span className="nav-count">1</span></button><button onClick={() => setAssistantOpen(true)}><Sparkles size={18} /> Offline assistant</button><button><Trophy size={18} /> Achievements</button></nav><div className="sidebar-course"><span className="section-kicker">CURRENT COURSE</span><div className="course-color-dot" /><h3>{topicName}</h3><p>{level} path · {timeBudget} a day</p><ProgressBar value={progress} color="#2e8b57" /><span className="course-progress">{progress}% complete</span><button className="edit-course" onClick={onEdit}>Tune profile <RotateCcw size={13} /></button></div><div className="sidebar-bottom"><div className="streak-card"><Flame size={18} fill="#c99d32" color="#c99d32" /><span><strong>7 day streak</strong><small>Keep it going!</small></span><ArrowRight size={14} /></div><span className="version-note">Offline mode ready · v0.1</span></div></aside><main className="guided-main"><div className="dashboard-mobile-header"><Logo /><button className="avatar">AK</button></div><div className="guided-heading"><div><span className="setup-eyebrow"><span className="eyebrow-dot" /> YOUR GUIDED COURSE</span><h1>{topicName}<span className="heading-dot">.</span></h1><p>{level} path · {goal === "exam" ? "exam focus" : goal === "career" ? "career focus" : "curiosity mode"} · {groundingLabel}</p></div><button className="small-outline" onClick={() => setAssistantOpen(true)}><Sparkles size={14} /> Ask offline AI</button></div><section className={`loop-card ${loopComplete ? "loop-card-complete" : ""}`}><div className="loop-top"><div><span className="section-kicker">TOPIC MASTERY LOOP</span><h2>{loopComplete ? "Loop complete." : `${stages[stage]} this topic`}</h2><p>{loopComplete ? "You built the mental model. Take a breath — the next idea is ready when you are." : `Learn ${topicName} through a guided sequence. Each stage unlocks the next 20%.`}</p></div><strong>{progress}%</strong></div><div className={`loop-track ${isScrubbing ? "is-scrubbing" : ""}`} onPointerDown={(event) => { setIsScrubbing(true); updateProgressFromPointer(event); }} onPointerMove={(event) => event.buttons === 1 && updateProgressFromPointer(event)} onPointerUp={() => setIsScrubbing(false)} onPointerCancel={() => setIsScrubbing(false)} role="slider" aria-label="Loop progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} tabIndex={0}><span style={{ width: `${progress}%` }} /></div><div className="loop-stages">{stages.map((item, index) => <button key={item} className={index <= stage ? "complete" : ""} onClick={() => { if (index <= stage) { setStage(index); setScrubProgress((index + 1) * 20); setLoopComplete(false); } }}><span>{index < stage ? <Check size={13} /> : `0${index + 1}`}</span><small>{item}</small></button>)}</div><button className="primary-button loop-cta" onClick={() => { if (stage < 4) { setStage(stage + 1); setScrubProgress((stage + 2) * 20); } else { setScrubProgress(100); setLoopComplete(true); } setActiveTool(stage === 0 ? "notes" : stage === 1 ? "quiz" : stage === 2 ? "test" : stage === 3 ? "challenger" : "revision"); }}>{loopComplete ? "Explore what’s next" : stage === 0 ? "Start learning" : `Continue to ${stages[stage]}`} <ArrowRight size={16} /></button>{loopComplete && <div className="loop-celebration" aria-live="polite"><span className="celebration-spark spark-a">✦</span><span className="celebration-spark spark-b">✧</span><span className="celebration-spark spark-c">✦</span><div className="celebration-icon"><Sparkles size={22} /></div><strong>Loop complete.</strong><small>That idea is yours now.</small></div>}</section><section className="guided-tools"><div className="section-heading"><div><span className="section-kicker">USE ANY MODE SEPARATELY</span><h2>Your learning toolkit</h2></div><span className="tool-hint">Pick a tool whenever you need it</span></div><div className="tool-grid">{tools.map(({ id, label, icon: Icon, copy }) => <button key={id} className={`tool-card ${activeTool === id ? "selected" : ""}`} onClick={() => setActiveTool(id)}><span className="tool-icon"><Icon size={19} /></span><strong>{label}</strong><small>{copy}</small><ArrowRight size={15} /></button>)}</div></section><section className="workspace-lower"><div className="mindmap-card"><div className="section-heading"><div><span className="section-kicker">INTERACTIVE MINDMAP</span><h2>Follow the idea</h2></div><Brain size={20} /></div><p>Click a node to open a focused explanation portal.</p><div className="mindmap-canvas"><button className="mind-node root" onClick={() => setMindTopic("Foundations")}>Foundations</button><span className="mind-line line-a" /><span className="mind-line line-b" /><button className={`mind-node node-a ${mindTopic === "Variables" ? "active" : ""}`} onClick={() => setMindTopic("Variables")}>Variables</button><button className={`mind-node node-b ${mindTopic === "Functions" ? "active" : ""}`} onClick={() => setMindTopic("Functions")}>Functions</button><button className={`mind-node node-c ${mindTopic === "Projects" ? "active" : ""}`} onClick={() => setMindTopic("Projects")}>Projects</button></div><div className="explanation-portal"><span className="section-kicker">FOCUSED EXPLANATION</span><h3>{mindTopic}</h3><p>{mindTopic === "Foundations" ? "Start with the mental model, then follow a branch when you are ready for more detail." : `${mindTopic} is now open as a focused lesson. Learn the idea, see an example, then try a quick check.`}</p><button className="text-button dark" onClick={() => setActiveTool("notes")}>Open explanation <ArrowRight size={15} /></button></div></div><div className="assistant-card"><div className="assistant-orb"><Sparkles size={22} /></div><span className="section-kicker">OFFLINE AI ASSISTANT</span><h2>Your pocket tutor, even without signal.</h2><p>Ask questions, summarize notes, create quizzes, and revise from your saved course pack.</p><div className="assistant-pills"><span>Q&A</span><span>Summaries</span><span>Quizzes</span><span>Revision</span></div><button className="primary-button" onClick={() => setAssistantOpen(true)}>Open assistant <ArrowRight size={15} /></button></div></section>{activeTool && <div className="tool-drawer"><div><span className="section-kicker">NOW OPEN</span><h2>{activeTool === "mindmap" ? "Interactive mindmap" : activeTool === "flashcards" ? "Flashcard deck" : activeTool === "audio" ? "Audio lesson" : activeTool === "challenger" ? "Challenge mode" : activeTool === "quiz" ? "Quizzer" : activeTool === "test" ? "Topic test" : activeTool === "revision" ? "Rapid revision" : "Guided notes"}</h2><p>This focused mode is personalized for your {level.toLowerCase()} level, {role === "student" ? "tutor-led" : role === "coach" ? "coach-led" : "challenge-led"} learning style.</p></div><button className="icon-button" onClick={() => setActiveTool(null)}><X size={18} /></button></div>}{assistantOpen && <div className="assistant-backdrop"><div className="assistant-modal"><div className="modal-top"><span className="section-kicker">OFFLINE AI ASSISTANT</span><button className="icon-button" onClick={() => setAssistantOpen(false)}><X size={18} /></button></div><div className="assistant-modal-icon"><Sparkles size={24} /></div><h2>What should we work on?</h2><p>Ask about {topicName}, summarize a note, or generate a quick revision set from your saved sources.</p><div className="assistant-input"><span>⌕</span><span>e.g. explain this like I’m new to it…</span></div><div className="assistant-suggestions"><button onClick={() => setActiveTool("notes")}>Summarize my notes</button><button onClick={() => setActiveTool("quiz")}>Make a quiz</button><button onClick={() => setActiveTool("revision")}>Start revision</button></div></div></div>}</main></div>;
}

function Dashboard({ topic, customTopic, level, goal, timeBudget, style, format, role, grounding, onEdit }: { topic: Topic | null; customTopic: string; level: Level; goal: string; timeBudget: string; style: string; format: string; role: string; grounding: string; onEdit: () => void }) {
  const topicName = topic?.name || customTopic || "Your new skill";
  const [activeLesson, setActiveLesson] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const current = levelDetails[level];
  const lessonCount = current.lessons;
  const profileSummary = `${format === "mixed" ? "Mixed formats" : format === "visual" ? "Visual-first" : "Audio-first"} · ${role === "student" ? "Personal tutor" : role === "coach" ? "Study coach" : "Challenger"} · ${grounding === "grounded" ? "Cited sources only" : grounding === "trusted" ? "Trusted web allowed" : "Web + video exploration"}`;
  const lessonItems = useMemo(() => [
    { title: "Meet the big idea", copy: "A friendly first look", status: "done" as const },
    { title: "The pieces that matter", copy: "Learn the building blocks", status: "active" as const },
    { title: "Put it together", copy: "Connect the concepts", status: "locked" as const },
    { title: "Quick check", copy: "A 5-minute challenge", status: "locked" as const },
  ], []);
  return <div className="dashboard-shell"><CourseSidebar topicName={topicName} level={level} onEdit={onEdit} /><main className="dashboard-main"><div className="dashboard-mobile-header"><Logo /><button className="avatar">AK</button></div><div className="dashboard-heading"><div><span className="setup-eyebrow"><span className="eyebrow-dot" /> YOUR PERSONAL COURSE</span><h1>{topicName}<span className="heading-dot">.</span></h1><p>{current.badge} path · {timeBudget} a day · {goal === "exam" ? "exam focus" : goal === "career" ? "career focus" : "curiosity mode"}</p></div><button className="small-outline" onClick={onEdit}><RotateCcw size={14} /> Tune course</button></div><div className="stats-row"><div className="stat-card stat-green"><span className="stat-icon"><Flame size={18} fill="#58cc02" /></span><div><strong>7</strong><small>day streak</small></div><span className="stat-trend">+2 this week</span></div><div className="stat-card stat-yellow"><span className="stat-icon"><Zap size={18} fill="#f4b942" /></span><div><strong>1,240</strong><small>total XP</small></div><span className="stat-trend">Top 18%</span></div><div className="stat-card stat-purple"><span className="stat-icon"><Target size={18} /></span><div><strong>38%</strong><small>course complete</small></div><span className="stat-trend">Keep going</span></div></div><section className="course-map-section"><div className="section-heading"><div><span className="section-kicker">YOUR LEARNING PATH</span><h2>Small steps. Real momentum.</h2></div><button className="text-button dark">View all levels <ArrowRight size={15} /></button></div><div className="level-progress-line"><div className="level-track"><span className="level-fill" style={{ width: "42%" }} /></div><div className="level-labels"><span className="current-level">Level 01 <b>Warm up</b></span><span>Level 02 <b>Core ideas</b></span><span>Level 03 <b>Practice lab</b></span><span>Level 04 <b>Final quest</b></span></div></div><div className="map-layout"><div className="map-main"><div className="map-intro"><div className="lesson-badge">LEVEL 01</div><div><h3>Let’s get oriented</h3><p>Start here · 4 lessons · 80 XP</p></div><span className="map-mascot">✦</span></div><div className="lesson-list">{lessonItems.map((lesson, index) => <LessonNode key={lesson.title} index={index + 1} title={lesson.title} copy={lesson.copy} status={lesson.status} color={topic?.color || "#e86a53"} onClick={lesson.status === "active" ? () => setActiveLesson(true) : undefined} />)}</div>{!showAll && <button className="unlock-button" onClick={() => setShowAll(true)}><Lock size={14} /> Show the next level</button>}{showAll && <div className="next-level-row"><span className="node-number" style={{ background: "#f4b942" }}>02</span><div><strong>Core ideas</strong><small>Unlocks after you finish this level</small></div><span className="xp-chip">+120 XP</span></div>}</div><aside className="right-rail"><div className="today-card"><div className="today-top"><span className="section-kicker">TODAY’S GOAL</span><span className="today-icon"><Target size={16} /></span></div><strong>{timeBudget === "5 min" ? "5" : timeBudget === "10 min" ? "10" : timeBudget === "15 min" ? "15" : "20"}<small>min</small></strong><p>One tiny session is enough to keep your streak alive.</p><ProgressBar value={64} color="#e86a53" /><button className="today-button" onClick={() => setActiveLesson(true)}>Continue lesson <ArrowRight size={15} /></button></div><div className="tip-card"><span className="tip-star">✦</span><div><strong>Smart tip</strong><p>Your course is weighted toward <b>{style === "visual" ? "visual maps" : style === "practice" ? "hands-on practice" : "balanced review"}</b> based on your setup.</p></div></div></aside></div></section>{activeLesson && <LessonModal topicName={topicName} onClose={() => setActiveLesson(false)} />}</main></div>;
}

function LessonModal({ topicName, onClose }: { topicName: string; onClose: () => void }) {
  const [choice, setChoice] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const answer = "A clear mental model";
  return <div className="modal-backdrop"><div className="lesson-modal"><div className="modal-top"><span className="section-kicker">LESSON 02 · 4 MIN</span><button className="icon-button" onClick={onClose}><X size={19} /></button></div><ProgressBar value={46} color="#58cc02" /><div className="lesson-content"><div className="lesson-spark">✦</div><span className="preview-eyebrow">{topicName} · core ideas</span><h2>Before we add more detail,<br />what makes a concept <em>stick?</em></h2><p className="lesson-question">Pick the answer that feels most true.</p><div className="answer-list">{["A longer textbook", "A clear mental model", "More tabs open", "Perfect handwriting"].map((item) => <button key={item} className={`answer-option ${choice === item ? "selected" : ""} ${submitted && item === answer ? "correct" : ""}`} onClick={() => !submitted && setChoice(item)}><span className="answer-key">{String.fromCharCode(65 + ["A longer textbook", "A clear mental model", "More tabs open", "Perfect handwriting"].indexOf(item))}</span>{item}{submitted && item === answer && <Check size={17} />}</button>)}</div></div><div className="modal-footer"><span>{submitted ? "Nice work — that’s the idea." : "No rush. Think it through."}</span><button className="primary-button" disabled={!choice} onClick={() => choice && (submitted ? onClose() : setSubmitted(true))}>{submitted ? "Continue" : "Check answer"} <ArrowRight size={16} /></button></div></div></div>;
}

function LandingPage({ onStart }: { onStart: () => void }) {
  const [kitProgress, setKitProgress] = useState(62);
  const [kitScrubbing, setKitScrubbing] = useState(false);
  const [kitComplete, setKitComplete] = useState(false);
  const updateKitProgress = (event: React.PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const next = Math.max(0, Math.min(100, Math.round(((event.clientX - bounds.left) / bounds.width) * 100)));
    setKitProgress(next);
    if (next >= 100) setKitComplete(true);
  };
  return <div className="landing-page">
    <header className="landing-nav">
      <a className="landing-brand" href="#top" aria-label="LearnLoop home"><span className="landing-brand-orbit"><span /></span><span>learn<span>loop</span></span></a>
      <nav className="landing-links" aria-label="Main navigation">
        <a href="#how-it-works">How it works</a>
        <a href="#study-kit">Study kit</a>
        <a href="#why-learnloop">Why LearnLoop</a>
      </nav>
      <div className="landing-actions"><ThemeToggle /><button className="landing-login" onClick={onStart}>Log in <ArrowRight size={14} /></button></div>
    </header>
    <main id="top">
      <section className="landing-hero">
        <div className="landing-copy">
          <div className="landing-eyebrow"><span /> PERSONALIZED LEARNING, WITHOUT THE NOISE</div>
          <h1>Stop rewriting.<br /><em>Start remembering.</em></h1>
          <p>Turn your notes, goals, and curiosity into a learning loop that knows what to explain next — and helps it stick.</p>
          <div className="landing-cta-row"><button className="landing-primary" onClick={onStart}>Start studying free <ArrowRight size={17} /></button><a className="landing-secondary" href="#how-it-works">Learn more <ArrowDown size={15} /></a></div>
          <div className="landing-proof"><div className="landing-avatars"><span>AK</span><span>RM</span><span>JS</span></div><div><strong>Made for curious humans</strong><small>Private by default · No credit card</small></div></div>
        </div>
        <div className="landing-kit-anchor" id="study-kit">
          <div className="landing-kit">
            <div className="kit-browser"><span /><span /><span /><small>learnloop / your next session</small><b>● ready</b></div>
            <div className="kit-body"><div className="kit-kicker">TODAY’S LOOP · 04 MIN</div><h2>Build a mental model<br /><em>before the details.</em></h2><p>Learn the shape of an idea first. Then make it yours with a quick check.</p><div className={`kit-progress ${kitScrubbing ? "is-scrubbing" : ""}`} onPointerDown={(event) => { setKitScrubbing(true); updateKitProgress(event); }} onPointerMove={(event) => event.buttons === 1 && updateKitProgress(event)} onPointerUp={() => setKitScrubbing(false)} onPointerCancel={() => setKitScrubbing(false)} role="slider" aria-label="Study kit progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={kitProgress} tabIndex={0}><span className="kit-progress-fill" style={{ width: `${kitProgress}%` }} /><i>{kitProgress}%</i></div><div className="kit-cards"><button><span className="kit-card-icon">▣</span><span><strong>Notes</strong><small>Clear, cited explanations</small></span><ArrowRight size={15} /></button><button><span className="kit-card-icon">✓</span><span><strong>Quizzer</strong><small>Recall what matters</small></span><ArrowRight size={15} /></button><button><span className="kit-card-icon">⌘</span><span><strong>Flowchart</strong><small>Map the next best step</small></span><ArrowRight size={15} /></button><button><span className="kit-card-icon">◌</span><span><strong>Audio note</strong><small>Learn on the go</small></span><ArrowRight size={15} /></button></div></div>
            <div className="kit-foot"><span>Learning loop</span><strong>One workspace for every way you learn.</strong><span>04 tools</span></div>
          </div>
        </div>
      </section>{kitComplete && <div className="kit-complete-overlay" aria-live="polite"><div className="kit-confetti confetti-one">✦</div><div className="kit-confetti confetti-two">✧</div><div className="kit-confetti confetti-three">✦</div><div className="kit-complete-card"><div className="kit-complete-icon"><Sparkles size={25} /></div><span>YOUR LEARNING LOOP</span><strong>Loop complete.</strong><p>You made the idea yours.</p><button className="landing-primary" onClick={() => { setKitComplete(false); setKitProgress(62); onStart(); }}>Explore more <ArrowRight size={16} /></button></div></div>}
      <section className="landing-how" id="how-it-works">
        <div className="section-intro"><div className="landing-eyebrow"><span /> HOW THE LOOP WORKS</div><h2>A little structure.<br /><em>A lot more stick.</em></h2><p>LearnLoop turns scattered material into a calm, repeatable rhythm—so every session knows where to begin and what to do next.</p></div>
        <div className="how-grid"><article><span className="how-number">01</span><div className="how-icon">↘</div><h3>Bring your material</h3><p>Drop in notes, links, or simply tell us what you want to understand.</p><small>INPUT / YOUR WORLD</small></article><article><span className="how-number">02</span><div className="how-icon">✦</div><h3>Make it make sense</h3><p>We shape it into explanations, maps, questions, and examples that fit your style.</p><small>PROCESS / PERSONALIZE</small></article><article><span className="how-number">03</span><div className="how-icon">↗</div><h3>Keep the loop going</h3><p>Practice a little, get feedback, and return when your next question appears.</p><small>OUTPUT / MOMENTUM</small></article></div>
        <div className="landing-steps"><div><span>01</span><strong>Bring your material</strong><small>Notes, links, or a fresh goal.</small></div><div><span>02</span><strong>Choose your rhythm</strong><small>Visual, practical, or balanced.</small></div><div><span>03</span><strong>Keep the loop going</strong><small>Learn, practice, remember.</small></div></div>
      </section>
      <section className="landing-why" id="why-learnloop"><div><div className="landing-eyebrow"><span /> A BETTER WAY TO LEARN</div><h2>Your attention is valuable.<br /><em>Spend it on the good part.</em></h2></div><p>Less tab-hopping. Less busywork. More of the small, satisfying moment when something finally clicks.</p><button className="landing-primary" onClick={onStart}>Build your learning loop <ArrowRight size={17} /></button></section>
    </main>
    <footer className="landing-footer"><a className="landing-brand" href="#top"><span className="landing-brand-orbit"><span /></span><span>learn<span>loop</span></span></a><span>Personalized learning, without the noise.</span><span>© 2025 LearnLoop</span></footer>
  </div>;
}

export default function Onboarding() {
  const { user, profile, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();
  const workspaceQuery = trpc.workspace.bootstrap.useQuery();
  const completeOnboarding = trpc.user.completeOnboarding.useMutation();
  const [showLanding, setShowLanding] = useState(true);
  const [authStep, setAuthStep] = useState<"connect" | "profile" | "onboarding">("connect");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [details, setDetails] = useState("");
  const [userType, setUserType] = useState<"learner" | "creator" | "both">("learner");
  const [interests, setInterests] = useState("");
  const [workspaceName, setWorkspaceName] = useState("");
  const [language, setLanguage] = useState("en");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarDataUrl, setAvatarDataUrl] = useState("");
  const [avatarRemoved, setAvatarRemoved] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const [terms, setTerms] = useState(false);
  const [step, setStep] = useState<SetupStep>("topic");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [customTopic, setCustomTopic] = useState("");
  const [level, setLevel] = useState<Level>("Beginner");
  const [goal, setGoal] = useState("career");
  const [timeBudget, setTimeBudget] = useState("10 min");
  const [style, setStyle] = useState("balanced");
  const [format, setFormat] = useState("mixed");
  const [role, setRole] = useState("student");
  const [grounding, setGrounding] = useState("grounded");
  const [profileSaveError, setProfileSaveError] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);
  const hydratedUserRef = useRef<number | null>(null);
  const learnerName = `${firstName.trim()} ${lastName.trim()}`.trim();
  const goalLabels: Record<string, string> = { exam: "Ace an exam", career: "Grow for work", curious: "Learn for life" };
  const topicName = selectedTopic?.name || customTopic.trim();

  useEffect(() => {
    if (!user || !profile || hydratedUserRef.current === user.id) return;
    hydratedUserRef.current = user.id;
    const saved = (profile.learningProfile || {}) as Record<string, string>;
    const nameParts = (profile.fullName || "").trim().split(/\s+/).filter(Boolean);
    setFirstName(nameParts[0] || "");
    setLastName(nameParts.slice(1).join(" "));
    setDisplayName(profile.preferredDisplayName || "");
    setEmail(profile.email || user.email || "");
    setAvatarUrl(profile.avatarUrl || "");
    setUserType(profile.userType === "creator" || profile.userType === "both" ? profile.userType : "learner");
    setInterests(Array.isArray(profile.interests) ? profile.interests.join(", ") : "");
    setWorkspaceName(profile.workspaceName || "");
    setLanguage(profile.preferredLanguage || saved.language || "en");
    setDob(profile.dateOfBirth || saved.dateOfBirth || "");
    setDetails(profile.details || saved.details || "");
    const existingTopic = (Array.isArray(profile.topics) ? profile.topics[0] : "") || saved.topic || "";
    const matchingTopic = topics.find(topic => topic.name.toLowerCase() === existingTopic.toLowerCase());
    setSelectedTopic(matchingTopic || null);
    setCustomTopic(matchingTopic ? "" : existingTopic);
    setLevel((profile.experienceLevel || saved.level || "Beginner") as Level);
    setGoal((Array.isArray(profile.learningGoals) ? profile.learningGoals[0] : "") || saved.goal || "career");
    setTimeBudget(profile.dailyTarget || saved.timeBudget || "10 min");
    setStyle(profile.learningStyle || saved.explanationStyle || "balanced");
    setFormat(saved.format || "mixed");
    setRole(profile.role || saved.role || "student");
    setGrounding(saved.grounding || "grounded");
  }, [user, profile]);

  useEffect(() => {
    if (user && authStep === "connect") setAuthStep("profile");
  }, [authStep, user]);

  const handleAvatarFile = async (file: File) => {
    setAvatarError("");
    try {
      const prepared = await prepareProfileAvatar(file);
      setAvatarDataUrl(prepared);
      setAvatarUrl(prepared);
      setAvatarRemoved(false);
    } catch (error) {
      setAvatarError(error instanceof Error ? error.message : "Could not prepare this profile photo.");
    }
  };
  const handleRemoveAvatar = () => {
    setAvatarUrl("");
    setAvatarDataUrl("");
    setAvatarRemoved(true);
    setAvatarError("");
  };
  const saveProfile = async () => {
    const fullName = learnerName || displayName.trim();
    if (!user) throw new Error("Sign in before saving your profile.");
    if (!fullName) throw new Error("Enter your name or preferred display name before continuing.");
    const profileInput = {
      fullName,
      ...(displayName.trim() ? { displayName: displayName.trim() } : {}),
      ...(email.trim() ? { email: email.trim() } : {}),
      role,
      userType,
      ...(interests.trim() ? { interests: interests.split(",").map(value => value.trim()).filter(Boolean) } : {}),
      learningGoals: [goalLabels[goal] || goal],
      experienceLevel: level,
      learningStyle: style,
      preferredLanguage: language,
      dailyTarget: timeBudget,
      ...(topicName ? { topics: [topicName] } : {}),
      ...(workspaceQuery.data?.id ? { workspaceId: workspaceQuery.data.id } : {}),
      ...(workspaceName.trim() ? { workspaceName: workspaceName.trim() } : {}),
      ...(dob ? { dateOfBirth: dob } : {}),
      ...(details.trim() ? { details: details.trim() } : {}),
      learningProfile: {
        dateOfBirth: dob,
        details: details.trim(),
        topic: topicName,
        level,
        goal,
        timeBudget,
        explanationStyle: style,
        format,
        role,
        grounding,
      },
      ...(avatarDataUrl ? { avatarDataUrl } : avatarRemoved ? { avatarUrl: "" } : {}),
    };
    setProfileSaveError("");
    setSavingProfile(true);
    try {
      const savedProfile = await completeOnboarding.mutateAsync(profileInput);
      utils.user.getLearnerProfile.setData(undefined, savedProfile);
      await Promise.all([utils.user.getLearnerProfile.invalidate(), utils.auth.me.invalidate()]);
      setProfileSaved(true);
      window.setTimeout(() => setLocation("/"), 1100);
    } catch (error) {
      setProfileSaveError(error instanceof Error ? error.message : "Your profile could not be saved. Please retry.");
    } finally {
      setSavingProfile(false);
    }
  };
  const reset = () => { setStep("topic"); setProfileSaved(false); };
  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm font-semibold text-gray-500">Loading your profile…</div>;
  if (showLanding) return <LandingPage onStart={() => setShowLanding(false)} />;
  if (authStep === "connect") return <ConnectStep onWeb={() => setAuthStep("profile")} onBack={() => setShowLanding(true)} onGoogle={() => { window.location.assign(`/api/auth/google/start?returnTo=${encodeURIComponent("/onboarding")}`); }} />;
  if (authStep === "profile") return <ProfileStep firstName={firstName} setFirstName={setFirstName} lastName={lastName} setLastName={setLastName} displayName={displayName} setDisplayName={setDisplayName} email={email} setEmail={setEmail} userType={userType} setUserType={setUserType} interests={interests} setInterests={setInterests} workspaceName={workspaceName} setWorkspaceName={setWorkspaceName} language={language} setLanguage={setLanguage} dob={dob} setDob={setDob} details={details} setDetails={setDetails} avatarUrl={avatarUrl} avatarError={avatarError} onAvatarFile={file => void handleAvatarFile(file)} onRemoveAvatar={handleRemoveAvatar} terms={terms} setTerms={setTerms} saveError={profileSaveError} saving={false} onBack={() => setAuthStep("connect")} onContinue={() => { setProfileSaveError(""); setAuthStep("onboarding"); }} />;
  if (profileSaved) return <AuthShell><div className="auth-card text-center"><span className="setup-eyebrow"><span className="eyebrow-dot" /> PROFILE SAVED</span><h1>Your LearnLoop<br /><em>profile is ready.</em></h1><p className="lead">Welcome, {displayName.trim() || learnerName || email.split("@", 1)[0] || "New Learner"}. Opening your learning space…</p></div></AuthShell>;

  return <><AppHeader courseBuilt={false} onReset={reset} /><SetupShell currentStep={step}>
    {step === "topic" && <TopicStep selectedTopic={selectedTopic} setSelectedTopic={setSelectedTopic} customTopic={customTopic} setCustomTopic={setCustomTopic} onNext={() => setStep("level")} />}
    {step === "level" && <LevelStep level={level} setLevel={setLevel} selectedTopic={selectedTopic} onBack={() => setStep("topic")} onNext={() => setStep("goal")} />}
    {step === "goal" && <GoalStep goal={goal} setGoal={setGoal} timeBudget={timeBudget} setTimeBudget={setTimeBudget} onBack={() => setStep("level")} onNext={() => setStep("format")} />}
    {step === "format" && <ChoiceStep stepNumber="04" title={<>How do you want<br /><em>to learn it?</em></>} accent="Preferred learning format" lead="We’ll shape each session around the formats that keep you engaged — not just what’s easiest to generate." value={format} setValue={setFormat} options={[{ id: "mixed", icon: Layers3, title: "A mix of formats", copy: "Notes, maps, quizzes, flashcards, and more." }, { id: "visual", icon: Sparkles, title: "Visual first", copy: "Mind maps, diagrams, and structured summaries." }, { id: "audio", icon: Headphones, title: "Listen and learn", copy: "Audio notes and commute-ready explanations." }]} onBack={() => setStep("goal")} onNext={() => setStep("explanation")} />}
    {step === "explanation" && <ChoiceStep stepNumber="05" title={<>How should we<br /><em>explain things?</em></>} accent="Explanation style" lead="Choose the voice and depth that should show up across your notes, answers, and practice." value={style} setValue={setStyle} options={[{ id: "balanced", icon: Layers3, title: "Clear and balanced", copy: "Simple first, then more detail when it helps." }, { id: "visual", icon: Sparkles, title: "Use analogies", copy: "Connect new ideas to familiar things." }, { id: "practice", icon: Target, title: "Coach me", copy: "Ask guiding questions and let me discover." }]} onBack={() => setStep("format")} onNext={() => setStep("role")} />}
    {step === "role" && <ChoiceStep stepNumber="06" title={<>What role should<br /><em>the AI play?</em></>} accent="Role of the user" lead="Choose how you want LearnLoop to guide your learning." value={role} setValue={setRole} options={[{ id: "student", icon: BookOpen, title: "Personal tutor", copy: "Teach me patiently and check my understanding." }, { id: "coach", icon: Target, title: "Study coach", copy: "Keep me accountable and on track." }, { id: "challenger", icon: Target, title: "Challenger", copy: "Push me with harder questions and quests." }]} onBack={() => setStep("explanation")} onNext={() => setStep("grounding")} />}
    {step === "grounding" && <ChoiceStep stepNumber="07" title={<>How grounded should<br /><em>your answers be?</em></>} accent="Source and citation policy" lead="Choose how strictly LearnLoop should stay inside your uploaded material." value={grounding} setValue={setGrounding} options={[{ id: "grounded", icon: BookOpen, title: "Only my sources", copy: "Use uploaded textbooks and notes only." }, { id: "trusted", icon: Award, title: "My sources + trusted web", copy: "Start with my material, then add trusted web sources." }, { id: "open", icon: Sparkles, title: "Explore widely", copy: "Use books, web, and videos." }]} onBack={() => setStep("role")} onNext={() => { setProfileSaveError(""); setStep("review"); }} />}
    {step === "review" && <div className="profile-card"><div className="profile-card-heading"><div><span className="setup-eyebrow"><span className="eyebrow-dot" /> FINAL STEP / REVIEW</span><h1>Make sure it<br /><em>looks like you.</em></h1></div></div><p className="lead">Your profile is saved to your signed-in LearnLoop account. You can update it later.</p><div className="mb-6 flex items-center gap-4 rounded-2xl bg-[#f8f7f2] p-4"><div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-[#1b7a52] font-bold text-white">{avatarUrl ? <img src={avatarUrl} alt="" className="h-full w-full object-cover" /> : profileInitials(displayName || learnerName || email)}</div><div><strong>{displayName.trim() || learnerName || email.split("@", 1)[0] || "New Learner"}</strong><p className="text-sm text-gray-500">{email || "No email provided"}</p></div></div><dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2"><div><dt className="font-bold text-gray-500">Full name</dt><dd>{learnerName || "Not provided"}</dd></div><div><dt className="font-bold text-gray-500">Learner / creator</dt><dd>{userType}</dd></div><div><dt className="font-bold text-gray-500">Interests</dt><dd>{interests.trim() || "Not provided"}</dd></div><div><dt className="font-bold text-gray-500">Topics</dt><dd>{topicName || "Not provided"}</dd></div><div><dt className="font-bold text-gray-500">Goal & experience</dt><dd>{goalLabels[goal]}, {level}</dd></div><div><dt className="font-bold text-gray-500">Learning style</dt><dd>{style}, {format}</dd></div><div><dt className="font-bold text-gray-500">Daily target & language</dt><dd>{timeBudget}, {language}</dd></div><div><dt className="font-bold text-gray-500">Role & workspace</dt><dd>{role}, {workspaceName.trim() || workspaceQuery.data?.name || "Personal workspace"}</dd></div></dl><div className="mt-6 flex flex-wrap gap-3"><button className="back-button" disabled={savingProfile} onClick={() => setStep("grounding")}><ArrowLeft size={16} /> Back</button><button className="back-button" disabled={savingProfile} onClick={() => setAuthStep("profile")}>Edit profile</button><button className="primary-button" disabled={savingProfile || !user || !workspaceQuery.data} onClick={() => void saveProfile()}>{savingProfile ? "Saving…" : "Complete onboarding"} <Sparkles size={17} /></button></div>{profileSaveError && <div role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"><p>{profileSaveError}</p><button className="mt-2 font-bold underline" onClick={() => void saveProfile()} disabled={savingProfile}>Retry saving profile</button></div>}</div>}
  </SetupShell></>;
}
