/* Calm study workspace replica: warm near-white canvas, rounded white cards, charcoal ink, forest-green actions, asymmetric rail, restrained motion. */
import { useState } from "react";
import {
  Award,
  Brain,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  GraduationCap,
  Grid2X2,
  Headphones,
  HelpCircle,
  Leaf,
  Link2,
  MessageCircle,
  Mic,
  Podcast,
  Shapes,
  Sparkles,
  Timer,
  Upload,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

const markUrl = "/manus-storage/darwinity-mark_814656b6.png";
const darwinUrl = "/manus-storage/darwinity-darwin-portrait_536acf37.png";
const textureUrl = "/manus-storage/darwinity-study-texture_716f01d3.png";

type IconType = typeof Grid2X2;

type SourceCardProps = {
  icon: IconType;
  title: string;
  description: string;
  tone: string;
  onClick: () => void;
};

const navItems = [
  { label: "Home", icon: Grid2X2 },
  { label: "Podcasts", icon: Headphones },
  { label: "Exam prep", icon: GraduationCap },
  { label: "Study stats", icon: Award },
];

const outputs = [
  { title: "Notes", description: "Editable study notes from your source.", icon: FileText, tone: "sage" },
  { title: "Mind map", description: "See how topics connect.", icon: Brain, tone: "lavender" },
  { title: "Flashcards", description: "Active recall until it sticks.", icon: Shapes, tone: "mint" },
  { title: "Quizzes", description: "Exam-pressure practice.", icon: Sparkles, tone: "butter" },
  { title: "Podcast", description: "Open a note, then Audio.", icon: Podcast, tone: "sky" },
  { title: "Ask AI", description: "Chat with your material.", icon: MessageCircle, tone: "aqua" },
  { title: "Focus", description: "Pomodoro while you study.", icon: Timer, tone: "sand" },
];

function SourceCard({ icon: Icon, title, description, tone, onClick }: SourceCardProps) {
  return (
    <button className="source-card" onClick={onClick} aria-label={`${title}: ${description}`}>
      <span className={`source-icon ${tone}`}><Icon size={21} strokeWidth={1.9} /></span>
      <span className="source-copy">
        <span className="source-title">{title}<ChevronRight size={15} strokeWidth={1.8} /></span>
        <span className="source-description">{description}</span>
      </span>
    </button>
  );
}

function QuickAction({ icon: Icon, title, description, primary, onClick }: { icon: IconType; title: string; description: string; primary?: boolean; onClick: () => void }) {
  return (
    <button className={`quick-action ${primary ? "primary" : ""}`} onClick={onClick}>
      <Icon size={17} strokeWidth={1.8} />
      <span className="quick-copy"><strong>{title}</strong><small>{description}</small></span>
      <ChevronRight size={17} strokeWidth={1.7} />
    </button>
  );
}

export default function Home() {
  const [activeNav, setActiveNav] = useState("Home");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const announce = (message: string) => toast(message, { duration: 2200 });

  return (
    <div className="app-shell" style={{ backgroundImage: `url(${textureUrl})` }}>
      <div className="browser-strip"><span /></div>
      <div className="workspace">
        <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="brand-row">
            <div className="brand-lockup">
              <img src={markUrl} alt="Darwinity mark" className="brand-mark" />
              <span>Darwinity</span>
            </div>
            <button className="collapse-button" onClick={() => setSidebarOpen(false)} aria-label="Collapse sidebar"><ChevronLeft size={17} /></button>
          </div>
          <nav className="side-nav" aria-label="Primary navigation">
            {navItems.map(({ label, icon: Icon }) => (
              <button key={label} className={`nav-item ${activeNav === label ? "active" : ""}`} onClick={() => { setActiveNav(label); announce(`${label} selected`); }}>
                <Icon size={21} strokeWidth={1.7} />
                <span>{label}</span>
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <button className="upgrade-card" onClick={() => announce("Pro unlock is coming soon") }>
              <span className="upgrade-icon"><Sparkles size={18} /></span>
              <span><strong>Unlock Pro</strong><small>Unlimited notes — no fre...</small></span>
              <ChevronRight size={17} />
            </button>
            <button className="profile-row" onClick={() => announce("Profile menu opened")}>
              <span className="avatar-initials">AV</span><strong>Abhi Vibing</strong>
            </button>
          </div>
        </aside>

        {!sidebarOpen && <button className="sidebar-reopen" onClick={() => setSidebarOpen(true)} aria-label="Open sidebar"><ChevronRight size={17} /></button>}

        <main className="main-content">
          <header className="topbar">
            <button className="mobile-brand" onClick={() => setSidebarOpen(true)} aria-label="Open navigation"><img src={markUrl} alt="" /><strong>Darwinity</strong></button>
            <div className="topbar-actions">
              <button className="time-pill" onClick={() => announce("Focus timer: 25 minutes")}><Clock3 size={17} /> <strong>25m</strong></button>
              <button className="pro-pill" onClick={() => announce("Pro unlock is coming soon")}><Sparkles size={16} /> <strong>Go Pro now</strong></button>
              <button className="account-button" onClick={() => announce("Profile menu opened")} aria-label="Account"><UserRound size={19} /></button>
            </div>
          </header>

          <div className="page-content">
            <section className="hero-row">
              <div>
                <p className="eyebrow">Your learning studio</p>
                <h1>Hey Abhi, what do you wanna master?</h1>
                <p className="hero-subtitle">Feed it once. Unlock the whole toolkit.</p>
              </div>
              <button className="hero-pro-button" onClick={() => announce("Pro unlock is coming soon")}><Sparkles size={17} /> Go Pro now <ChevronRight size={18} /></button>
            </section>

            <section className="source-grid" aria-label="Add a study source">
              <SourceCard icon={Upload} title="Upload" description="PDF, slides, or Word" tone="sage" onClick={() => announce("Upload flow opened")} />
              <SourceCard icon={Link2} title="Paste" description="YouTube link" tone="sage" onClick={() => announce("Paste a YouTube link")} />
              <SourceCard icon={Mic} title="Record" description="Lecture or audio file" tone="sage" onClick={() => announce("Recording flow opened")} />
            </section>

            <section className="trail-section">
              <h2>Your trail</h2>
              <div className="trail-card">
                <div className="trail-main">
                  <div className="trail-intro">
                    <img className="darwin-avatar" src={darwinUrl} alt="Charles Darwin portrait" />
                    <div>
                      <span className="trail-kicker">YOUR TRAIL STARTS EMPTY</span>
                      <h3>Feed once. Unlock the whole toolkit.</h3>
                      <p>One source becomes notes, a mind map, cards, quizzes, podcast, and Ask AI, plus Focus while you work.</p>
                    </div>
                  </div>
                  <div className="steps-row">
                    <div className="step-card"><span>1</span><div><strong>Feed it</strong><small>File, link, or lecture</small></div></div>
                    <div className="step-card"><span>2</span><div><strong>Evolve it</strong><small>Notes + every study mode</small></div></div>
                    <div className="step-card"><span>3</span><div><strong>Remember it</strong><small>Practice until it sticks</small></div></div>
                  </div>
                  <div className="start-with">
                    <span className="section-label">START WITH</span>
                    <div className="quick-actions">
                      <QuickAction icon={Upload} title="Upload" description="PDF, slides, or Word" primary onClick={() => announce("Upload flow opened")} />
                      <QuickAction icon={Link2} title="Paste" description="YouTube link" onClick={() => announce("Paste a YouTube link")} />
                      <QuickAction icon={Mic} title="Record" description="Lecture or audio file" onClick={() => announce("Recording flow opened")} />
                    </div>
                  </div>
                </div>
                <div className="trail-outcomes">
                  <span className="section-label">WHAT YOU UNLOCK</span>
                  <div className="output-grid">
                    {outputs.map(({ title, description, icon: Icon, tone }) => (
                      <button className="output-card" key={title} onClick={() => announce(`${title} mode selected`)}>
                        <span className={`output-icon ${tone}`}><Icon size={16} strokeWidth={1.8} /></span>
                        <span><strong>{title}</strong><small>{description}</small></span>
                      </button>
                    ))}
                  </div>
                  <button className="unlock-button" onClick={() => announce("Upload flow opened")}>Upload something <ChevronRight size={18} /></button>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
      <button className="help-button" onClick={() => announce("Help center opened")} aria-label="Help"><HelpCircle size={20} /></button>
    </div>
  );
}
