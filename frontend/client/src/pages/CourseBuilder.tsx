import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, LayoutTemplate, MoreHorizontal, ArrowRight, Eye, Send, 
  CheckCircle2, Circle, PlayCircle, Plus, Sparkles, MessageSquare, 
  Settings2, FileText, BrainCircuit, Lightbulb, PenTool, LayoutList, Loader2,
  CheckCircle2 as CheckCircleIcon, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useLocation, useRoute } from 'wouter';
import { useCompanion } from '@/contexts/CompanionContext';
import { trpc } from '@/lib/trpc';
import { CurriculumCanvas } from '../components/course/CurriculumCanvas';
import { AssessmentReview } from '../components/course/AssessmentReview';

export function CourseBuilder() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/course-builder/:courseId');
  const courseId = Number(params?.courseId);
  
  const { setContext } = useCompanion();
  
  const { data: course, isLoading, refetch } = trpc.curriculum.get.useQuery({ courseId }, { enabled: !!courseId });
  const generateAST = trpc.curriculum.generateAST.useMutation({
    onSuccess: () => refetch()
  });
  const updateLO = trpc.curriculum.updateLO.useMutation({
    onSuccess: () => refetch()
  });
  const regenerateAssessments = trpc.curriculum.regenerateLOAssessments.useMutation({
    onSuccess: () => refetch()
  });
  const importToCanvas = trpc.curriculum.importToCanvas.useMutation({
    onSuccess: () => {
      alert("Successfully imported to canvas!");
    }
  });
  const exportSCORM = trpc.curriculum.exportSCORM.useMutation({
    onSuccess: (data) => {
      if (data.success && data.downloadUrl) {
        window.open(data.downloadUrl, '_blank');
      } else {
        alert("Failed to export SCORM: " + data.error);
      }
    }
  });

  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [saveState, setSaveState] = useState<'Saved locally' | 'Saving...' | 'Unsaved changes'>('Saved locally');
  const [centerTab, setCenterTab] = useState<'editor' | 'graph' | 'assessments'>('editor');

  useEffect(() => {
    if (course && !selectedLessonId && (course.modules as any[])?.[0]?.lessons?.[0]) {
      setSelectedLessonId((course.modules as any[])[0].lessons[0].id);
    }
  }, [course, selectedLessonId]);

  useEffect(() => {
    if (course && selectedLessonId) {
      let lessonTitle = "Outline";
      let lessonStatus = course.status;
      for (const m of (course.modules as any[]) || []) {
        const l = m.lessons?.find((x: any) => x.id === selectedLessonId);
        if (l) { lessonTitle = l.title; lessonStatus = l.status; break; }
      }
      setContext({ 
        workspace: 'Course Builder', 
        course: course.title,
        selection: lessonTitle
      });
    }
  }, [course, selectedLessonId, setContext]);

  if (isLoading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-[#123d2d]" size={32} /></div>;
  if (!course) return <div className="p-10 text-center">Course not found.</div>;

  let selectedLesson: any = null;
  let selectedModule: any = null;
  if (selectedLessonId) {
    for (const m of (course.modules as any[]) || []) {
      const l = m.lessons?.find((x: any) => x.id === selectedLessonId);
      if (l) { selectedLesson = l; selectedModule = m; break; }
    }
  }

  // Parse AST if available
  const ast = course.astJson ? JSON.parse(course.astJson) : null;
  const readiness = ast ? 100 : (course.status === 'generating' ? 50 : 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 size={14} className="text-green-600" />;
      case 'needs-review': return <AlertIcon />;
      case 'ready': return <CheckCircle2 size={14} className="text-[#123d2d]" />;
      default: return <Circle size={14} className="text-gray-300" />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9fbfa] text-gray-900 overflow-hidden font-sans">
      {/* Topbar */}
      <header className="h-14 border-b border-[#e1e8e2] bg-white flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setLocation('/dashboard')}
            className="text-gray-500 hover:text-gray-900 transition flex items-center gap-1"
          >
            <ChevronLeft size={16} />
            <span className="text-sm font-medium">Spaces / Biology Revision</span>
          </button>
          <div className="w-px h-4 bg-gray-200"></div>
          <h1 className="text-sm font-bold truncate max-w-[200px]">{course.title}</h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-medium text-gray-400">
            {saveState === 'Saving...' ? 'Saving...' : `v${course.version || 1} • ${saveState}`}
          </span>
          <Button variant="outline" size="sm" className="h-8 text-xs font-bold gap-2">
            <Eye size={14} /> Preview
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-bold gap-2"
            onClick={() => {
              const canvasId = prompt("Enter Target Canvas ID:");
              if (canvasId && !isNaN(Number(canvasId))) {
                importToCanvas.mutate({ courseId: course.id, canvasId: Number(canvasId) });
              }
            }}
            disabled={importToCanvas.isPending}
          >
            <LayoutTemplate size={14} /> {importToCanvas.isPending ? 'Sending...' : 'Send to Canvas'}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 text-xs font-bold gap-2"
            onClick={() => exportSCORM.mutate({ courseId: course.id })}
            disabled={exportSCORM.isPending || readiness < 100}
          >
            <Send size={14} /> {exportSCORM.isPending ? 'Exporting...' : 'Export SCORM'}
          </Button>
          <Button size="sm" className="h-8 text-xs font-bold bg-[#123d2d] hover:bg-[#0d2a1f] text-white" disabled={readiness < 100}>
            Publish
          </Button>
          <button className="text-gray-400 hover:text-gray-900">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </header>

      {/* Main Content - 3 Columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Outline */}
        <div className="w-[300px] border-r border-[#e1e8e2] bg-[#fdfdfd] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#e1e8e2]">
            <h2 className="font-extrabold text-sm mb-1">{course.title}</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
              <span>{readiness}% ready</span>
              <span>•</span>
              <span>{(course.modules as any[])?.length || 0} modules</span>
              <span>•</span>
              <span>{(course.modules as any[])?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} lessons</span>
            </div>
            
            {/* Course Readiness Panel */}
            <div className="mt-4 p-3 bg-white border border-[#e1e8e2] rounded-xl shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#123d2d]">Course Readiness</span>
                <span className="text-xs font-bold text-[#123d2d]">{readiness}%</span>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full mb-3">
                <div className="h-full bg-[#123d2d] rounded-full" style={{ width: `${readiness}%` }}></div>
              </div>
              <ul className="space-y-1.5 text-xs font-medium text-gray-600">
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-600" /> Course goal defined</li>
                <li className="flex gap-2"><CheckCircle2 size={14} className="text-green-600" /> Sources connected</li>
                <li className="flex gap-2"><AlertIcon /> 2 lessons need review</li>
                <li className="flex gap-2"><AlertIcon /> Final assessment missing</li>
              </ul>
              <button className="mt-3 w-full py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-xs font-bold text-gray-700 transition">
                Improve Course
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
            {(course.modules as any[])?.map((module: any) => (
              <div key={module.id} className="mb-4">
                <div className="flex items-center justify-between group mb-2 px-1">
                  <h3 className="text-xs font-extrabold uppercase tracking-widest text-gray-500">
                    {module.title}
                  </h3>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-900">
                    <MoreHorizontal size={14} />
                  </button>
                </div>
                
                <div className="space-y-0.5">
                  {module.lessons?.map((l: any) => {
                    const isSelected = selectedLessonId === l.id;
                    return (
                      <div 
                        key={l.id}
                        onClick={() => setSelectedLessonId(l.id)}
                        className={`group flex items-center justify-between px-2 py-1.5 rounded-lg text-sm cursor-pointer transition-colors ${
                          isSelected ? 'bg-[#e9f1e8] text-[#123d2d] font-bold' : 'text-gray-700 hover:bg-gray-100 font-medium'
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          {getStatusIcon(l.status)}
                          <span className="truncate">{l.title}</span>
                        </div>
                        {l.status === 'needs-review' && !isSelected && (
                          <span className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Review</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            <button className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 mt-4 px-3 py-2 w-full transition">
              <Plus size={16} /> Add Module
            </button>
          </div>
        </div>

        {/* Center Column: Editor / Graph / Assessments */}
        <div className="flex-1 overflow-hidden bg-white flex flex-col custom-scrollbar">
          {/* Center Tabs */}
          <div className="flex border-b border-[#e1e8e2] bg-gray-50 px-4 shrink-0">
            {[
              { id: 'editor', label: 'Editor', icon: <PenTool size={14} /> },
              { id: 'graph', label: 'Graph', icon: <LayoutTemplate size={14} /> },
              { id: 'assessments', label: 'Assessments', icon: <BrainCircuit size={14} /> }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setCenterTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition rounded-t-lg -mb-px border-b-2 ${
                  centerTab === tab.id
                    ? 'text-[#123d2d] border-[#123d2d] bg-white'
                    : 'text-gray-500 hover:text-gray-900 border-transparent'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            {centerTab === 'editor' && (
              <div className="w-full max-w-[720px] p-8 pb-32 mx-auto">
            {selectedLesson ? (
              <>
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`text-[10px] uppercase font-extrabold tracking-widest px-2 py-1 rounded-full ${
                      (selectedLesson.status || 'draft') === 'needs-review' ? 'bg-amber-100 text-amber-800' :
                      (selectedLesson.status || 'draft') === 'complete' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {(selectedLesson.status || 'draft').replace('-', ' ')}
                    </span>
                    <span className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <PlayCircle size={12} /> {selectedLesson.estimatedMinutes} minutes
                    </span>
                    <span className="text-xs font-medium text-gray-500 capitalize">
                      • {selectedLesson.difficulty}
                    </span>
                  </div>
                  
                  <h1 className="text-3xl font-extrabold text-gray-900 mb-4 tracking-tight outline-none" contentEditable suppressContentEditableWarning>
                    {selectedLesson.title}
                  </h1>
                </div>

                <div className="space-y-6">
                  {selectedLesson.learningObjectives?.map((lo: any, idx: number) => (
                    <div key={lo.id} className="bg-[#fcf0e9] border border-[#f5dbcc] rounded-xl p-4 mb-4 group relative">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#d97746]">
                          Learning Objective {idx + 1}
                        </h4>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => regenerateAssessments.mutate({ loId: lo.id })}
                            disabled={regenerateAssessments.isPending}
                            className="text-[10px] uppercase font-bold text-[#d97746] hover:bg-[#f5dbcc] px-2 py-1 rounded"
                          >
                            {regenerateAssessments.isPending ? 'Regenerating...' : 'Regenerate Assessments'}
                          </button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <p 
                          className="text-sm font-medium text-[#8c4623] outline-none focus:bg-white/50 focus:ring-2 focus:ring-[#f5dbcc] rounded p-1 transition-colors" 
                          contentEditable 
                          suppressContentEditableWarning
                          onBlur={(e) => {
                            const newText = e.currentTarget.textContent;
                            if (newText && newText !== lo.text) {
                              updateLO.mutate({ loId: lo.id, text: newText });
                            }
                          }}
                        >
                          {lo.text}
                        </p>
                      </div>
                      
                      <div className="flex gap-2 mt-3 mb-2">
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/50 border border-[#f5dbcc] px-2 py-0.5 rounded">
                          Verb: {lo.bloomVerb}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-gray-500 bg-white/50 border border-[#f5dbcc] px-2 py-0.5 rounded">
                          Level: {lo.bloomLevel}
                        </span>
                      </div>
                      
                      <AssessmentReviewUI loId={lo.id} />
                    </div>
                  ))}

                  {(!selectedLesson.learningObjectives || selectedLesson.learningObjectives.length === 0) && (
                    <div className="py-12 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center">
                      <div className="w-12 h-12 bg-[#f1f5f2] rounded-full flex items-center justify-center mb-3">
                        <Sparkles className="text-[#123d2d]" size={20} />
                      </div>
                      <p className="font-bold text-gray-900 mb-1">Let AI draft this lesson</p>
                      <p className="text-sm text-gray-500 mb-4">Darwinity will use your sources to generate objectives and blocks.</p>
                      <Button 
                        onClick={() => generateAST.mutate({ courseId: course.id })}
                        disabled={generateAST.isPending}
                        className="bg-[#123d2d] hover:bg-[#0d2a1f] text-white"
                      >
                        {generateAST.isPending ? "Generating..." : "Generate Content"}
                      </Button>
                    </div>
                  )}

                  <div className="pt-8 opacity-50 hover:opacity-100 transition">
                    <button 
                      onClick={() => generateAST.mutate({ courseId: course.id })}
                      className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-900 w-full p-4 border border-dashed border-gray-300 rounded-xl justify-center"
                    >
                      <Plus size={16} /> Add Objective
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">Select a lesson to edit</div>
            )}
          </div>
            )}

            {centerTab === 'graph' && (
              <div className="h-[calc(100%-60px)] p-4">
                {ast ? (
                  <CurriculumCanvas 
                    ast={ast} 
                    onImportToCanvas={(loIds) => {
                      const canvasId = prompt("Enter Target Canvas ID:");
                      if (canvasId && Number.isInteger(Number(canvasId)) && Number(canvasId) > 0) {
                        importToCanvas.mutate({ courseId: course.id, canvasId: Number(canvasId), loIds });
                      }
                    }}
                  />
                ) : (
                  <div className="h-full flex items-center justify-center text-gray-400">
                    Generate a curriculum first to see the graph
                  </div>
                )}
              </div>
            )}

            {centerTab === 'assessments' && (
              <div className="h-[calc(100%-60px)] p-4">
                <AssessmentReview 
                  assessments={course.modules?.flatMap((m: any) => m.lessons?.flatMap((l: any) => l.learningObjectives?.flatMap((lo: any) => 
                    (lo.assessments || []).map((a: any) => ({ ...a, loId: lo.id, loText: lo.text }))
                  ) || []) || []) || []}
                  onApprove={(id) => {
                    // Would need assessmentId mapping
                  }}
                  onReject={(id) => {
                    // Would need assessmentId mapping
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Companion */}
        <div className="w-[340px] border-l border-[#e1e8e2] bg-[#fdfdfd] flex flex-col shrink-0">
          <div className="p-4 border-b border-[#e1e8e2] bg-white">
            <h3 className="font-extrabold text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-[#123d2d]" /> Darwinity
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar">
            
            {/* Context Awareness */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Seeing</p>
              <div className="bg-[#f1f5f2] border border-[#e1e8e2] rounded-lg p-3 text-sm">
                <span className="font-medium text-gray-600 block text-xs mb-1">Lesson:</span>
                <span className="font-bold text-[#123d2d] leading-snug">{selectedLesson?.title || 'Course Outline'}</span>
              </div>
            </div>

            {/* Suggested Actions */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Suggestions</p>
              <div className="space-y-2">
                <CompanionAction icon={<PenTool size={14}/>} text="Improve objective" />
                <CompanionAction icon={<MessageSquare size={14}/>} text="Explain more simply" />
                <CompanionAction icon={<Lightbulb size={14}/>} text="Add a real-world example" />
                <CompanionAction icon={<BrainCircuit size={14}/>} text="Generate quiz for this lesson" />
                <CompanionAction icon={<Settings2 size={14}/>} text="Make it more challenging" />
              </div>
            </div>

            {/* Evidence/Sources */}
            <div>
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 mb-2">Source Evidence</p>
              <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs text-gray-600 flex gap-3 cursor-pointer hover:border-[#123d2d]">
                <FileText size={16} className="text-gray-400 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 block mb-0.5">Campbell Biology Ch. 4</span>
                  <span className="line-clamp-2">"The plasma membrane functions as a selective barrier that allows sufficient passage of oxygen..."</span>
                </div>
              </div>
            </div>

          </div>

          <div className="p-4 bg-white border-t border-[#e1e8e2]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask Darwinity to build..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#123d2d] focus:border-transparent transition shadow-inner"
              />
              <button className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center bg-[#123d2d] text-white rounded-lg hover:bg-[#0d2a1f] transition">
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertIcon() {
  return (
    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
  )
}

function CompanionAction({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:border-[#123d2d] hover:bg-[#f9fbfa] transition text-left group">
      <span className="text-gray-400 group-hover:text-[#123d2d]">{icon}</span>
      <span className="font-medium group-hover:text-gray-900">{text}</span>
    </button>
  )
}

function AssessmentReviewUI({ loId }: { loId: number }) {
  const { data: assessments, isLoading } = trpc.curriculum.getAssessments.useQuery({ loId });
  const updateAssessment = trpc.curriculum.updateAssessment.useMutation();

  if (isLoading) return <div className="text-xs text-gray-500 mt-2">Loading assessments...</div>;
  if (!assessments || assessments.length === 0) return null;

  return (
    <div className="mt-4 space-y-4 border-t border-[#f5dbcc] pt-4">
      <h5 className="text-xs font-bold text-[#8c4623] uppercase tracking-widest">Assessments ({assessments.length})</h5>
      {assessments.map((a: any) => {
        const options = JSON.parse(a.optionsJson || "[]");
        return (
          <div key={a.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <p className="font-bold text-sm mb-3">{a.stem}</p>
            <div className="space-y-2">
              {options.map((opt: any, i: number) => (
                <div key={i} className={`p-2 rounded text-xs border ${i === a.correctIndex ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                  <span className={i === a.correctIndex ? 'font-bold text-green-700' : 'text-gray-600'}>
                    {opt.text}
                  </span>
                  {!opt.is_correct && opt.justification && (
                    <p className="text-[10px] text-gray-500 mt-1 italic">Why it's wrong: {opt.justification}</p>
                  )}
                  {opt.is_correct && opt.justification && (
                    <p className="text-[10px] text-green-600 mt-1 italic">Why it's right: {opt.justification}</p>
                  )}
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-100">
              <button 
                onClick={() => updateAssessment.mutate({ assessmentId: a.id, status: 'approved' })}
                className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${a.status === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-green-100 hover:text-green-700'}`}
              >
                Approve
              </button>
              <button 
                onClick={() => updateAssessment.mutate({ assessmentId: a.id, status: 'rejected' })}
                className={`text-[10px] px-2 py-1 rounded font-bold uppercase ${a.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-700'}`}
              >
                Reject
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
