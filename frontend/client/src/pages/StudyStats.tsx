import { useCompanion } from "@/contexts/CompanionContext";
import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { Brain, TrendingUp, Clock, Target, Award, Flame, BookOpen, CheckCircle2 } from "lucide-react";

type StudySession = { date: string; courseId: string; courseTitle: string; xp: number; minutes: number };
const SESSION_KEY = "learnloop-study-sessions";
const readSessions = (): StudySession[] => { try { const sessions = JSON.parse(localStorage.getItem(SESSION_KEY) || "[]"); return Array.isArray(sessions) ? sessions.filter(item => item?.date) : []; } catch { return []; } };

export default function StudyStats() {
  const { setContext } = useCompanion();
  const { state } = useDarwinity();
  const [, setLocation] = useLocation();
  useEffect(() => { setContext({ workspace: "Study Stats" }); }, [setContext]);

  const data = useMemo(() => {
    const sessions = readSessions(), courses = state.courses || [];
    const totalLessons = courses.reduce((sum, course) => sum + (course.mastery?.completedLessonIds?.length || 0), 0);
    const totalAvailable = courses.reduce((sum, course) => sum + course.lessons.length, 0);
    const totalXp = courses.reduce((sum, course) => sum + (course.mastery?.xp || 0), 0);
    const totalMinutes = sessions.reduce((sum, session) => sum + (Number(session.minutes) || 0), 0);
    const today = new Date();
    const daily = Array.from({ length: 7 }, (_, index) => { const date = new Date(today); date.setDate(today.getDate() - (6 - index)); const key = date.toDateString(); return { label: date.toLocaleDateString(undefined, { weekday: "short" }), minutes: sessions.filter(session => new Date(session.date).toDateString() === key).reduce((sum, session) => sum + (session.minutes || 0), 0) }; });
    let streak = 0;
    for (let offset = 0; offset < 365; offset++) { const date = new Date(today); date.setDate(today.getDate() - offset); if (sessions.some(session => new Date(session.date).toDateString() === date.toDateString())) streak++; else if (offset > 0) break; }
    return { courses, totalLessons, totalXp, mastery: totalAvailable ? Math.round(totalLessons / totalAvailable * 100) : 0, totalMinutes, daily, streak };
  }, [state.courses]);

  const maxMinutes = Math.max(...data.daily.map(day => day.minutes), 1);
  const badges = [
    { name: "First step", ready: data.totalLessons >= 1, detail: "Complete your first lesson" },
    { name: "On a roll", ready: data.streak >= 3, detail: "Study for 3 consecutive days" },
    { name: "Focused learner", ready: data.totalMinutes >= 60, detail: "Reach one hour of study time" },
    { name: "Course finisher", ready: data.courses.some(course => course.lessons.length > 0 && course.mastery?.completedLessonIds?.length === course.lessons.length), detail: "Finish a course" },
  ];
  const nextCourse = data.courses.find(course => (course.mastery?.completedLessonIds?.length || 0) < course.lessons.length);

  return <div className="max-w-[1100px] mx-auto py-10 px-6">
    <div className="mb-10"><h1 className="text-4xl font-extrabold tracking-tight mb-2">Mastery & badges</h1><p className="text-gray-500">Live progress from completed lessons and study sessions.</p></div>
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"><Metric icon={<Target size={22} />} label="Average mastery" value={`${data.mastery}%`} tone="green" /><Metric icon={<Flame size={22} />} label="Day streak" value={`${data.streak}`} tone="orange" /><Metric icon={<Clock size={22} />} label="Time studied" value={`${Math.floor(data.totalMinutes / 60)}h ${data.totalMinutes % 60}m`} tone="purple" /><Metric icon={<Brain size={22} />} label="Lessons done" value={`${data.totalLessons}`} tone="blue" /></div>
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8"><section className="lg:col-span-3 p-7 rounded-3xl bg-white border border-gray-200 shadow-sm"><div className="flex justify-between items-center mb-7"><div><h2 className="text-xl font-extrabold">Study activity</h2><p className="text-sm text-gray-500">Minutes studied over the last 7 days</p></div><TrendingUp className="text-emerald-600" /></div><div className="h-52 flex items-end gap-3 border-b border-gray-100 pb-2">{data.daily.map(day => <div key={day.label} className="flex-1 h-full flex flex-col justify-end items-center gap-2"><span className="text-xs font-bold text-gray-500">{day.minutes ? `${day.minutes}m` : ""}</span><div className="w-full max-w-10 rounded-t-xl bg-emerald-500 transition-all" style={{ height: `${Math.max(day.minutes ? 12 : 3, Math.round(day.minutes / maxMinutes * 100))}%` }} /><span className="text-xs font-bold text-gray-500">{day.label}</span></div>)}</div></section>
    <section className="lg:col-span-2 p-7 rounded-3xl bg-white border border-gray-200 shadow-sm"><h2 className="text-xl font-extrabold mb-5">Badges</h2><div className="space-y-3">{badges.map(badge => <div key={badge.name} className={`flex items-center gap-3 p-3 rounded-2xl ${badge.ready ? "bg-emerald-50" : "bg-gray-50"}`}><div className={`p-2 rounded-xl ${badge.ready ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-500"}`}><Award size={18} /></div><div><p className="font-bold text-sm">{badge.name}</p><p className="text-xs text-gray-500">{badge.ready ? "Earned" : badge.detail}</p></div>{badge.ready && <CheckCircle2 size={16} className="ml-auto text-emerald-600" />}</div>)}</div></section></div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8"><section className="p-7 rounded-3xl bg-white border border-gray-200 shadow-sm"><h2 className="text-xl font-extrabold mb-5">Mastery by course</h2>{data.courses.length ? <div className="space-y-5">{data.courses.map(course => { const completed = course.mastery?.completedLessonIds?.length || 0; const percent = course.lessons.length ? Math.round(completed / course.lessons.length * 100) : 0; return <button key={course.id} onClick={() => setLocation(`/courses/${course.id}`)} className="w-full text-left"><div className="flex justify-between text-sm font-bold mb-2"><span className="truncate pr-3">{course.title}</span><span className="text-emerald-600">{percent}%</span></div><div className="h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} /></div><p className="text-xs text-gray-500 mt-1">{completed} of {course.lessons.length} lessons complete</p></button>; })}</div> : <p className="text-sm text-gray-500 py-8">No course activity yet. Progress will appear here as you learn.</p>}</section><section className="p-7 rounded-3xl bg-[#123d2d] text-white"><BookOpen className="text-emerald-200 mb-5" /><h2 className="text-xl font-extrabold mb-2">Next up</h2>{nextCourse ? <><p className="text-emerald-100 mb-5">Continue {nextCourse.title} to build your streak and unlock your next badge.</p><button onClick={() => setLocation(`/courses/${nextCourse.id}`)} className="px-4 py-2.5 bg-white text-[#123d2d] rounded-xl font-bold">Continue learning</button></> : <p className="text-emerald-100">Create a course and complete a lesson to start tracking mastery here.</p>}</section></div>
  </div>;
}

function Metric({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) { const tones: Record<string, string> = { green: "bg-green-50 text-green-700", orange: "bg-orange-50 text-orange-700", purple: "bg-purple-50 text-purple-700", blue: "bg-blue-50 text-blue-700" }; return <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-sm"><div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tones[tone]}`}>{icon}</div><p className="text-2xl font-extrabold text-gray-900">{value}</p><p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{label}</p></div>; }
