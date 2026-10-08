import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { trpc } from '@/lib/trpc';
import { X, CheckCircle2, ChevronRight, HelpCircle, BrainCircuit, Loader2, FileText, Award, Sparkles, Flame } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useDarwinity } from '@/contexts/DarwinityStoreContext';
import { initialCourses } from '@/lib/persistence';
import { launchConfetti } from '@/lib/confetti';

function parseBlock(rawBlock: any) {
  if (!rawBlock) return { type: 'explanation', title: 'Study Guide', content: 'No content available.' };
  
  const type = rawBlock.type || 'explanation';
  const rawContent = rawBlock.content || '';

  if (type === 'multiple-choice' || type === 'quiz') {
    let question = rawBlock.question;
    let options = rawBlock.options || rawBlock.metadata?.options;
    let correctIndex = rawBlock.correctIndex ?? rawBlock.metadata?.correctIndex ?? 0;
    let explanation = rawBlock.explanation || rawBlock.metadata?.explanation;

    if (!question || !options || !Array.isArray(options) || options.length === 0) {
      const qMatch = rawContent.match(/Question:\s*([\s\S]*?)(?=Options:|$)/i);
      const oMatch = rawContent.match(/Options:\s*([\s\S]*?)(?=Answer:|$)/i);
      const aMatch = rawContent.match(/Answer:\s*([\s\S]*?)$/i);

      if (qMatch && qMatch[1]) question = qMatch[1].trim();
      else question = rawContent.split('\n')[0] || "Knowledge Check Question";

      if (oMatch && oMatch[1]) {
        const optText = oMatch[1].trim();
        if (optText.includes(',')) {
          options = optText.split(',').map((s: string) => s.trim());
        } else {
          options = optText.split('\n').map((s: string) => s.trim().replace(/^[-*•0-9.]+\s*/, '')).filter(Boolean);
        }
      }

      if (aMatch && aMatch[1] && options && options.length > 0) {
        const ansVal = aMatch[1].trim().toLowerCase();
        const found = options.findIndex((o: string) => o.toLowerCase() === ansVal || ansVal.includes(o.toLowerCase()));
        if (found !== -1) correctIndex = found;
      }
    }

    if (!options || !Array.isArray(options) || options.length < 2) {
      options = [
        "Minimizing signal distortion and optimizing efficiency",
        "Increasing random noise and operational latency",
        "Discarding feedback mechanisms entirely",
        "Suppressing data flow and disabling verification"
      ];
      correctIndex = 0;
    }

    return {
      type: 'quiz',
      question: question || "Select the correct answer to earn +15 XP:",
      options,
      correctIndex,
      explanation: explanation || `Correct answer: ${options[correctIndex]}`
    };
  }

  if (type === 'flashcard') {
    let front = rawBlock.front;
    let back = rawBlock.back;
    if (!front || !back) {
      const fMatch = rawContent.match(/Front:\s*([\s\S]*?)(?=Back:|$)/i);
      const bMatch = rawContent.match(/Back:\s*([\s\S]*?)$/i);
      front = fMatch ? fMatch[1].trim() : rawContent;
      back = bMatch ? bMatch[1].trim() : "Key principle mastered.";
    }
    return {
      type: 'flashcard',
      front: front || "Flashcard Question",
      back: back || "Answer / Key Concept"
    };
  }

  return {
    type: 'explanation',
    title: rawBlock.title || (type === 'example' ? 'Practical Example' : 'PDF Study Guide & Key Concepts'),
    content: rawContent || "Study material."
  };
}

export function LessonView() {
  const params = useParams();
  const [, setLocation] = useLocation();
  
  const courseIdParam = params.courseId;
  const lessonIdParam = params.lessonId;
  
  const isTrpc = !isNaN(Number(courseIdParam)) && courseIdParam ? !courseIdParam.includes('-') : false;
  
  const [blocks, setBlocks] = useState<any[]>([]);
  const [generating, setGenerating] = useState(true);
  const [earnedXp, setEarnedXp] = useState(0);
  const [showXpPop, setShowXpPop] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  const { state: darwinityState, dispatch } = useDarwinity();
  const generateLesson = trpc.study.generateLesson.useMutation();

  useEffect(() => {
    if (!courseIdParam || !lessonIdParam) return;

    const localCourse = darwinityState.courses.find(c => String(c.id) === String(courseIdParam))
      || initialCourses.find(c => String(c.id) === String(courseIdParam));
    const targetLesson = localCourse?.lessons?.find(l => String(l.id) === String(lessonIdParam));

    if (targetLesson?.blocks && targetLesson.blocks.length > 0) {
      setBlocks(targetLesson.blocks);
      setGenerating(false);
      return;
    }

    if (isTrpc) {
      const courseIdNum = Number(courseIdParam);
      generateLesson.mutateAsync({ courseId: courseIdNum, lessonId: Number(lessonIdParam) })
        .then(res => {
          if (res.success && res.blocks) setBlocks(res.blocks);
          else if (targetLesson?.blocks) setBlocks(targetLesson.blocks);
          setGenerating(false);
        })
        .catch(err => {
          console.error(err);
          if (targetLesson?.blocks) setBlocks(targetLesson.blocks);
          setGenerating(false);
        });
    } else {
      const CAPTURE_API_URL = import.meta.env.VITE_CAPTURE_API_URL || "http://localhost:8080";
      fetch(`${CAPTURE_API_URL}/study/lesson/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: courseIdParam,
          lesson_id: lessonIdParam
        })
      })
      .then(res => {
        if (!res.ok) throw new Error("API response not ok");
        return res.json();
      })
      .then(data => {
        if (data.blocks && data.blocks.length > 0) setBlocks(data.blocks);
        else if (targetLesson?.blocks) setBlocks(targetLesson.blocks);
        setGenerating(false);
      })
      .catch(err => {
        console.error("Gemini fetch fallback:", err);
        if (targetLesson?.blocks) setBlocks(targetLesson.blocks);
        setGenerating(false);
      });
    }
  }, [courseIdParam, lessonIdParam]);
  
  const [currentBlockIdx, setCurrentBlockIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const markLessonComplete = trpc.study.markLessonComplete.useMutation();

  if (generating) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-emerald-500 mb-4" size={48} />
        <h2 className="text-xl font-bold text-gray-800">Generating Personalized Lesson...</h2>
        <p className="text-gray-500 mt-2">AI is processing source materials and generating study PDF content & MCQs.</p>
      </div>
    );
  }

  if (blocks.length === 0) {
    return (
      <div className="p-10 text-center text-gray-500 font-medium mt-10">
        <p>This lesson content is being created.</p>
        <Button onClick={() => setLocation(`/courses/${courseIdParam}`)} className="mt-4">Back to Course</Button>
      </div>
    );
  }

  const rawBlock = blocks[currentBlockIdx];
  const activeBlock = parseBlock(rawBlock);
  const isLastBlock = currentBlockIdx === blocks.length - 1;

  const handleNext = () => {
    if (isLastBlock) {
      if (isTrpc) {
        markLessonComplete.mutateAsync({
          courseId: Number(courseIdParam),
          lessonId: Number(lessonIdParam),
          score: 100
        }).finally(() => {
          setLocation(`/courses/${courseIdParam}`);
        });
      } else {
        const course = darwinityState.courses.find(c => String(c.id) === String(courseIdParam));
        if (course) {
          const completedLessonId = lessonIdParam || "";
          const completedLessonIds = course.mastery?.completedLessonIds || [];
          const alreadyCompleted = completedLessonIds.includes(completedLessonId);
          const nextCompletedIds = alreadyCompleted ? completedLessonIds : [...completedLessonIds, completedLessonId];
          const nextCompletedLessons = nextCompletedIds.length;
          const progress = Math.round((nextCompletedLessons / Math.max(course.lessons.length, 1)) * 100);
          dispatch({
            type: "UPDATE_COURSE",
            id: course.id,
            patch: {
              mastery: {
                ...course.mastery,
                completedLessonIds: nextCompletedIds,
                completedLessons: nextCompletedLessons,
                progress,
                score: (course.mastery?.score || 0) + (alreadyCompleted ? 0 : 10),
                xp: (course.mastery?.xp || 0) + (alreadyCompleted ? 0 : earnedXp)
              },
              completedLessons: nextCompletedLessons,
              progress,
              currentLessonId: course.lessons.find(lesson => !nextCompletedIds.includes(lesson.id))?.id || course.currentLessonId
            }
          });
          if (!alreadyCompleted) {
            try {
              const key = "learnloop-study-sessions";
              const sessions = JSON.parse(localStorage.getItem(key) || "[]");
              sessions.push({ date: new Date().toISOString(), courseId: course.id, courseTitle: course.title, xp: earnedXp + 10, minutes: course.lessons.find(lesson => lesson.id === completedLessonId)?.estimatedMinutes || 10 });
              localStorage.setItem(key, JSON.stringify(sessions.slice(-500)));
            } catch { /* Course progress is still retained if analytics storage is unavailable. */ }
          }
        }
        setLocation(`/courses/${courseIdParam}`);
      }
    } else {
      setCurrentBlockIdx(i => i + 1);
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setShowXpPop(false);
      setIsFlipped(false);
    }
  };

  const handleOptionSelect = (idx: number) => {
    if (isAnswerRevealed) return;
    setSelectedOption(idx);
    setIsAnswerRevealed(true);

    if (idx === activeBlock.correctIndex) {
      setEarnedXp(prev => prev + 15);
      setShowXpPop(true);
      launchConfetti();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 font-sans">
      {/* Topbar HUD */}
      <header className="h-16 border-b border-slate-200 bg-white flex items-center px-6 justify-between shrink-0 shadow-sm">
        <button 
          onClick={() => setLocation(`/courses/${courseIdParam}`)}
          className="w-10 h-10 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition"
        >
          <X size={20} />
        </button>
        
        <div className="flex-1 max-w-xl mx-8 flex items-center gap-4">
          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentBlockIdx + 1) / blocks.length) * 100}%` }}
            />
          </div>
          <span className="text-xs font-bold text-slate-500">{currentBlockIdx + 1} / {blocks.length}</span>
        </div>

        <div className="flex items-center gap-3">
          {earnedXp > 0 && (
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full text-amber-700 font-extrabold text-sm animate-bounce">
              <Flame size={16} className="text-amber-500 fill-amber-500" />
              <span>+{earnedXp} XP</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-slate-500 text-sm font-semibold">
            <FileText size={18} className="text-emerald-600" />
            <span>PDF Study Guide</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto flex justify-center py-8 px-4">
        <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-lg p-8 md:p-12 relative min-h-[70vh]">
          
          {/* XP Celebration Floating Pop */}
          {showXpPop && (
            <div className="absolute top-6 right-6 bg-gradient-to-r from-amber-400 to-amber-500 text-white font-black px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 animate-in fade-in zoom-in duration-300">
              <Sparkles size={20} />
              <span>+15 XP AWARDED!</span>
            </div>
          )}

          {/* Document Header badge */}
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-8">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              PDF
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {activeBlock.type === 'quiz' ? 'Interactive MCQ Test' : (activeBlock.type === 'flashcard' ? 'Active Recall Flashcard' : 'Lesson Study Material')}
            </div>
          </div>
          
          {activeBlock.type === 'explanation' && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-6 leading-tight">
                {activeBlock.title}
              </h2>
              <div className="prose prose-slate max-w-none text-lg text-slate-800 leading-relaxed font-normal space-y-4">
                {activeBlock.content?.split('\n\n').map((paragraph: string, pIdx: number) => (
                  <p key={pIdx}>{paragraph}</p>
                ))}
              </div>
            </div>
          )}

          {activeBlock.type === 'flashcard' && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-400 flex flex-col items-center justify-center py-8">
              <span className="text-xs font-extrabold text-indigo-600 uppercase tracking-widest mb-4">Click Card to Flip</span>
              <div 
                onClick={() => setIsFlipped(!isFlipped)}
                className="w-full max-w-xl h-64 border-2 border-indigo-200 rounded-3xl p-8 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 shadow-md cursor-pointer flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02]"
              >
                <div className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-2">
                  {isFlipped ? 'Answer / Concept' : 'Flashcard Question'}
                </div>
                <div className="text-xl font-bold text-slate-900 leading-relaxed">
                  {isFlipped ? activeBlock.back : activeBlock.front}
                </div>
              </div>
            </div>
          )}

          {activeBlock.type === 'quiz' && (
            <div className="animate-in fade-in slide-in-from-bottom-3 duration-400">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-inner">
                  <BrainCircuit size={24} />
                </div>
                <div>
                  <span className="text-xs font-extrabold text-purple-700 uppercase tracking-widest block">Level Test</span>
                  <span className="text-slate-500 text-sm">Select the correct answer to earn +15 XP</span>
                </div>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-8 leading-snug">{activeBlock.question}</h2>
              
              <div className="space-y-3.5">
                {activeBlock.options.map((opt: string, idx: number) => {
                  const isCorrect = idx === activeBlock.correctIndex;
                  const isSelected = selectedOption === idx;
                  
                  let optClass = "border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 text-slate-800";
                  if (isAnswerRevealed) {
                    if (isCorrect) optClass = "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm";
                    else if (isSelected && !isCorrect) optClass = "border-rose-500 bg-rose-50 text-rose-900";
                    else optClass = "border-slate-200 opacity-50 text-slate-500";
                  } else if (isSelected) {
                    optClass = "border-purple-500 bg-purple-50 text-purple-900";
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswerRevealed}
                      onClick={() => handleOptionSelect(idx)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base flex items-center justify-between ${optClass}`}
                    >
                      <span>{opt}</span>
                      {isAnswerRevealed && isCorrect && <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />}
                      {isAnswerRevealed && isSelected && !isCorrect && <X size={20} className="text-rose-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {isAnswerRevealed && (
                <div className="mt-8 p-5 rounded-2xl bg-blue-50/80 border border-blue-200/60 animate-in fade-in duration-300">
                  <p className="font-extrabold text-blue-900 mb-1 flex items-center gap-1.5">
                    <Sparkles size={16} className="text-blue-600" /> Explanation
                  </p>
                  <p className="text-blue-800 text-sm leading-relaxed">
                    {activeBlock.explanation}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Footer Navigation Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-5 border-t transition-colors duration-300 shadow-lg ${
        isAnswerRevealed && selectedOption === activeBlock.correctIndex ? 'bg-emerald-50 border-emerald-200' : 
        isAnswerRevealed ? 'bg-rose-50 border-rose-200' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            {isAnswerRevealed && selectedOption === activeBlock.correctIndex && (
              <div className="flex items-center gap-3 text-emerald-800">
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-sm">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="font-extrabold text-xl">Correct Answer!</div>
                  <div className="text-xs font-semibold text-emerald-600">+15 XP earned</div>
                </div>
              </div>
            )}
            {isAnswerRevealed && selectedOption !== activeBlock.correctIndex && (
              <div className="flex items-center gap-3 text-rose-800">
                <div className="w-10 h-10 bg-rose-500 rounded-full flex items-center justify-center text-white shadow-sm">
                  <X size={24} />
                </div>
                <div>
                  <div className="font-extrabold text-xl">Not quite right</div>
                  <div className="text-xs font-semibold text-rose-600">Review key concept</div>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            size="lg" 
            onClick={handleNext}
            disabled={activeBlock.type === 'quiz' && !isAnswerRevealed}
            className={`px-10 py-6 text-lg rounded-xl font-bold shadow-md transition-all ${
              isAnswerRevealed && selectedOption === activeBlock.correctIndex ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 
              isAnswerRevealed ? 'bg-slate-900 hover:bg-slate-800 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {isLastBlock ? 'Complete Lesson' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}
