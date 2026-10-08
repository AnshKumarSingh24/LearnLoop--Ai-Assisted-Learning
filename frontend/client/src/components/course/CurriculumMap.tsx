import React from 'react';
import { ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, BookOpen, Target, FileText, Edit2, Save, X, Zap, AlertCircle } from 'lucide-react';

export type LearningObjective = {
  id: string;
  text: string;
  bloom_verb: string;
  bloom_level: string;
  source_spans: string[];
  prerequisites: string[];
};

export type Lesson = {
  id: string;
  title: string;
  learning_objectives: LearningObjective[];
};

export type Module = {
  id: string;
  title: string;
  lessons: Lesson[];
};

export type CourseAST = {
  id: string;
  title: string;
  modules: Module[];
};

interface CurriculumMapProps {
  ast: CourseAST;
  onEditLO?: (lo: LearningObjective) => void;
  onRegenAssessments?: (lo: LearningObjective) => void;
  editingLoId?: string | null;
  editText?: string;
  setEditText?: (text: string) => void;
  onSaveLO?: (lo: LearningObjective) => void;
}

export function CurriculumMap({ 
  ast, 
  onEditLO, 
  onRegenAssessments, 
  editingLoId, 
  editText, 
  setEditText, 
  onSaveLO 
}: CurriculumMapProps) {
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({});

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isEditing = (loId: string) => editingLoId === loId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 w-full font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-2xl font-bold text-[#123d2d] flex items-center gap-2">
          <BookOpen className="text-[#3b82f6]" />
          {ast.title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">Curriculum Abstract Syntax Tree (AST)</p>
      </header>

      <div className="space-y-4">
        {ast.modules.map(module => (
          <div key={module.id} className="border border-gray-100 rounded-lg overflow-hidden">
            {/* Module Header */}
            <div 
              className="bg-gray-50 px-4 py-3 flex items-center cursor-pointer hover:bg-gray-100 transition"
              onClick={() => toggleNode(module.id)}
            >
              {expandedNodes[module.id] ? <ChevronDown size={18} className="text-gray-400 mr-2" /> : <ChevronRight size={18} className="text-gray-400 mr-2" />}
              <div className="font-semibold text-gray-800">Module: {module.title}</div>
              <div className="ml-auto text-xs text-gray-500 font-medium bg-gray-200 px-2 py-1 rounded-md">
                {module.lessons.length} Lessons
              </div>
            </div>

            {/* Lessons */}
            {expandedNodes[module.id] && (
              <div className="pl-6 pr-4 py-3 bg-white border-t border-gray-100 space-y-3">
                {module.lessons.map(lesson => (
                  <div key={lesson.id} className="border border-blue-50 rounded-lg">
                    <div 
                      className="bg-blue-50/50 px-3 py-2 flex items-center cursor-pointer hover:bg-blue-50 transition"
                      onClick={() => toggleNode(lesson.id)}
                    >
                      {expandedNodes[lesson.id] ? <ChevronDown size={16} className="text-blue-400 mr-2" /> : <ChevronRight size={16} className="text-blue-400 mr-2" />}
                      <FileText size={14} className="text-blue-500 mr-2" />
                      <div className="font-medium text-gray-700 text-sm">Lesson: {lesson.title}</div>
                      <div className="ml-auto text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded">
                        {lesson.learning_objectives.length} LOs
                      </div>
                    </div>

                    {/* Learning Objectives */}
                    {expandedNodes[lesson.id] && (
                      <div className="pl-8 pr-3 py-3 space-y-3">
                        {lesson.learning_objectives.map(lo => {
                          const hasSource = lo.source_spans && lo.source_spans.length > 0;
                          const editing = isEditing(lo.id);
                          
                          return (
                            <div key={lo.id} className="bg-gray-50 rounded border border-gray-200 p-3 text-sm flex gap-3">
                              <div className="mt-0.5 flex-shrink-0">
                                <Target size={16} className="text-[#123d2d]" />
                              </div>
                              <div className="flex-1">
                                {editing ? (
                                  <div className="space-y-2">
                                    <input
                                      type="text"
                                      value={editText || lo.text}
                                      onChange={(e) => setEditText?.(e.target.value)}
                                      onBlur={() => onSaveLO?.(lo)}
                                      onKeyDown={(e) => e.key === 'Enter' && onSaveLO?.(lo)}
                                      className="w-full px-3 py-2 border border-[#123d2d] rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#123d2d]"
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <button onClick={() => onSaveLO?.(lo)} className="text-xs font-bold text-green-700 px-2 py-1 rounded hover:bg-green-50">
                                        <Save size={12} className="inline mr-1" /> Save
                                      </button>
                                      <button onClick={() => { if (setEditText) setEditText(lo.text); if (onEditLO) onEditLO(null as any); }} className="text-xs font-bold text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
                                        <X size={12} className="inline mr-1" /> Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className="text-gray-800 font-medium leading-relaxed">
                                      {lo.text}
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2 text-xs">
                                      <span className="bg-[#123d2d]/10 text-[#123d2d] px-2 py-0.5 rounded font-mono border border-[#123d2d]/20">
                                        verb: {lo.bloom_verb}
                                      </span>
                                      <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded font-mono border border-purple-200">
                                        lvl: {lo.bloom_level}
                                      </span>
                                      {hasSource ? (
                                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 flex items-center gap-1">
                                          <CheckCircle2 size={12} /> Grounded
                                        </span>
                                      ) : (
                                        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                                          <AlertTriangle size={12} /> Unverified
                                        </span>
                                      )}
                                      {lo.prerequisites && lo.prerequisites.length > 0 && (
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded border border-yellow-200 flex items-center gap-1">
                                          <AlertCircle size={12} /> {lo.prerequisites.length} prereqs
                                        </span>
                                      )}
                                    </div>
                                    {hasSource && (
                                      <div className="mt-3 text-xs text-gray-500 bg-white p-2 rounded border border-gray-100 italic">
                                        "{lo.source_spans[0]}"
                                      </div>
                                    )}
                                    {(onEditLO || onRegenAssessments) && (
                                      <div className="mt-2 flex gap-2">
                                        {onEditLO && (
                                          <button 
                                            onClick={() => onEditLO(lo)}
                                            className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-blue-50 transition"
                                          >
                                            <Edit2 size={12} /> Edit
                                          </button>
                                        )}
                                        {onRegenAssessments && (
                                          <button 
                                            onClick={() => onRegenAssessments(lo)}
                                            className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-purple-50 transition"
                                          >
                                            <Zap size={12} /> Regen Qs
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
