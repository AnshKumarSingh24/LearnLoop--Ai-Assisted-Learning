import React from 'react';
import { useRoute, useLocation } from 'wouter';
import { trpc } from '@/lib/trpc';
import { BookOpen, PlayCircle, Trophy, Brain, ChevronRight, Sparkles, Target, Clock3, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { StudyQuestDashboard } from '../components/courses/StudyQuestDashboard';
import { useDarwinity } from '@/contexts/DarwinityStoreContext';
import { useCompanion } from '@/contexts/CompanionContext';
import { initialCourses } from '@/lib/persistence';
import { generate10LevelCourse } from '@/lib/courseGenerator';

export function CourseView() {
  const [, params] = useRoute('/courses/:courseId');
  const [, setLocation] = useLocation();
  const { state: darwinityState, dispatch } = useDarwinity();
  const companion = useCompanion();
  
  const courseIdParam = params?.courseId;
  const courseIdNum = Number(courseIdParam);
  const isTrpc = !isNaN(courseIdNum) && courseIdParam ? !courseIdParam.includes('-') : false;

  const { data: trpcCourse, isLoading, error, isError } = trpc.curriculum.get.useQuery(
    { courseId: courseIdNum }, 
    { enabled: isTrpc }
  );

  let darwinityCourse = darwinityState.courses.find(c => String(c.id) === String(courseIdParam))
    || initialCourses.find(c => String(c.id) === String(courseIdParam));

  if (!darwinityCourse && courseIdParam) {
    const titleFromId = courseIdParam.replace(/^(course|mod|les)-/i, '').replace(/[-_]/g, ' ');
    darwinityCourse = generate10LevelCourse(titleFromId, "intermediate");
    dispatch({ type: "CREATE_COURSE", course: darwinityCourse });
  }

  if (darwinityCourse && !(darwinityCourse as any).mastery) {
    (darwinityCourse as any).mastery = {
      completedLessonIds: [],
      completedLessons: 0,
      progress: darwinityCourse.progress || 0,
    };
  }

  const course = isTrpc ? (trpcCourse || darwinityCourse) : darwinityCourse;

  if (isTrpc && isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-[80vh]">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading your AI course...</p>
      </div>
    );
  }

  if (!course) {
    console.error("Course Not Found. courseId:", courseIdParam, "isError:", isError, "error:", error);
    return (
      <div className="flex-1 flex items-center justify-center h-[80vh] text-foreground">
        <div className="text-center p-8 bg-card rounded-xl border border-border shadow-sm">
          <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
          <p className="text-muted-foreground mb-4">The course you are looking for does not exist or has been deleted.</p>
          {isError && <p className="text-destructive mb-4 text-sm">{error?.message}</p>}
          <Button onClick={() => setLocation('/')} className="bg-primary hover:opacity-90 text-primary-foreground font-bold">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (course && course.modules && course.lessons && !course.modules[0]?.lessons) {
    course.modules.forEach((mod: any) => {
      if (mod.lessonIds) {
        mod.lessons = mod.lessonIds.map((id: string) => course.lessons.find((l: any) => l.id === id)).filter(Boolean);
      }
    });
  }

  // Flatten lessons from modules to build the path
  const allLessons = course?.lessons || (course?.modules || []).flatMap((m: any) => m.lessons || []);
  const totalLessons = allLessons.length;
  const completedLessonIds = course.mastery?.completedLessonIds ?? [];
  const completedLessons = course.mastery?.completedLessons ?? completedLessonIds.length;
  const progress = course.mastery?.progress ?? (totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100));

  const mockLessons = allLessons.map((l: any, i: number) => ({
    id: l.id,
    title: l.title,
    completed: completedLessonIds.includes(l.id),
    current: !completedLessonIds.includes(l.id) && i === completedLessons,
    locked: !completedLessonIds.includes(l.id) && i > completedLessons,
  }));

  return (
    <div className="max-w-5xl mx-auto py-10 px-6 font-sans min-h-screen">
      <StudyQuestDashboard course={course} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Lesson Path grouped by module */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Target size={20} className="text-[#123d2d]" />
            Learning Path
          </h2>
          
          {(course.modules || []).length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Brain size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">Course structure is being generated...</p>
              <p className="text-sm mt-1">This may take a moment after course creation.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {(course.modules || []).map((mod: any, modIdx: number) => (
                <div key={mod.id} className="relative">
                  {/* Module header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-black">
                      {modIdx + 1}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600">Module {modIdx + 1}</p>
                      <h3 className="font-bold text-gray-800 text-lg">{mod.title}</h3>
                    </div>
                  </div>

                  {/* Lessons in this module */}
                  <div className="relative flex flex-col items-center">
                    <div className="absolute top-0 bottom-0 w-full pointer-events-none flex justify-center">
                      <svg width="200" height="100%" className="overflow-visible stroke-gray-200">
                        <path d="M100,0 L100,9999" strokeWidth="8" fill="none" strokeDasharray="8,8" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="space-y-8 relative z-10 w-full max-w-sm mx-auto">
                      {(mod.lessons || []).map((lesson: any, lesIdx: number) => {
                        const globalIdx = allLessons.findIndex((l: any) => l.id === lesson.id);
                        const isCompleted = completedLessonIds.includes(lesson.id);
                        const isCurrent = !isCompleted && globalIdx === completedLessons;
                        const isLocked = !isCompleted && globalIdx > completedLessons;
                        const offset = Math.sin(lesIdx * 1.5) * 36;

                        return (
                          <div
                            key={lesson.id}
                            className="flex justify-center"
                            style={{ transform: `translateX(${offset}px)` }}
                          >
                            <div
                              onClick={() => !isLocked && setLocation(`/courses/${course.id}/learn/${lesson.id}`)}
                              className={`relative group flex flex-col items-center ${isLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:-translate-y-1 transition-transform'}`}
                            >
                              {/* Tooltip */}
                              <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-white px-3 py-1.5 rounded-xl border shadow-lg whitespace-nowrap z-20 font-bold text-sm text-gray-800 pointer-events-none">
                                {lesson.title}
                                <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r transform rotate-45" />
                              </div>

                              {/* Node */}
                              <div className={`w-20 h-20 rounded-full border-b-8 shadow-md flex items-center justify-center text-2xl relative z-10 transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-emerald-400 border-emerald-600 text-white'
                                  : isCurrent
                                    ? 'bg-amber-400 border-amber-600 text-white ring-4 ring-amber-100 ring-offset-2 scale-110'
                                    : 'bg-gray-200 border-gray-300 text-gray-400'
                              }`}>
                                {isCompleted ? <Trophy size={30} /> : isCurrent ? <Sparkles size={30} /> : <Target size={28} />}
                              </div>
                              <span className="mt-2 text-xs font-semibold text-gray-500 max-w-[80px] text-center leading-tight">{lesson.title?.split(':')[0]}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Module separator */}
                  {modIdx < (course.modules || []).length - 1 && (
                    <div className="mt-8 flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium px-2">Next Module</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Right: Course Info */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          
          <div className="space-y-3">
            <button onClick={() => setLocation(`/learn?courseId=${course.id}`)} className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#123d2d] hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Brain size={20} className="text-purple-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Quiz Me</h3>
                <p className="text-xs text-gray-500">AI-generated questions</p>
              </div>
            </button>
            
            <button onClick={() => companion.open()} className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#123d2d] hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <Sparkles size={20} className="text-blue-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">Study with AI</h3>
                <p className="text-xs text-gray-500">Companion-guided review</p>
              </div>
            </button>
            
            <button onClick={() => setLocation(course.sourceIds?.length ? `/spaces/${course.sourceIds[0]}` : '/artifacts')} className="w-full flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-[#123d2d] hover:shadow-md transition-all text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
                <BookOpen size={20} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-gray-800">View Sources</h3>
                <p className="text-xs text-gray-500">Original study material</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
