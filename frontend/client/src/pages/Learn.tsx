import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import { ArrowLeft, ArrowRight, BookOpen, Check, CircleHelp, FileText, Loader2, RotateCcw, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompanion } from "@/contexts/CompanionContext";
import { launchConfetti } from "@/lib/confetti";
import { captureApiHeaders, captureApiUrl } from "@/lib/captureApi";
import DocumentToolkit from "@/pages/DocumentToolkit";

type SourceReference = {
  page?: number | null;
  section?: string | null;
  paragraph?: number | null;
  quote: string;
};

type DocumentQuestion = {
  id: string;
  question: string;
  type: string;
  difficulty: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  sourceReference: SourceReference;
  topic?: string;
  learningObjective?: string;
  evaluationGuide?: {
    mainConcept?: string;
    requiredPoints?: string[];
    supportingDetails?: string[];
    expectedAnswerDepth?: string;
  };
};

type AnswerEvaluation = {
  correctAnswer: string;
  score: number;
  maxScore: number;
  grade: string;
  isCorrect: boolean;
  conceptualAccuracy: number;
  coverage: number;
  reasoning: number;
  clarity: number;
  strengths: string[];
  missingPoints: string[];
  errors: string[];
  feedback: string;
  improvedAnswer: string;
  evaluationMode?: string;
  sourceReference: SourceReference;
  sourceReferences: SourceReference[];
  progress: { correct: number; answered: number };
};

type DocumentInfo = {
  id: string;
  title: string;
  filename: string;
  mimeType: string;
  fileSize: number;
  fileUrl: string;
  status: string;
  stage: string;
  error?: string;
  questionCount: number;
};

const INSUFFICIENT_CONTENT = "We could not extract enough readable content from this file to generate document-based questions.";
const GENERATION_FAILED = "Your document was uploaded, but we could not generate questions from it yet.";

function stageLabel(stage: string): string {
  const labels: Record<string, string> = {
    processing: "Processing",
    extracting_content: "Extracting content",
    running_ocr: "Running OCR",
    generating_questions: "Generating questions",
    validating_questions: "Validating questions",
    ready: "Ready",
    extraction_failed: "Failed",
    generation_failed: "Failed",
    failed: "Failed",
  };
  return labels[stage] || "Processing";
}

function formatSize(bytes: number): string {
  if (!bytes) return "Size unavailable";
  return bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function compactOption(option: string): string {
  const words = option.trim().split(/\s+/);
  return words.length > 16 ? `${words.slice(0, 16).join(" ")}…` : option;
}

export default function Learn() {
  const { setContext, setState } = useCompanion();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const documentId = searchParams.get("documentId");
  const isQuestionMode = searchParams.get("mode") === "questions";
  const [document, setDocument] = useState<DocumentInfo | null>(null);
  const [questions, setQuestions] = useState<DocumentQuestion[]>([]);
  const [status, setStatus] = useState("processing");
  const [stage, setStage] = useState("processing");
  const [error, setError] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answerResult, setAnswerResult] = useState<AnswerEvaluation | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showAnswerSource, setShowAnswerSource] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [score, setScore] = useState({ correct: 0, answered: 0 });
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [busyAction, setBusyAction] = useState("");

  const request = useCallback(async (path: string, init: RequestInit = {}) => {
    const response = await fetch(captureApiUrl(path), {
      ...init,
      headers: { ...captureApiHeaders(), ...(init.headers || {}) },
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(body.detail || `Request failed (${response.status}).`);
    return body;
  }, []);

  const loadQuestions = useCallback(async (id: string) => {
    const result = await request(`/api/v1/documents/${encodeURIComponent(id)}/questions`);
    if (new URLSearchParams(window.location.search).get("documentId") !== id) return;
    setQuestions(result.questions || []);
    setScore(result.score || { correct: 0, answered: 0 });
    setStatus(result.status);
    setStage(result.stage);
    setError(result.error || "");
    if (result.status === "ready" && (!result.questions || result.questions.length === 0)) {
      setStatus("failed");
      setStage("generation_failed");
      setError("No evidence-backed questions were returned for this document.");
    }
  }, [request]);

  useEffect(() => {
    setContext({ workspace: "Document study" });
    setState("observing");
    return () => setState("idle");
  }, [setContext, setState]);

  useEffect(() => {
    setDocument(null);
    setQuestions([]);
    setStatus(documentId ? "processing" : "empty");
    setStage(documentId ? "processing" : "empty");
    setError("");
    setActiveIndex(0);
    setSelectedAnswer("");
    setAnswerResult(null);
    setScore({ correct: 0, answered: 0 });
    if (!documentId) return;

    let cancelled = false;
    const load = async () => {
      try {
        const response = await request(`/api/v1/documents/${encodeURIComponent(documentId)}`);
        if (cancelled) return;
        setDocument(response.document);
        for (let attempt = 0; attempt < 300; attempt++) {
          const current = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/status`);
          if (cancelled) return;
          setStatus(current.status);
          setStage(current.stage);
          setError(current.error || "");
          if (current.status === "ready" || current.status === "failed") {
            await loadQuestions(documentId);
            return;
          }
          await new Promise(resolve => window.setTimeout(resolve, 1000));
        }
        setError("Document processing is taking longer than expected. Retry the processing step.");
        setStatus("failed");
      } catch (cause) {
        if (!cancelled) {
          console.error("Failed to load document questions:", cause);
          setError(cause instanceof Error ? cause.message : "Could not load this document.");
          setStatus("failed");
          setStage("failed");
        }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [documentId, loadQuestions, request]);

  const visibleQuestions = useMemo(() => questions.filter(question =>
    (difficultyFilter === "all" || question.difficulty === difficultyFilter)
    && (typeFilter === "all" || question.type === typeFilter)
  ), [questions, difficultyFilter, typeFilter]);
  const question = visibleQuestions[activeIndex];
  const questionOptions = Array.isArray(question?.options) ? question.options : [];

  useEffect(() => {
    if (!documentId || !question) return;
    const key = `learnloop-answer-draft:${documentId}:${question.id}`;
    setSelectedAnswer(localStorage.getItem(key) || "");
    setDraftSaved(false);
    setShowHint(false);
    setShowAnswerSource(false);
  }, [documentId, question?.id]);

  const handleAnswer = async () => {
    if (!question || !documentId) return;
    setBusyAction("answer");
    setError("");
    try {
      const result = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id: question.id, answer: selectedAnswer }),
      });
      if (
        typeof result.score !== "number"
        || typeof result.maxScore !== "number"
        || typeof result.grade !== "string"
        || typeof result.feedback !== "string"
        || !result.progress
        || typeof result.progress.correct !== "number"
        || typeof result.progress.answered !== "number"
      ) {
        throw new Error("The document service returned an outdated answer format. Restart the API service and try again.");
      }
      setAnswerResult({
        ...result,
        strengths: Array.isArray(result.strengths) ? result.strengths : [],
        missingPoints: Array.isArray(result.missingPoints) ? result.missingPoints : [],
        errors: Array.isArray(result.errors) ? result.errors : [],
        sourceReference: result.sourceReference || question.sourceReference || { quote: "" },
      });
      setScore(result.progress || score);
      localStorage.removeItem(`learnloop-answer-draft:${documentId}:${question.id}`);
      setDraftSaved(false);
      if (result.score >= 6) {
        launchConfetti();
        setState("celebrating");
      } else {
        setState("prompting");
      }
    } catch (cause) {
      console.error("Failed to record question answer:", cause);
      setError(cause instanceof Error ? cause.message : "Could not save your answer.");
    } finally {
      setBusyAction("");
    }
  };

  const moveNext = () => {
    if (activeIndex < visibleQuestions.length - 1) setActiveIndex(activeIndex + 1);
    setSelectedAnswer("");
    setAnswerResult(null);
    setShowHint(false);
    setShowAnswerSource(false);
    setState("observing");
  };

  const saveDraft = () => {
    if (!documentId || !question) return;
    localStorage.setItem(`learnloop-answer-draft:${documentId}:${question.id}`, selectedAnswer);
    setDraftSaved(true);
  };
  const clearAnswer = () => {
    setSelectedAnswer("");
    setDraftSaved(false);
    if (documentId && question) localStorage.removeItem(`learnloop-answer-draft:${documentId}:${question.id}`);
  };

  const retry = async (kind: "extract" | "generate") => {
    if (!documentId) return;
    setBusyAction(kind);
    setError("");
    setStatus("processing");
    setStage(kind === "extract" ? "extracting_content" : "generating_questions");
    try {
      if (kind === "extract") {
        await request(`/api/v1/documents/${encodeURIComponent(documentId)}/extract`, { method: "POST" });
        for (let attempt = 0; attempt < 300; attempt++) {
          const current = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/status`);
          setStatus(current.status);
          setStage(current.stage);
          setError(current.error || "");
          if (current.status === "ready" || current.status === "failed") break;
          await new Promise(resolve => window.setTimeout(resolve, 1000));
        }
      } else {
        const generated = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/questions/retry`, { method: "POST" });
        setQuestions(generated.questions || []);
        setStatus(generated.status || "ready");
        setStage(generated.status === "ready" ? "ready" : "failed");
        setError("");
        setActiveIndex(0);
      }
      await loadQuestions(documentId);
    } catch (cause) {
      console.error(`Document ${kind} retry failed:`, cause);
      setStatus("failed");
      setStage(kind === "extract" ? "extraction_failed" : "generation_failed");
      setError(cause instanceof Error ? cause.message : `Could not retry ${kind}.`);
    } finally {
      setBusyAction("");
    }
  };

  const regenerate = async (mode: "replace" | "append") => {
    if (!documentId) return;
    setBusyAction(mode);
    try {
      const result = await request(`/api/v1/documents/${encodeURIComponent(documentId)}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: 12, mode }),
      });
      setQuestions(result.questions || []);
      setStatus(result.status);
      setStage("ready");
      setActiveIndex(0);
      setSelectedAnswer("");
      setAnswerResult(null);
    } catch (cause) {
      console.error("Question regeneration failed:", cause);
      setError(cause instanceof Error ? cause.message : "Could not generate questions.");
      setStatus("failed");
      setStage("generation_failed");
    } finally {
      setBusyAction("");
    }
  };

  const openDocument = async () => {
    if (!document?.fileUrl) return;
    try {
      const response = await fetch(captureApiUrl(document.fileUrl), { headers: captureApiHeaders() });
      if (!response.ok) throw new Error(`Could not open document (${response.status}).`);
      const url = URL.createObjectURL(await response.blob());
      window.open(url, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (cause) {
      console.error("Could not open uploaded document:", cause);
      setError(cause instanceof Error ? cause.message : "Could not open uploaded document.");
    }
  };

  if (!documentId) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-3xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-[#1b7a52]"><BookOpen size={30} /></div>
        <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#1b7a52]">Document-based learning</p>
        <h1 className="mt-3 text-3xl font-extrabold text-gray-900">Upload a document to start practicing</h1>
        <p className="mt-3 max-w-xl text-sm text-gray-600">Questions are created from your document. If you miss one, the explanation points you to the relevant passage. There is no sample question in this learning view.</p>
        <Button onClick={() => setLocation("/")} className="mt-7 bg-[#1b7a52] text-white hover:bg-[#156443]"><ArrowLeft className="mr-2" size={16} /> Back to Upload</Button>
      </div>
    );
  }

  const insufficient = error.toLowerCase().includes("not extract enough readable content");
  const failed = status === "failed";

  if (documentId && !isQuestionMode) return <DocumentToolkit documentId={documentId} />;

  return (
    <div className="mx-auto flex min-h-[calc(100vh-140px)] max-w-4xl flex-col px-6 py-8">
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-[#1b7a52]"><FileText size={21} /></div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-extrabold text-gray-900">{document?.title || "Uploaded document"}</h1>
              <p className="mt-1 text-xs text-gray-500">{document?.mimeType || "File"} · {formatSize(document?.fileSize || 0)} · {questions.length} questions</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {documentId && <button onClick={() => setLocation(`/learn?documentId=${encodeURIComponent(documentId)}`)} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#1b7a52] hover:text-[#1b7a52]"><ArrowLeft size={14} /> Document Toolkit</button>}
            {document?.fileUrl && <button onClick={() => void openDocument()} className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-3 py-2 text-xs font-bold text-gray-700 hover:border-[#1b7a52] hover:text-[#1b7a52]"><FileText size={14} /> View document</button>}
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          {status === "processing" ? <Loader2 className="animate-spin text-[#1b7a52]" size={16} /> : failed ? <CircleHelp className="text-amber-600" size={16} /> : <Check className="text-[#1b7a52]" size={16} />}
          <span className={`text-sm font-bold ${failed ? "text-amber-700" : "text-gray-700"}`}>{stageLabel(stage)}</span>
          {status === "processing" && <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100"><div className="h-full w-2/3 animate-pulse rounded-full bg-[#1b7a52]" /></div>}
        </div>
      </div>

      {failed ? (
        <div className="my-auto rounded-2xl border border-amber-200 bg-amber-50 p-7">
          <h2 className="text-xl font-extrabold text-gray-900">{insufficient ? INSUFFICIENT_CONTENT : GENERATION_FAILED}</h2>
          {error && <p className="mt-3 text-sm text-amber-900">{error}</p>}
          <p className="mt-3 text-sm text-gray-700">Supported formats: PDF, DOCX, PPTX, TXT, Markdown, CSV, HTML, PNG, JPG, WEBP, TIFF, MP3, M4A, WAV, and OGG. OCR or transcription is attempted when configured.</p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button onClick={() => void retry(insufficient || stage === "extraction_failed" ? "extract" : "generate")} disabled={!!busyAction} className="bg-[#1b7a52] text-white hover:bg-[#156443]">
              {busyAction ? <Loader2 className="mr-2 animate-spin" size={16} /> : <RotateCcw className="mr-2" size={16} />}
              {insufficient || stage === "extraction_failed" ? "Retry extraction" : "Retry generation"}
            </Button>
            <Button variant="outline" onClick={() => setLocation("/")}>Re-upload file</Button>
          </div>
        </div>
      ) : status === "processing" ? (
        <div className="my-auto flex flex-col items-center py-16 text-center">
          <Loader2 className="mb-4 animate-spin text-[#1b7a52]" size={36} />
          <h2 className="text-xl font-extrabold text-gray-900">{stageLabel(stage)}</h2>
          <p className="mt-2 text-sm text-gray-500">Preparing questions using only evidence found in your document.</p>
        </div>
      ) : question ? (
        <>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="min-w-48 flex-1">
              <div className="flex justify-between text-sm font-bold text-gray-600"><span>Question {activeIndex + 1} of {visibleQuestions.length}</span><span className="text-[#1b7a52]">Score {score.correct}/{score.answered}</span></div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full bg-[#1b7a52] transition-all" style={{ width: `${((activeIndex + 1) / visibleQuestions.length) * 100}%` }} /></div>
            </div>
            <div className="flex flex-wrap gap-2">
              <select aria-label="Filter by difficulty" value={difficultyFilter} onChange={event => { setDifficultyFilter(event.target.value); setActiveIndex(0); setSelectedAnswer(""); setAnswerResult(null); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold">
                <option value="all">All difficulties</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
              <select aria-label="Filter by question type" value={typeFilter} onChange={event => { setTypeFilter(event.target.value); setActiveIndex(0); setSelectedAnswer(""); setAnswerResult(null); }} className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-semibold">
                <option value="all">All question types</option>
                {["comprehension", "recall", "explanation", "application", "compare-and-contrast", "cause-and-effect", "problem-solving", "scenario-based", "definition", "multiple-choice", "short-answer", "long-form", "true-false"].map(type => <option key={type} value={type}>{type.replaceAll("-", " ")}</option>)}
              </select>
            </div>
          </div>

          <article className="rounded-3xl border border-gray-200 bg-white p-7 shadow-sm sm:p-9">
            <div className="mb-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold capitalize text-[#1b7a52]">{question.type.replace("-", " ")}</span>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold capitalize text-gray-600">{question.difficulty}</span>
            </div>
            <h2 className="text-2xl font-extrabold leading-snug text-gray-900">{question.question}</h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-gray-500">
              {question.topic && <span>Topic: <strong className="text-gray-700">{question.topic}</strong></span>}
              {question.learningObjective && <span>{question.learningObjective}</span>}
            </div>
            <div className="mt-7 space-y-3">
              {questionOptions.length > 0 ? questionOptions.map((option, index) => {
                const chosen = selectedAnswer === option;
                const correct = answerResult?.correctAnswer === option;
                const color = answerResult
                  ? correct ? "border-green-500 bg-green-50 text-green-900" : chosen ? "border-red-400 bg-red-50 text-red-900" : "border-gray-200 text-gray-400"
                  : chosen ? "border-[#1b7a52] bg-emerald-50 text-[#1b7a52]" : "border-gray-200 text-gray-700 hover:border-gray-400";
                return <button key={`${question.id}-${index}`} aria-label={question.type === "multiple-choice" ? `Option ${String.fromCharCode(65 + index)}: ${option}` : option} onClick={() => !answerResult && setSelectedAnswer(option)} disabled={!!answerResult} className={`flex w-full items-start justify-between gap-4 rounded-xl border-2 p-4 text-left text-sm font-medium transition ${color}`}>
                  <span className="flex items-start gap-3">
                    {question.type === "multiple-choice" && <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black/5 text-xs font-extrabold">{String.fromCharCode(65 + index)}</span>}
                    <span>{question.type === "multiple-choice" ? compactOption(option) : option}</span>
                  </span>
                  {answerResult && correct && <Check className="shrink-0 text-green-600" size={18} />}
                  {answerResult && chosen && !correct && <X className="shrink-0 text-red-600" size={18} />}
                </button>;
              }) : <>
                <label htmlFor="written-answer" className="block text-sm font-semibold text-gray-700">Answer in your own words. Exact wording from the source is not required.</label>
                <textarea id="written-answer" value={selectedAnswer} onChange={event => { if (!answerResult) { setSelectedAnswer(event.target.value); setDraftSaved(false); } }} disabled={!!answerResult} placeholder="Explain what you understand..." rows={7} aria-describedby="answer-word-count" className="w-full resize-y rounded-xl border-2 border-gray-200 p-4 text-sm leading-6 outline-none focus:border-[#1b7a52]" />
                <p id="answer-word-count" className="text-right text-xs text-gray-500">{selectedAnswer.trim() ? selectedAnswer.trim().split(/\s+/).length : 0} words · Short or detailed answers are welcome.</p>
                {!answerResult && <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={saveDraft}>Save draft</Button>
                  <Button type="button" variant="outline" size="sm" onClick={clearAnswer}>Clear answer</Button>
                  {draftSaved && <span aria-live="polite" className="self-center text-xs text-emerald-700">Draft saved on this device.</span>}
                </div>}
                {showHint && <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-900"><strong>Hint:</strong> Focus on {question.topic || "the main concept"} and the relationship explained in the material.</p>}
                {!answerResult && <button type="button" onClick={() => setShowHint(value => !value)} className="text-sm font-semibold text-[#1b7a52] underline">{showHint ? "Hide hint" : "Show hint"}</button>}
              </>}
            </div>

            {answerResult && (
              <div className={`mt-6 rounded-xl border p-5 ${answerResult.score >= 6 ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}`}>
                <h3 className="text-lg font-extrabold text-gray-900">Score: {answerResult.score}/{answerResult.maxScore} · {answerResult.grade}</h3>
                <p className="mt-2 text-sm text-gray-700">{answerResult.feedback}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-700 sm:grid-cols-4">
                  <span>Concepts: {answerResult.conceptualAccuracy}/10</span><span>Coverage: {answerResult.coverage}/10</span>
                  <span>Reasoning: {answerResult.reasoning}/10</span><span>Clarity: {answerResult.clarity}/10</span>
                </div>
                {(answerResult.strengths || []).length > 0 && <div className="mt-4"><strong className="text-sm">What you got right</strong><ul className="mt-1 list-disc pl-5 text-sm text-gray-700">{(answerResult.strengths || []).map((item, index) => <li key={`strength-${index}`}>{item}</li>)}</ul></div>}
                {(answerResult.missingPoints || []).length > 0 && <div className="mt-3"><strong className="text-sm">What to add</strong><ul className="mt-1 list-disc pl-5 text-sm text-gray-700">{(answerResult.missingPoints || []).map((item, index) => <li key={`missing-${index}`}>{item}</li>)}</ul></div>}
                {(answerResult.errors || []).length > 0 && <div className="mt-3"><strong className="text-sm">Needs correction</strong><ul className="mt-1 list-disc pl-5 text-sm text-gray-700">{(answerResult.errors || []).map((item, index) => <li key={`error-${index}`}>{item}</li>)}</ul></div>}
                <div className="mt-4 rounded-lg border border-black/10 bg-white/70 p-4">
                  <strong className="text-sm">A stronger sample answer</strong>
                  <p className="mt-2 text-sm leading-6 text-gray-800">{answerResult.improvedAnswer}</p>
                </div>
                {answerResult.score < 8 && <div className="mt-4">
                  <button type="button" onClick={() => setShowAnswerSource(value => !value)} className="text-sm font-semibold text-[#1b7a52] underline">{showAnswerSource ? "Hide source material" : "View source material"}</button>
                  {showAnswerSource && <div className="mt-3 border-t border-black/10 pt-3">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Find it in your document</p>
                    <p className="mt-1 text-xs text-gray-700">{[answerResult.sourceReference?.section, answerResult.sourceReference?.page ? `Page ${answerResult.sourceReference.page}` : null, answerResult.sourceReference?.paragraph ? `Paragraph ${answerResult.sourceReference.paragraph}` : null].filter(Boolean).join(" · ") || "Document location"}</p>
                    {answerResult.sourceReference?.quote && <blockquote className="mt-2 border-l-2 border-[#1b7a52] pl-3 text-sm italic text-gray-700">“{answerResult.sourceReference.quote}”</blockquote>}
                    {document?.fileUrl && <button onClick={() => void openDocument()} className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#1b7a52] hover:underline"><FileText size={14} /> View in document</button>}
                  </div>
                  }
                </div>}
                {answerResult.evaluationMode === "offline-content-check" && <p className="mt-3 text-xs text-gray-500">Offline content check was used because semantic AI evaluation is unavailable.</p>}
              </div>
            )}

            {error && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}

            <div className="mt-7 flex flex-wrap justify-between gap-3">
              {answerResult ? <><Button variant="outline" onClick={() => setAnswerResult(null)}>Edit and try again</Button><Button onClick={moveNext} disabled={activeIndex >= visibleQuestions.length - 1} className="ml-auto bg-[#1b7a52] text-white hover:bg-[#156443]">Next question <ArrowRight className="ml-2" size={16} /></Button></> : <Button onClick={() => void handleAnswer()} disabled={busyAction === "answer" || (questionOptions.length > 0 && !selectedAnswer.trim())} className="ml-auto bg-[#1b7a52] text-white hover:bg-[#156443]">{busyAction === "answer" ? "Evaluating..." : "Submit Answer for Evaluation"}</Button>}
            </div>
          </article>

          <div className="mt-5 flex flex-wrap justify-between gap-3">
            <Button variant="outline" onClick={() => void regenerate("append")} disabled={!!busyAction}><Sparkles className="mr-2" size={15} /> Generate more questions</Button>
            <Button variant="outline" onClick={() => void regenerate("replace")} disabled={!!busyAction}><RotateCcw className="mr-2" size={15} /> Regenerate question set</Button>
          </div>
        </>
      ) : (
        <div className="my-auto rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <h2 className="text-xl font-extrabold text-gray-900">No questions match these filters</h2>
          <button className="mt-3 text-sm font-bold text-[#1b7a52] underline" onClick={() => { setDifficultyFilter("all"); setTypeFilter("all"); setActiveIndex(0); setSelectedAnswer(""); setAnswerResult(null); }}>Clear filters</button>
        </div>
      )}
    </div>
  );
}
