import { useState, useRef } from "react";
import { 
  UploadCloud, 
  Link2, 
  Mic, 
  Brain, 
  FileText, 
  Clock3,
  PlayCircle,
  Sparkles,
  X,
  Loader2,
  CheckCircle2,
  ArrowRight,
  Zap,
  Layers,
  Trophy,
  BookOpen,
  Flame,
  MessageSquare,
  Headphones,
  Target,
  Plus,
  Compass
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useCompanion } from "@/contexts/CompanionContext";
import { useDarwinity } from "@/contexts/DarwinityStoreContext";
import { generate10LevelCourse } from "@/lib/courseGenerator";
import { captureApiHeaders, captureApiUrl, CAPTURE_API_URL } from "@/lib/captureApi";
import { resolveWorkspaceId } from "@/lib/workspace";
import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";


type ModalMode = null | "upload" | "paste" | "record" | "synthesize";

interface SpeechResultItem {
  transcript: string;
}

interface SpeechResult {
  isFinal: boolean;
  0: SpeechResultItem;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: { resultIndex: number; results: ArrayLike<SpeechResult> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

type SpeechRecognitionWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export default function Dashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { setContext } = useCompanion();
  const { state, dispatch } = useDarwinity();
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState("Ready");
  const [uploadError, setUploadError] = useState("");
  const [uploadFailureStage, setUploadFailureStage] = useState("");
  const [uploadedDocumentId, setUploadedDocumentId] = useState("");
  const [pasteText, setPasteText] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingMode, setRecordingMode] = useState<"choose" | "record">("choose");
  const [recordingError, setRecordingError] = useState("");
  const [recordingTranscript, setRecordingTranscript] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptRef = useRef<string[]>([]);

  // Floating Course Generator Modal state
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [coursePrompt, setCoursePrompt] = useState("");
  const [courseDifficulty, setCourseDifficulty] = useState("Intermediate");
  const [courseGoal, setCourseGoal] = useState("");
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [isGeneratingCourse, setIsGeneratingCourse] = useState(false);

  const generateFromPrompt = trpc.curriculum.generateFromPrompt.useMutation();

  useEffect(() => {
    setContext({ workspace: "Home" });
  }, [setContext]);

  useEffect(() => () => {
    speechRecognitionRef.current?.stop();
    if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
  }, []);

  // A source preview can send learners here to use the same course generator.
  // Keep the extracted PDF text in the editable prompt so they can tailor it first.
  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("generateCourse") !== "1") return;

    const captureId = params.get("captureId");
    const sourceTitle = params.get("sourceTitle") || "Uploaded source";
    setShowCourseModal(true);

    if (!captureId) {
      setCoursePrompt(sourceTitle);
      return;
    }

    let cancelled = false;
    fetch(`${CAPTURE_API_URL}/captures/${captureId}`, {
      headers: { Authorization: "Bearer demo-user" },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load source");
        return response.json();
      })
      .then((capture) => {
        if (cancelled) return;
        const title = capture.title || sourceTitle;
        const content = capture.normalized_content || capture.original_content || "";
        setCoursePrompt(content ? `Build a course from this source: ${title}\n\n${content}` : title);
      })
      .catch(() => {
        if (!cancelled) setCoursePrompt(sourceTitle);
      });

    return () => { cancelled = true; };
  }, [search]);

  const bootstrap = trpc.workspace.bootstrap.useQuery();
  const { data: sourcesData } = trpc.workspace.sources.useQuery(
    { workspaceId: bootstrap.data?.id as number },
    { enabled: !!bootstrap.data?.id }
  );
  const createSource = trpc.workspace.createSource.useMutation();
  const utils = trpc.useUtils();

  const handleGenerateCourseSubmit = async () => {
    if (!coursePrompt.trim()) return;
    setIsGeneratingCourse(true);
    try {
      const difficultyKey = courseDifficulty.toLowerCase() as "beginner" | "intermediate" | "advanced";
      
      let newCourse;
      try {
        const response = await fetch(`${CAPTURE_API_URL}/api/course/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            content: `Create a comprehensive course about: ${coursePrompt}. Goal: ${courseGoal}.`,
            level: difficultyKey,
            time_budget: "30min/day"
          })
        });
        if (!response.ok) throw new Error("AI Generation failed");
        
        const data = await response.json();
        newCourse = data.course;
        
        if (!newCourse || newCourse.title === "Failed to Generate" || !newCourse.lessons?.length || !newCourse.modules?.length) {
          throw new Error("AI backend returned an empty course; using the source-driven local generator");
        }

        newCourse.sourceIds = selectedSourceIds.map(String);
        if (!newCourse.modules) newCourse.modules = [];
        if (!newCourse.lessons) newCourse.lessons = [];
        
        const currentCount = newCourse.lessons.length;
        if (currentCount < 10) {
          const fallback = generate10LevelCourse(coursePrompt, difficultyKey, courseGoal, []);
          for (let i = currentCount; i < 10; i++) {
            const fbLesson = fallback.lessons[i];
            const fbModule = fallback.modules[i];
            if (fbLesson && fbModule) {
              const newLesId = `les-${newCourse.id}-padded-${i+1}`;
              const newModId = `mod-${newCourse.id}-padded-${i+1}`;
              
              fbLesson.id = newLesId;
              newCourse.lessons.push(fbLesson);
              
              fbModule.id = newModId;
              fbModule.lessonIds = [newLesId];
              newCourse.modules.push(fbModule);
            }
          }
        }
        
        newCourse.totalLessons = 10;
        newCourse.icon = "🎓";
        newCourse.accent = "#1b7a52";
      } catch (err) {
        console.warn("AI Generation failed, falling back to local generator", err);
        newCourse = generate10LevelCourse(
          coursePrompt,
          difficultyKey,
          courseGoal,
          selectedSourceIds.map(String)
        );
      }

      dispatch({
        type: "CREATE_COURSE",
        course: newCourse
      });

      setShowCourseModal(false);
      setCoursePrompt("");
      setIsGeneratingCourse(false);
      setLocation(`/courses/${newCourse.id}`);
    } catch (err) {
      console.error("Course creation error:", err);
      setIsGeneratingCourse(false);
    }
  };

  const waitForDocument = async (documentId: string) => {
    for (let attempt = 0; attempt < 300; attempt++) {
      const response = await fetch(captureApiUrl(`/api/v1/documents/${encodeURIComponent(documentId)}/status`), {
        headers: captureApiHeaders(),
      });
      if (!response.ok) throw new Error(`Could not check document processing status (${response.status}).`);
      const status = await response.json();
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
      setUploadStatus(labels[status.stage] || "Processing");
      if (status.status === "ready") return;
      if (status.status === "failed") {
        setUploadFailureStage(status.stage || "failed");
        throw new Error(status.error || "Document processing failed.");
      }
      await new Promise(resolve => window.setTimeout(resolve, 1000));
    }
    throw new Error("Document processing is taking longer than expected. You can retry from the learning page.");
  };

  const handleUploadFile = async (file: File) => {
    setModalMode("upload");
    setSelectedUpload(file);
    setUploading(true);
    setUploadSuccess(false);
    setUploadError("");
    setUploadFailureStage("");
    setUploadProgress(0);
    setUploadStatus("Uploading");
    setUploadedDocumentId("");
    try {
      const workspaceId = await resolveWorkspaceId(bootstrap);
      {
        const formData = new FormData();
        formData.append("file", file, file.name);
        formData.append("workspaceId", String(workspaceId));

        const response = await new Promise<Response>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", captureApiUrl("/api/v1/documents"));
          Object.entries(captureApiHeaders()).forEach(([key, value]) => xhr.setRequestHeader(key, value));
          xhr.upload.onprogress = event => {
            if (event.lengthComputable) setUploadProgress(Math.round((event.loaded / event.total) * 100));
          };
          xhr.onerror = () => reject(new Error("Upload request failed. Check the document API and retry."));
          xhr.onload = () => resolve(new Response(xhr.responseText, {
            status: xhr.status,
            headers: { "Content-Type": "application/json" },
          }));
          xhr.send(formData);
        });

        const payload = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(payload.detail || `Upload failed (${response.status}).`);
        const document = payload.document;
        if (!document?.id) throw new Error("The document API did not return a document ID.");
        setUploadedDocumentId(document.id);
        setUploadStatus("Processing");
        await createSource.mutateAsync({
          workspaceId,
          title: file.name,
          sourceType: file.type.includes("pdf") ? "pdf" : file.type.includes("image") ? "image" : "document",
          fileName: file.name,
          mimeType: file.type,
          externalId: document.id,
          url: document.fileUrl ? captureApiUrl(document.fileUrl) : ""
        });
        await utils.workspace.sources.invalidate();
        setUploadProgress(100);
        await waitForDocument(document.id);
        setUploadSuccess(true);
        setUploadStatus("Ready");
        setTimeout(() => {
          setModalMode(null);
          setUploadSuccess(false);
          setLocation(`/learn?documentId=${encodeURIComponent(document.id)}`);
        }, 1200);
      }
    } catch (err) {
      console.error("Document upload or processing failed:", err);
      setUploadStatus("Failed");
      setUploadError(err instanceof Error ? err.message : "Document processing failed.");
    } finally {
      setUploading(false);
    }
  };

  const retryDocumentProcessing = async (retryGeneration: boolean) => {
    if (!uploadedDocumentId) return;
    setUploading(true);
    setUploadError("");
    setUploadStatus(retryGeneration ? "Generating questions" : "Extracting content");
    try {
      const path = retryGeneration
        ? `/api/v1/documents/${encodeURIComponent(uploadedDocumentId)}/questions/retry`
        : `/api/v1/documents/${encodeURIComponent(uploadedDocumentId)}/extract`;
      const response = await fetch(captureApiUrl(path), {
        method: "POST",
        headers: captureApiHeaders(),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || `Retry failed (${response.status}).`);
      if (retryGeneration && payload.status === "ready") setUploadStatus("Ready");
      else await waitForDocument(uploadedDocumentId);
      setUploadSuccess(true);
      window.setTimeout(() => {
        setModalMode(null);
        setUploadSuccess(false);
        setLocation(`/learn?documentId=${encodeURIComponent(uploadedDocumentId)}`);
      }, 1200);
    } catch (err) {
      setUploadStatus("Failed");
      setUploadError(err instanceof Error ? err.message : "Retry failed.");
    } finally {
      setUploading(false);
    }
  };

  const handlePasteSubmit = async () => {
    if (!pasteText.trim()) return;
    setUploading(true);
    setUploadError("");
    setUploadFailureStage("");
    try {
      const workspaceId = await resolveWorkspaceId(bootstrap);
      const trimmed = pasteText.trim();
      let parsedUrl: URL | null = null;
      try {
        const candidate = new URL(trimmed);
        if (candidate.protocol === "http:" || candidate.protocol === "https:") parsedUrl = candidate;
      } catch {
        parsedUrl = null;
      }
      setUploadSuccess(false);
      setUploadProgress(parsedUrl ? 0 : 100);
      setUploadStatus(parsedUrl ? "Fetching webpage" : "Uploading text");
      if (!parsedUrl) {
        const fileName = `${(pasteTitle.trim() || "Pasted material").replace(/[\\/:*?"<>|]/g, "-")}.txt`;
        setModalMode("upload");
        setPasteText("");
        setPasteTitle("");
        setUploading(false);
        await handleUploadFile(new File([trimmed], fileName, { type: "text/plain" }));
        return;
      }

      const response = await fetch(captureApiUrl("/api/v1/documents/from-url"), {
        method: "POST",
        headers: { ...captureApiHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ url: parsedUrl.toString(), workspaceId: String(workspaceId) }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.detail || `Link ingestion failed (${response.status}).`);
      const document = payload.document;
      if (!document?.id) throw new Error("The link ingestion service did not return a document ID.");
      setUploadedDocumentId(document.id);
      setSelectedUpload(new File([], document.filename || pasteTitle || parsedUrl.hostname));
      setPasteText("");
      setPasteTitle("");
      setUploadStatus("Processing");
      await waitForDocument(document.id);
      setUploadProgress(100);
      setUploadSuccess(true);
      setUploadStatus("Ready");
      window.setTimeout(() => {
        setModalMode(null);
        setUploadSuccess(false);
        setLocation(`/learn?documentId=${encodeURIComponent(document.id)}`);
      }, 1200);
    } catch (err) {
      console.error("Pasted source ingestion failed:", err);
      setUploadStatus("Failed");
      setUploadError(err instanceof Error ? err.message : "Could not ingest this source.");
    } finally {
      setUploading(false);
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setRecordingError("Audio recording is not supported in this browser. Try a recent desktop or mobile browser.");
      return;
    }
    setRecordingError("");
    setRecordingTranscript("");
    transcriptRef.current = [];
    recordingChunksRef.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "";
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = event => {
        if (event.data.size > 0) recordingChunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
        const audioBlob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || "audio/webm" });
        const transcript = transcriptRef.current.join(" ").trim();
        const transcriptSentences = transcript
          ? transcript.match(/[^.!?]+[.!?]?/g)?.map(part => part.trim()).filter(Boolean) || [transcript]
          : [];
        const normalizedTranscript = transcriptSentences
          .flatMap(sentence => {
            const words = sentence.split(/\s+/);
            const groups: string[] = [];
            for (let index = 0; index < words.length; index += 28) {
              groups.push(words.slice(index, index + 28).join(" "));
            }
            return groups;
          })
          .map(sentence => /[.!?]$/.test(sentence) ? sentence : `${sentence}.`)
          .join("\n\n");
        const file = transcript
          ? new File([normalizedTranscript], "Lecture recording transcript.txt", { type: "text/plain" })
          : new File([audioBlob], "Lecture recording.webm", { type: audioBlob.type || "audio/webm" });
        void handleUploadFile(file);
      };

      const speechWindow = window as SpeechRecognitionWindow;
      const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition;
      if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = navigator.language || "en-US";
        recognition.onresult = event => {
          for (let index = event.resultIndex; index < event.results.length; index++) {
            const result = event.results[index];
            if (result.isFinal && result[0].transcript.trim()) {
              transcriptRef.current.push(result[0].transcript.trim());
              setRecordingTranscript(transcriptRef.current.join(" "));
            }
          }
        };
        recognition.onerror = event => {
          setRecordingError(`Live transcription is unavailable (${event.error}); the audio will still be uploaded for transcription.`);
        };
        speechRecognitionRef.current = recognition;
        recognition.start();
      } else {
        setRecordingError("Live transcription is not available in this browser. The recorded audio will be sent for server transcription.");
      }
      recorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      mediaStreamRef.current?.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
      setRecordingError(err instanceof Error ? err.message : "Could not access your microphone. Check browser permissions.");
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    const recognition = speechRecognitionRef.current;
    speechRecognitionRef.current = null;
    const stopAudio = () => {
      if (mediaRecorderRef.current?.state === "recording") mediaRecorderRef.current.stop();
    };
    if (recognition) {
      recognition.onend = stopAudio;
      recognition.stop();
    } else {
      stopAudio();
    }
  };

  const activeCourses = state.courses || [];

  return (
    <div className="min-h-screen bg-[#f7f6f0] text-[#1c1d22] font-sans pb-24">
      <input ref={fileInputRef} type="file" className="hidden" accept=".pdf,.docx,.pptx,.txt,.md,.csv,.html,.htm,.png,.jpg,.jpeg,.webp,.tif,.tiff,.mp3,.m4a,.wav,.ogg,.webm" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void handleUploadFile(file); }} />
      <input ref={audioFileInputRef} type="file" className="hidden" accept=".mp3,.m4a,.wav,.ogg,.webm,audio/*" onChange={e => { const file = e.target.files?.[0]; e.target.value = ""; if (file) void handleUploadFile(file); }} />
      {/* Top Header Bar */}
      <header className="h-16 border-b border-[#e5e4dc] bg-[#f7f6f0] px-8 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
          <span>Tuesday, 08 September</span>
          <span>/</span>
          <span className="text-gray-900 font-bold">Your learning space</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#e5e4dc] rounded-full text-xs font-bold shadow-sm">
            <Zap size={14} className="text-amber-500 fill-amber-500" />
            <span>420 XP</span>
          </div>

          <button 
            onClick={() => setLocation("/canvas")}
            className="px-4 py-2 bg-white hover:bg-gray-50 border border-[#e5e4dc] rounded-full text-xs font-bold transition shadow-sm"
          >
            Study workspace
          </button>

          <button 
            onClick={() => setShowCourseModal(true)}
            className="px-4 py-2 bg-[#1b7a52] hover:bg-[#156443] text-white rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1.5"
          >
            <Sparkles size={14} /> Generate course
          </button>

          <button 
            onClick={() => { setModalMode("upload"); fileInputRef.current?.click(); }}
            className="px-4 py-2 bg-[#2952ee] hover:bg-[#1e42d8] text-white rounded-full text-xs font-bold transition shadow-sm flex items-center gap-1"
          >
            <Plus size={14} /> Add sources
          </button>
        </div>
      </header>

      <div className="max-w-[1240px] mx-auto px-8 pt-10 space-y-10">

        {/* Hero Section */}
        <div className="flex justify-between items-start">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-[#1b7a52] uppercase">
              <span className="w-2 h-2 rounded-full bg-[#1b7a52]" />
              GOOD TO SEE YOU
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight leading-none text-[#1c1d22]">
              Hey there, <br />
              <span className="text-gray-400 font-extrabold">what do you want to master?</span>
            </h1>
            <p className="text-sm font-medium text-gray-600 pt-2">
              Feed it once. Unlock a whole toolkit for understanding, practice, and recall.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white/70 backdrop-blur border border-[#e5e4dc] px-4 py-2 rounded-full text-xs font-bold text-gray-600">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-amber-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-amber-900">ML</div>
              <div className="w-6 h-6 rounded-full bg-blue-200 border-2 border-white flex items-center justify-center text-[10px] font-bold text-blue-900">AI</div>
            </div>
            <span>Your path adapts as you learn</span>
          </div>
        </div>

        {/* Main "Feed it once. Unlock the whole toolkit." Card Section */}
        <div className="bg-[#fcfbf8] border border-[#e8e7df] rounded-[32px] p-8 shadow-sm space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-gray-400 uppercase">START WITH ANYTHING</span>
              <h2 className="text-2xl font-extrabold text-[#1c1d22] tracking-tight">Feed it once. Unlock the whole toolkit.</h2>
            </div>
            <span className="px-3 py-1 bg-[#e7f6ef] text-[#1b7a52] text-xs font-bold rounded-full border border-[#cbebdc]">
              Sources stay connected
            </span>
          </div>

          {/* 3 Main Input Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => setModalMode("upload")}
              className="bg-[#1b7a52] hover:bg-[#156443] text-white p-6 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between h-[150px] group shadow-md"
            >
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <UploadCloud size={20} className="text-white" />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">Upload</h3>
                  <p className="text-xs text-emerald-100 font-medium">PDF, slides, docs, images</p>
                </div>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => setModalMode("paste")}
              className="bg-[#f3f2eb] hover:bg-[#ecebe3] text-[#1c1d22] p-6 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between h-[150px] group border border-[#e2e1d7]"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-[#1b7a52] flex items-center justify-center">
                <FileText size={20} />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">Paste</h3>
                  <p className="text-xs text-gray-500 font-medium">A link, notes, or transcript</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>

            <div 
              onClick={() => { setRecordingMode("choose"); setRecordingError(""); setRecordingTranscript(""); setModalMode("record"); }}
              className="bg-[#f3f2eb] hover:bg-[#ecebe3] text-[#1c1d22] p-6 rounded-[24px] cursor-pointer transition-all flex flex-col justify-between h-[150px] group border border-[#e2e1d7]"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100/60 text-[#1b7a52] flex items-center justify-center">
                <Mic size={20} />
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="font-extrabold text-lg leading-tight">Record</h3>
                  <p className="text-xs text-gray-500 font-medium">Lecture or audio file</p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>

          {/* Grid of 8 Toolkit Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {[
              { label: "Notes", sub: "Create study notes", icon: FileText, color: "text-emerald-600 bg-emerald-50", target: "/artifacts?type=summary" },
              { label: "Mind map", sub: "Connect ideas", icon: Layers, color: "text-purple-600 bg-purple-50", target: "/artifacts?type=mindmap" },
              { label: "Flashcards", sub: "Recall until it sticks", icon: Brain, color: "text-blue-600 bg-blue-50", target: "/artifacts?type=flashcards" },
              { label: "Quizzes", sub: "Pressure practice", icon: Target, color: "text-amber-600 bg-amber-50", target: "/artifacts?type=key_concepts" },
              { label: "Podcast", sub: "Listen to a recap", icon: Headphones, color: "text-indigo-600 bg-indigo-50", target: "/artifacts?type=podcast" },
              { label: "Ask AI", sub: "Chat with sources", icon: Sparkles, color: "text-[#1b7a52] bg-emerald-50", target: "/artifacts" },
              { label: "Focus", sub: "Study sprint", icon: Clock3, color: "text-amber-600 bg-amber-50", target: "/artifacts?type=timeline" },
            ].map((tool, idx) => {
              const IconComp = tool.icon;
              return (
                <div 
                  key={idx}
                  onClick={() => setLocation(tool.target)}
                  className="p-3 bg-white hover:bg-gray-50 border border-[#e5e4dc] rounded-2xl cursor-pointer transition-all flex flex-col justify-between min-h-[96px] group"
                >
                  <div className={`w-7 h-7 rounded-lg ${tool.color} flex items-center justify-center shrink-0`}>
                    <IconComp size={14} />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-gray-900 group-hover:text-[#1b7a52] transition-colors">{tool.label}</h4>
                    <p className="text-[9px] text-gray-400 font-medium truncate">{tool.sub}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Blue Next Best Step Card */}
          <div className="md:col-span-2 bg-[#2952ee] text-white p-8 rounded-[32px] flex flex-col justify-between h-[200px] relative overflow-hidden shadow-lg">
            <div className="absolute right-0 top-0 w-64 h-64 border-[32px] border-white/10 rounded-full translate-x-20 -translate-y-20 pointer-events-none" />
            
            <div className="flex items-center gap-2 text-xs font-extrabold tracking-widest text-blue-200 uppercase">
              <Compass size={16} /> NEXT BEST STEP
            </div>

            <div className="space-y-1">
              <span className="text-xs font-semibold text-blue-200">Path complete · 0 min</span>
              <h3 className="text-2xl font-extrabold tracking-tight">You completed this path</h3>
            </div>

            <button 
              onClick={() => setLocation("/learn")}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center self-end transition"
            >
              <ArrowRight size={20} className="text-white" />
            </button>
          </div>

          {/* Lime Green Streak Card */}
          <div className="bg-[#c8f52c] text-[#1c1d22] p-8 rounded-[32px] flex flex-col justify-between h-[200px] shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center">
              <Flame size={28} className="text-[#1c1d22] fill-[#1c1d22]" />
              <span className="px-3 py-1 bg-[#1c1d22] text-[#c8f52c] text-[10px] font-extrabold uppercase tracking-wider rounded-full">
                ON FIRE
              </span>
            </div>

            <div>
              <div className="text-5xl font-extrabold tracking-tight leading-none mb-1">
                6 <span className="text-xl font-bold text-gray-800">days</span>
              </div>
              <p className="text-xs font-bold text-gray-700">Daily learning streak</p>
            </div>
          </div>
        </div>

      </div>

      {/* Upload/Paste/Record Modal */}
      {modalMode && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !uploading && !isRecording && setModalMode(null)}>
          <div className="bg-white rounded-3xl border border-[#e5e4dc] shadow-2xl w-full max-w-lg overflow-hidden p-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-[#1c1d22]">
                {modalMode === "upload" ? "Upload Document" : modalMode === "paste" ? "Paste Content or Link" : modalMode === "record" ? "Record or Upload Audio" : "What You Unlock"}
              </h3>
              <button onClick={() => !uploading && !isRecording && setModalMode(null)} className="p-1 text-gray-400 hover:text-gray-900 rounded-full" disabled={isRecording}>
                <X size={20} />
              </button>
            </div>

            {uploadSuccess ? (
              <div className="py-12 flex flex-col items-center text-center">
                <CheckCircle2 size={48} className="text-[#1b7a52] mb-4" />
                <h4 className="text-xl font-extrabold text-[#1c1d22]">Your document is ready. Unlock the full toolkit.</h4>
                <p className="text-xs text-gray-500 font-medium mt-2">{selectedUpload?.name || "Your source"} · Ingestion complete</p>
                <button onClick={() => { setModalMode(null); setLocation(uploadedDocumentId ? `/learn?documentId=${encodeURIComponent(uploadedDocumentId)}` : "/learn"); }} className="mt-5 rounded-xl bg-[#1b7a52] px-5 py-3 text-sm font-extrabold text-white">Open Document Toolkit</button>
              </div>
            ) : modalMode === "upload" ? (
              <div>
                <div 
                  onClick={() => !uploading && fileInputRef.current?.click()}
                  className="border-2 border-dashed border-[#e5e4dc] hover:border-[#1b7a52] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer transition text-center"
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 size={36} className="text-[#1b7a52] animate-spin mb-2" />
                      <span className="font-bold text-sm">{uploadStatus}...</span>
                      {selectedUpload && <span className="text-xs text-gray-500 mt-1">{selectedUpload.name} · {selectedUpload.type || "Unknown file type"}</span>}
                      {uploadStatus === "Uploading" && <div className="w-full max-w-xs mt-4"><div className="h-2 rounded-full bg-gray-100 overflow-hidden"><div className="h-full bg-[#1b7a52] transition-all" style={{ width: `${uploadProgress}%` }} /></div><span className="text-xs text-gray-500 mt-1 block">{uploadProgress}%</span></div>}
                    </div>
                  ) : (
                    <>
                      <UploadCloud size={36} className="text-[#1b7a52] mb-3" />
                      {selectedUpload ? <><p className="font-extrabold text-sm text-[#1c1d22]">{selectedUpload.name}</p><p className="text-xs text-gray-500 mt-1">{selectedUpload.type || "Unknown file type"} · {(selectedUpload.size / (1024 * 1024)).toFixed(2)} MB · {uploadStatus}</p></> : <><p className="font-extrabold text-sm text-[#1c1d22]">Click to select a file</p><p className="text-xs text-gray-400 font-medium mt-1">PDF, DOCX, PPTX, TXT, Markdown, CSV, HTML, images, audio · Up to 50MB</p></>}
                    </>
                  )}
                </div>
                {uploadError && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-left">
                    <p className="text-sm font-bold text-red-800">{uploadError.toLowerCase().includes("audio transcription is unavailable") ? "Your recording could not be transcribed." : uploadError.toLowerCase().includes("not extract enough readable") ? uploadError : uploadedDocumentId ? "Your document was uploaded, but we could not generate questions from it yet." : "The file could not be uploaded."}</p>
                    <p className="mt-1 text-xs text-red-700">{uploadError}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {uploadedDocumentId && <button onClick={() => void retryDocumentProcessing(uploadFailureStage === "generation_failed")} className="rounded-lg bg-[#1b7a52] px-3 py-2 text-xs font-bold text-white" disabled={uploading}>{uploadFailureStage === "generation_failed" ? "Retry generation" : "Retry extraction"}</button>}
                      <button onClick={() => fileInputRef.current?.click()} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-bold text-gray-700" disabled={uploading}>Re-upload file</button>
                    </div>
                  </div>
                )}
              </div>
            ) : modalMode === "paste" ? (
              <div className="space-y-4">
                <input value={pasteTitle} onChange={e => setPasteTitle(e.target.value)} placeholder="Title (Optional)" className="w-full px-4 py-3 bg-[#f8f7f2] border border-[#e5e4dc] rounded-xl text-sm font-medium outline-none focus:border-[#1b7a52]" />
                <textarea value={pasteText} onChange={e => setPasteText(e.target.value)} placeholder="Paste URL or raw text here..." rows={5} className="w-full px-4 py-3 bg-[#f8f7f2] border border-[#e5e4dc] rounded-xl text-sm font-medium outline-none focus:border-[#1b7a52] resize-none" />
                {uploadError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{uploadError}</p>}
                <button onClick={handlePasteSubmit} disabled={!pasteText.trim() || uploading} className="w-full bg-[#1b7a52] hover:bg-[#156443] text-white font-extrabold py-3 rounded-xl transition">
                  {uploading ? `${uploadStatus}...` : "Ingest and Open Toolkit"}
                </button>
              </div>
            ) : modalMode === "record" ? (
              recordingMode === "choose" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <button type="button" onClick={() => { setRecordingMode("record"); void startRecording(); }} className="rounded-2xl border border-[#e5e4dc] bg-[#f8f7f2] p-5 text-left transition hover:border-[#1b7a52] hover:bg-emerald-50" aria-label="Record audio in LearnLoop">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600"><Mic size={20} /></span>
                    <strong className="block text-sm font-extrabold">Record here</strong>
                    <span className="mt-1 block text-xs text-gray-500">Capture a lecture or study note with your microphone.</span>
                  </button>
                  <button type="button" onClick={() => audioFileInputRef.current?.click()} className="rounded-2xl border border-[#e5e4dc] bg-[#f8f7f2] p-5 text-left transition hover:border-[#1b7a52] hover:bg-emerald-50" aria-label="Upload an audio recording">
                    <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-[#1b7a52]"><UploadCloud size={20} /></span>
                    <strong className="block text-sm font-extrabold">Upload a recording</strong>
                    <span className="mt-1 block text-xs text-gray-500">Use an existing MP3, M4A, WAV, OGG, or WebM audio file.</span>
                  </button>
                  {recordingError && <p role="alert" className="sm:col-span-2 rounded-xl bg-amber-50 p-3 text-left text-xs text-amber-800">{recordingError}</p>}
                </div>
              ) : (
                <div className="py-6 flex flex-col items-center text-center">
                  <button type="button" aria-label={isRecording ? "Stop lecture recording" : "Start lecture recording"} onClick={() => isRecording ? stopRecording() : void startRecording()} className={`w-20 h-20 rounded-full border flex items-center justify-center mb-4 transition ${isRecording ? "bg-red-600 border-red-700 text-white animate-pulse" : "bg-red-100 border-red-200 text-red-600 hover:scale-105"}`}>
                    {isRecording ? <span className="h-6 w-6 rounded-md bg-white" /> : <Mic size={32} />}
                  </button>
                  <p className="font-extrabold text-sm">{isRecording ? "Recording lecture — tap to stop" : "Tap to record lecture"}</p>
                  <p className="text-xs text-gray-400 font-medium mt-1">Your audio or live transcript is sent through document ingestion to create your toolkit.</p>
                  {!isRecording && <p className="mt-3 max-w-sm text-[11px] leading-relaxed text-gray-500">Live speech recognition is used when available. Otherwise, the uploaded audio is transcribed by the document service.</p>}
                  {recordingTranscript && <p className="mt-4 max-h-32 overflow-y-auto rounded-xl bg-gray-50 p-3 text-left text-xs text-gray-600">{recordingTranscript}</p>}
                  {recordingError && <p role="status" className="mt-4 rounded-xl bg-amber-50 p-3 text-left text-xs text-amber-800">{recordingError}</p>}
                  {!isRecording && <button type="button" onClick={() => setRecordingMode("choose")} className="mt-4 text-xs font-bold text-[#1b7a52] hover:underline">Choose another audio option</button>}
                </div>
              )
            ) : (
              <div className="space-y-4">
                <p className="text-xs font-semibold text-gray-500">Your material is now indexed. You can generate notes, mind maps, or start learning.</p>
                <button onClick={() => { setModalMode(null); setLocation(uploadedDocumentId ? `/learn?documentId=${encodeURIComponent(uploadedDocumentId)}` : "/learn"); }} className="w-full bg-[#1b7a52] text-white font-extrabold py-3 rounded-xl">Open Document Toolkit</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Floating Generate Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !isGeneratingCourse && setShowCourseModal(false)}>
          <div className="bg-white rounded-3xl border border-[#e5e4dc] shadow-2xl w-full max-w-lg overflow-hidden p-8 space-y-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#1b7a52] text-white flex items-center justify-center font-bold">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-[#1c1d22]">Generate AI Course</h3>
                  <p className="text-xs text-gray-500 font-medium">Customize your personalized study path</p>
                </div>
              </div>
              <button onClick={() => !isGeneratingCourse && setShowCourseModal(false)} className="p-1 text-gray-400 hover:text-gray-900 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">What should this course be about?</label>
                <textarea 
                  value={coursePrompt}
                  onChange={e => setCoursePrompt(e.target.value)}
                  placeholder="e.g. Cellular Biology, Machine Learning Fundamentals, Macroeconomics..."
                  rows={3}
                  className="w-full px-4 py-3 bg-[#f8f7f2] border border-[#e5e4dc] rounded-2xl text-sm font-medium outline-none focus:border-[#1b7a52] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Difficulty Level</label>
                <div className="grid grid-cols-3 gap-2">
                  {["Beginner", "Intermediate", "Advanced"].map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setCourseDifficulty(lvl)}
                      className={`py-2.5 rounded-xl text-xs font-bold border transition ${
                        courseDifficulty === lvl 
                          ? "bg-[#1b7a52] text-white border-[#1b7a52]" 
                          : "bg-[#f8f7f2] text-gray-700 border-[#e5e4dc] hover:border-gray-400"
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Learning Goal / Target</label>
                <input 
                  value={courseGoal}
                  onChange={e => setCourseGoal(e.target.value)}
                  placeholder="e.g. Prepare for midterm exam in 2 weeks"
                  className="w-full px-4 py-2.5 bg-[#f8f7f2] border border-[#e5e4dc] rounded-xl text-sm font-medium outline-none focus:border-[#1b7a52]"
                />
              </div>

              {sourcesData && sourcesData.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Add Connected Sources</label>
                  <div className="max-h-28 overflow-y-auto space-y-1.5 border border-[#e5e4dc] rounded-xl p-2 bg-[#f8f7f2]">
                    {sourcesData.map((src: any) => {
                      const selected = selectedSourceIds.includes(src.id);
                      return (
                        <div 
                          key={src.id}
                          onClick={() => {
                            setSelectedSourceIds(prev => selected ? prev.filter(i => i !== src.id) : [...prev, src.id]);
                          }}
                          className={`flex items-center justify-between p-2 rounded-lg text-xs font-semibold cursor-pointer transition ${
                            selected ? "bg-[#1b7a52] text-white" : "hover:bg-white text-gray-700"
                          }`}
                        >
                          <span className="truncate">{src.title}</span>
                          {selected && <CheckCircle2 size={14} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <button 
              onClick={handleGenerateCourseSubmit}
              disabled={!coursePrompt.trim() || isGeneratingCourse}
              className="w-full bg-[#1b7a52] hover:bg-[#156443] text-white font-extrabold py-3.5 rounded-2xl transition flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
            >
              {isGeneratingCourse ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Building Course Structure...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>Generate Course Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
