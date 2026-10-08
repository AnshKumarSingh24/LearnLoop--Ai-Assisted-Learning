import React from 'react';
import { useLocation } from 'wouter';
import { Clock3, Layers, LayoutGrid, Target, Clock, Coins, PlayCircle, Trophy, Sparkles } from 'lucide-react';

export function StudyQuestDashboard({ course }: { course: any }) {
  const [, setLocation] = useLocation();
  const score = course.mastery?.score || 0;

  const progressPercent = course.mastery?.progress || 0;
  
  return (
    <div className="mb-12 font-sans text-foreground">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Study quest</h2>
        <button className="px-4 py-2 bg-card border border-border rounded-full text-sm font-bold shadow-sm hover:bg-muted transition-colors">
          How it works
        </button>
      </div>

      <div className="bg-card border border-border rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="flex flex-col md:flex-row gap-12">
          {/* Left: Score Circle */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div className="w-40 h-40 rounded-full bg-muted flex flex-col items-center justify-center border-8 border-border relative">
              <span className="text-[10px] font-extrabold text-muted-foreground tracking-widest uppercase mb-1">Score</span>
              <span className="text-5xl font-extrabold leading-none">{score}</span>
              
              {/* Optional: progress ring overlay could go here */}
            </div>
          </div>

          {/* Right: Quest Info */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-xs font-bold mb-3 w-fit">
              <Target size={12} className="text-primary" /> Next: Checkpoint A
            </div>
            
            <h3 className="text-2xl font-extrabold mb-2">Your quest starts when you study</h3>
            <p className="text-muted-foreground font-medium mb-6">Open notes, cards, or a quiz to begin.</p>
            
            {/* Progress bar */}
            <div className="mb-6">
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                <span>0</span>
                <span>4.0 pts</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button 
                onClick={() => {
                  const firstMod = course.modules?.[0];
                  const firstLessonId = firstMod?.lessonIds?.[0] || course.lessons?.[0]?.id;
                  if (firstLessonId) {
                    setLocation(`/courses/${course.id}/learn/${firstLessonId}`);
                  }
                }}
                className="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-xl font-bold flex items-center gap-2 transition-opacity"
              >
                <Clock3 size={18} /> Go study
              </button>
              <button 
                onClick={() => alert("Rewards program coming soon! Keep studying to earn points.")}
                className="px-6 py-3 bg-card border border-border rounded-xl font-bold flex items-center gap-2 hover:bg-muted transition-colors"
              >
                <Coins size={18} /> Rewards
              </button>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 pt-8 border-t border-border">
          <div className="bg-muted rounded-2xl p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
              <BookOpenIcon /> Study time
            </div>
            <span className="text-xl font-extrabold">0.0h</span>
          </div>
          <div className="bg-muted rounded-2xl p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
              <Clock size={14} /> Focus time
            </div>
            <span className="text-xl font-extrabold">0.0h</span>
          </div>
          <div className="bg-muted rounded-2xl p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
              <Layers size={14} /> Cards
            </div>
            <span className="text-xl font-extrabold">0</span>
          </div>
          <div className="bg-muted rounded-2xl p-5 flex flex-col justify-center">
            <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground mb-1">
              <Sparkles size={14} /> Total XP
            </div>
            <span className="text-xl font-extrabold">{course.mastery?.xp || 0}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-border text-sm font-bold text-muted-foreground">
          Earn up to <span className="text-foreground">$4.75</span>
        </div>
      </div>

      {/* Checkpoint Path */}
      <div className="mb-12">
        <div className="flex justify-between items-end mb-6">
          <h3 className="text-xl font-extrabold">Checkpoint path</h3>
          <span className="text-sm font-bold text-muted-foreground">0/4</span>
        </div>
        
        <div className="flex items-center justify-between relative mb-6 overflow-x-auto pb-4 hide-scrollbar">
          {/* Connecting line */}
          <div className="absolute top-1/2 left-10 right-10 h-0.5 bg-border -translate-y-1/2 z-0 hidden md:block" />
          
          {[
            { id: 'A', title: 'Spark', pts: '4 pts', active: true },
            { id: 'B', title: 'Glow', pts: '8 pts', active: false },
            { id: 'C', title: 'Blaze', pts: '14 pts', active: false },
            { id: 'D', title: 'Orbit', pts: '22 pts', active: false },
          ].map((node, i) => (
            <div key={node.id} className={`relative z-10 flex flex-col items-center w-32 shrink-0 ${node.active ? 'bg-card rounded-3xl p-6 border-2 border-primary shadow-md' : 'bg-card rounded-3xl p-6 border border-border'}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-extrabold mb-3 ${node.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                {node.id}
              </div>
              <span className="font-bold text-sm">{node.title}</span>
              <span className="text-xs font-bold text-muted-foreground mt-1">{node.pts}</span>
            </div>
          ))}
        </div>
        
        <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h4 className="font-extrabold text-sm">Checkpoint A · Spark</h4>
            <p className="text-xs text-muted-foreground font-medium mt-1">Need 4 pts <span className="mx-2 opacity-50">|</span> Reward: 10% back</p>
          </div>
          <div className="px-3 py-1 bg-primary/10 text-primary font-bold text-xs rounded-full border border-primary/20">
            In progress
          </div>
        </div>
      </div>

      {/* Last 14 days chart */}
      <div>
        <h3 className="text-xl font-extrabold mb-6">Last 14 days</h3>
        <div className="bg-muted rounded-3xl p-12 flex flex-col items-center justify-center text-center border-dashed border-2 border-border">
          <div className="w-16 h-16 bg-card border border-border rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <LayoutGrid className="text-muted-foreground opacity-50" size={24} />
          </div>
          <h4 className="text-lg font-extrabold mb-2">No study days yet</h4>
          <p className="text-muted-foreground font-medium text-sm max-w-sm">Each study day fills this chart with time and points.</p>
        </div>
      </div>
    </div>
  );
}

function BookOpenIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}
