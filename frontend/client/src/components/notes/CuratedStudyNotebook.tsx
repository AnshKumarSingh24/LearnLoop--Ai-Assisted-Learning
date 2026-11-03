import React, { useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Target,
  FileText,
  Quote,
  Lightbulb,
  HelpCircle,
  Bookmark,
} from "lucide-react";

export type CuratedSection = {
  id?: string;
  number?: number;
  title: string;
  summary?: string;
  paragraphs?: string[];
  keyPoints?: string[];
  definitions?: { term: string; definition: string }[];
  examples?: string[];
  takeaway?: string;
  reviewQuestions?: { question: string; answer: string }[];
  visual?: {
    type?: string;
    caption?: string;
    labels?: string[];
    steps?: string[];
  };
  sourceReference?: {
    quote?: string;
    section?: string | null;
    page?: number | null;
    paragraph?: number | null;
  };
};

export type CuratedNotebookData = {
  title: string;
  subtitle?: string;
  overview?: string;
  learningObjectives?: string[];
  sections: CuratedSection[];
};

export default function CuratedStudyNotebook({
  data,
  activeSection = 0,
  onSectionChange,
  zoom = 100,
  editing = false,
  onEditSection,
}: {
  data: CuratedNotebookData;
  activeSection?: number;
  onSectionChange?: (index: number) => void;
  zoom?: number;
  editing?: boolean;
  onEditSection?: (index: number, field: string, value: any) => void;
}) {
  const [showSource, setShowSource] = useState(false);
  const sections = data.sections || [];
  const currentSection = sections[Math.min(activeSection, Math.max(0, sections.length - 1))];
  const sectionIdx = Math.min(activeSection, Math.max(0, sections.length - 1));

  return (
    <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] items-start" style={{ fontSize: `${zoom}%` }}>
      {/* Notebook Table of Contents Sidebar */}
      <nav aria-label="Notebook Table of Contents" className="rounded-2xl border-2 border-emerald-900/10 bg-white p-4 shadow-sm sticky top-20">
        <div className="flex items-center gap-2 pb-3 border-b border-emerald-950/10">
          <Bookmark size={16} className="text-[#1b7a52]" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-800">Notebook Contents</h3>
        </div>
        <div className="mt-3 space-y-1.5 max-h-[70vh] overflow-y-auto pr-1">
          {sections.map((section, idx) => {
            const isSelected = idx === sectionIdx;
            return (
              <button
                key={section.id || idx}
                onClick={() => {
                  onSectionChange?.(idx);
                  setShowSource(false);
                }}
                className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold transition ${
                  isSelected
                    ? "bg-[#1b7a52] text-white shadow-xs"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-[#1b7a52]"
                }`}
              >
                <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] ${
                  isSelected ? "bg-white/20 text-white font-extrabold" : "bg-gray-100 text-gray-600"
                }`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="truncate">{section.title || `Section ${idx + 1}`}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Notebook Sheet */}
      <article className="min-w-0 rounded-3xl border-2 border-emerald-900/10 bg-[#FAF9F5] p-6 sm:p-10 shadow-md relative overflow-hidden curated-notebook-sheet">
        {/* Notebook Top Ribbon / Bookmark Accent */}
        <div className="flex items-center justify-between pb-6 border-b border-gray-200">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100/80 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#1b7a52]">
              <BookOpen size={13} /> Curated Study Notebook
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
              {data.title}
            </h1>
            {data.subtitle && <p className="mt-1 text-xs text-gray-600 font-medium">{data.subtitle}</p>}
          </div>

          <div className="text-right">
            <span className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">
              Section {sectionIdx + 1} of {sections.length}
            </span>
          </div>
        </div>

        {/* Global Overview & Objectives (shown on first section or expandable) */}
        {sectionIdx === 0 && (
          <div className="mt-6 space-y-4">
            {data.overview && (
              <section className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-xs uppercase tracking-wide">
                  <Sparkles size={16} className="text-[#1b7a52]" />
                  <span>Executive Overview</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-gray-800 font-normal">
                  {data.overview}
                </p>
              </section>
            )}

            {data.learningObjectives && data.learningObjectives.length > 0 && (
              <section className="rounded-2xl border border-sky-200/80 bg-sky-50/70 p-5 shadow-xs">
                <div className="flex items-center gap-2 text-sky-900 font-extrabold text-xs uppercase tracking-wide">
                  <Target size={16} className="text-sky-700" />
                  <span>Learning Objectives</span>
                </div>
                <ul className="mt-2.5 grid gap-2 sm:grid-cols-2 text-xs font-medium text-gray-800">
                  {data.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-sky-200 text-sky-800 text-[10px] font-bold mt-0.5">
                        {i + 1}
                      </span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* Current Section Content */}
        {currentSection ? (
          <div className="mt-8 space-y-7">
            {/* Section Heading */}
            <div className="border-b border-gray-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-[#1b7a52]">
                <span>Chapter {String(sectionIdx + 1).padStart(2, "0")}</span>
              </div>
              {editing ? (
                <input
                  aria-label="Edit section title"
                  value={currentSection.title}
                  onChange={e => onEditSection?.(sectionIdx, "title", e.target.value)}
                  className="mt-2 w-full rounded-xl border border-gray-300 p-2 text-xl font-extrabold text-gray-900"
                />
              ) : (
                <h2 className="mt-1 text-2xl font-extrabold text-gray-900 tracking-tight">
                  {currentSection.title}
                </h2>
              )}
            </div>

            {/* Summary & Curated Paragraphs */}
            <div className="space-y-4">
              {editing ? (
                <textarea
                  aria-label="Edit section summary"
                  value={currentSection.summary}
                  onChange={e => onEditSection?.(sectionIdx, "summary", e.target.value)}
                  rows={3}
                  className="w-full rounded-xl border border-gray-300 p-3 text-sm leading-relaxed"
                />
              ) : (
                currentSection.summary && (
                  <p className="text-sm sm:text-base font-semibold leading-relaxed text-gray-800 bg-white/60 p-4 rounded-xl border border-gray-200/60">
                    {currentSection.summary}
                  </p>
                )
              )}

              {currentSection.paragraphs?.map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-gray-700">
                  {para}
                </p>
              ))}
            </div>

            {/* Curated Visual Representation / Flow */}
            <section className="rounded-2xl border-2 border-emerald-200/80 bg-white p-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#1b7a52] flex items-center gap-1.5">
                  <Sparkles size={14} /> Curated Visual Concept
                </span>
                <span className="text-[11px] font-semibold text-gray-500">
                  {currentSection.visual?.caption || "Key Concept Diagram"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5 py-3">
                {(currentSection.visual?.steps?.length
                  ? currentSection.visual.steps
                  : currentSection.visual?.labels?.length
                  ? currentSection.visual.labels
                  : [currentSection.title, "Core Principle", "Application", "Outcome"]
                ).map((step, idx, arr) => (
                  <React.Fragment key={idx}>
                    <div className="flex items-center gap-2 rounded-xl border-2 border-emerald-600/30 bg-emerald-50/60 px-3.5 py-2.5 text-center text-xs font-bold text-gray-800 shadow-2xs">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1b7a52] text-white text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </div>
                    {idx < arr.length - 1 && (
                      <span className="text-base font-bold text-[#1b7a52]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </section>

            {/* Key Points */}
            {(currentSection.keyPoints || []).length > 0 && (
              <section className="rounded-2xl border border-emerald-100 bg-white/80 p-5 shadow-xs">
                <h3 className="font-extrabold text-sm text-gray-900 flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-[#1b7a52]" />
                  <span>Key Points to Remember</span>
                </h3>
                <ul className="mt-3 space-y-2">
                  {(currentSection.keyPoints || []).map((point, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[#1b7a52] mt-0.5">
                        <CheckCircle2 size={12} />
                      </span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Definitions / Glossary Cards */}
            {currentSection.definitions && currentSection.definitions.length > 0 && (
              <section className="space-y-2.5">
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-gray-500">
                  Key Definitions
                </h3>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {currentSection.definitions.map((def, i) => (
                    <div key={i} className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3.5 shadow-2xs">
                      <dt className="font-extrabold text-xs text-amber-950">{def.term}</dt>
                      <dd className="mt-1 text-xs text-gray-700 leading-relaxed">{def.definition}</dd>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Examples */}
            {currentSection.examples && currentSection.examples.length > 0 && (
              <section className="rounded-2xl border border-sky-200/80 bg-sky-50/70 p-4 shadow-xs">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wide text-sky-900">
                  <Lightbulb size={14} className="text-sky-700" />
                  <span>Practical Example</span>
                </div>
                {currentSection.examples.map((example, i) => (
                  <p key={i} className="mt-2 text-xs leading-relaxed text-gray-800">
                    {example}
                  </p>
                ))}
              </section>
            )}

            {/* Takeaway Box */}
            {currentSection.takeaway && (
              <div className="rounded-2xl border-2 border-violet-300 bg-violet-50/80 p-4 shadow-xs flex items-start gap-3">
                <Sparkles size={18} className="text-violet-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-xs uppercase tracking-wide text-violet-900">
                    Chapter Takeaway
                  </h4>
                  <p className="mt-1 text-xs sm:text-sm font-medium leading-relaxed text-violet-950">
                    {currentSection.takeaway}
                  </p>
                </div>
              </div>
            )}

            {/* Review Questions */}
            {currentSection.reviewQuestions && currentSection.reviewQuestions.length > 0 && (
              <section className="space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wide text-gray-500 flex items-center gap-1.5">
                  <HelpCircle size={14} /> Quick Checkpoint
                </h3>
                {currentSection.reviewQuestions.map((q, i) => (
                  <details key={i} className="rounded-xl border border-gray-200 bg-white p-3.5 text-xs">
                    <summary className="cursor-pointer font-bold text-gray-800 hover:text-[#1b7a52]">
                      {q.question}
                    </summary>
                    <p className="mt-2 border-t pt-2 text-gray-700 leading-relaxed font-medium">
                      {q.answer}
                    </p>
                  </details>
                ))}
              </section>
            )}

            {/* Grounded Citation */}
            {currentSection.sourceReference?.quote && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setShowSource(!showSource)}
                  className="text-xs font-bold text-[#1b7a52] hover:underline inline-flex items-center gap-1"
                >
                  <Quote size={12} /> {showSource ? "Hide source quote" : "View source citation"}
                </button>
                {showSource && (
                  <blockquote className="mt-2 rounded-xl border-l-4 border-[#1b7a52] bg-white p-3.5 text-xs italic text-gray-700 shadow-xs">
                    “{currentSection.sourceReference.quote}”
                    <span className="mt-1.5 block not-italic text-[10px] font-semibold text-gray-500">
                      {[
                        currentSection.sourceReference.section,
                        currentSection.sourceReference.page ? `Page ${currentSection.sourceReference.page}` : null,
                        currentSection.sourceReference.paragraph ? `Paragraph ${currentSection.sourceReference.paragraph}` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </span>
                  </blockquote>
                )}
              </div>
            )}

            {/* Navigation Buttons between Chapters */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-5 mt-8">
              <button
                type="button"
                disabled={sectionIdx === 0}
                onClick={() => {
                  onSectionChange?.(Math.max(0, sectionIdx - 1));
                  setShowSource(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                <ChevronLeft size={16} /> Previous Section
              </button>

              <span className="text-xs font-bold text-gray-500">
                {sectionIdx + 1} / {sections.length}
              </span>

              <button
                type="button"
                disabled={sectionIdx >= sections.length - 1}
                onClick={() => {
                  onSectionChange?.(Math.min(sections.length - 1, sectionIdx + 1));
                  setShowSource(false);
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
              >
                Next Section <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-gray-500">No sections found in this notebook.</p>
        )}
      </article>
    </div>
  );
}
