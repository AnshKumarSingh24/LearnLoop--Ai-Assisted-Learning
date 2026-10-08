/**
 * devStore.ts
 * -----------
 * In-memory + JSON-file backed store for local development.
 * Used when DATABASE_URL is not set, so the full app works
 * without MySQL — courses, canvases, cards, sources, etc.
 * Data is persisted to .dev-store.json in the repo root.
 */
import fs from "fs";
import path from "path";

const STORE_FILE = path.join(process.cwd(), ".dev-store.json");

interface StoreData {
  workspaces: Record<number, any>;
  canvases: Record<number, any>;
  cards: Record<number, any>;
  cardLinks: Record<number, any>;
  sources: Record<number, any>;
  syncRuns: Record<number, any>;
  courses: Record<number, any>;
  modules: Record<number, any>;
  lessons: Record<number, any>;
  learningObjectives: Record<number, any>;
  courseVersions: Record<number, any>;
  assessments: Record<number, any>;
  studentMastery: Record<string, any>;
  counters: Record<string, number>;
}

function emptyStore(): StoreData {
  return {
    workspaces: {},
    canvases: {},
    cards: {},
    cardLinks: {},
    sources: {},
    syncRuns: {},
    courses: {},
    modules: {},
    lessons: {},
    learningObjectives: {},
    courseVersions: {},
    assessments: {},
    studentMastery: {},
    counters: {},
  };
}

let _store: StoreData | null = null;

function loadStore(): StoreData {
  if (_store) return _store;
  try {
    if (fs.existsSync(STORE_FILE)) {
      _store = JSON.parse(fs.readFileSync(STORE_FILE, "utf-8"));
      console.log(`[DevStore] Loaded from ${STORE_FILE}`);
    } else {
      _store = emptyStore();
      // Seed with default workspace + canvas
      seedDefaults(_store);
    }
  } catch {
    _store = emptyStore();
    seedDefaults(_store);
  }
  return _store!;
}

function seedDefaults(s: StoreData) {
  s.workspaces[1] = { id: 1, ownerId: 1, name: "Research Garden", slug: "dev-workspace-1", description: "Your local dev workspace.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  s.canvases[1] = { id: 1, workspaceId: 1, title: "Learning Garden", description: "A visual map of ideas.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  s.cards[1] = { id: 1, canvasId: 1, title: "Learning is a change in mental models", body: "A working thesis captured from the reading.", cardType: "quote", accent: "mint", x: 120, y: 140, width: 270, height: 188, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  s.cards[2] = { id: 2, canvasId: 1, title: "Models become useful when they connect", body: "The value of an idea often comes from the bridges it creates.", cardType: "insight", accent: "lilac", x: 520, y: 320, width: 275, height: 188, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  s.counters = { workspaces: 1, canvases: 1, cards: 2, cardLinks: 0, sources: 0, syncRuns: 0, courses: 0, modules: 0, lessons: 0, learningObjectives: 0, courseVersions: 0, assessments: 0, studentMastery: 0 };
  saveStore(s);
}

export function saveStore(s?: StoreData) {
  try {
    fs.writeFileSync(STORE_FILE, JSON.stringify(s ?? _store, null, 2));
  } catch { /* ignore */ }
}

function nextId(store: StoreData, table: keyof StoreData["counters"]) {
  store.counters[table] = (store.counters[table] || 0) + 1;
  return store.counters[table];
}

// ── WORKSPACE ───────────────────────────────────────────────────
export function devGetWorkspace(id: number) {
  return loadStore().workspaces[id] ?? null;
}

export function devEnsureWorkspace(userId: number) {
  const store = loadStore();
  // Find workspace owned by user
  const ws = Object.values(store.workspaces).find((w: any) => w.ownerId === userId);
  if (ws) return ws;
  const id = nextId(store, "workspaces");
  const newWs = { id, ownerId: userId, name: "Research Garden", slug: `workspace-${userId}`, description: "Your dev workspace.", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.workspaces[id] = newWs;
  // Also seed a canvas
  const canvasId = nextId(store, "canvases");
  store.canvases[canvasId] = { id: canvasId, workspaceId: id, title: "Learning Garden", description: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  saveStore();
  return newWs;
}

// ── CANVAS ──────────────────────────────────────────────────────
export function devGetCanvasSnapshot(workspaceId: number, canvasId?: number) {
  const store = loadStore();
  const canvasList = Object.values(store.canvases).filter((c: any) => c.workspaceId === workspaceId);
  const canvas = canvasId ? store.canvases[canvasId] : canvasList[0];
  if (!canvas) return undefined;
  const cards = Object.values(store.cards).filter((c: any) => c.canvasId === canvas.id);
  const links = Object.values(store.cardLinks).filter((l: any) => l.canvasId === canvas.id);
  return { canvas, groups: [], cards, links };
}

export function devGetCanvasesForWorkspace(workspaceId: number) {
  const store = loadStore();
  return Object.values(store.canvases).filter((c: any) => c.workspaceId === workspaceId);
}

export function devCreateCanvas(workspaceId: number, title: string, description?: string) {
  const store = loadStore();
  const id = nextId(store, "canvases");
  const canvas = { id, workspaceId, title, description: description ?? "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.canvases[id] = canvas;
  saveStore();
  return canvas;
}

// ── CARDS ───────────────────────────────────────────────────────
export function devGetCard(cardId: number) {
  return loadStore().cards[cardId] ?? null;
}

export function devCreateCard(canvasId: number, data: any) {
  const store = loadStore();
  const id = nextId(store, "cards");
  const card = { id, canvasId, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.cards[id] = card;
  saveStore();
  return card;
}

export function devUpdateCard(cardId: number, data: any) {
  const store = loadStore();
  if (!store.cards[cardId]) return null;
  store.cards[cardId] = { ...store.cards[cardId], ...data, updatedAt: new Date().toISOString() };
  saveStore();
  return store.cards[cardId];
}

export function devDeleteCard(cardId: number) {
  const store = loadStore();
  if (!store.cards[cardId]) return false;
  delete store.cards[cardId];
  saveStore();
  return true;
}

export function devGetCardsForCanvas(canvasId: number) {
  return Object.values(loadStore().cards).filter((c: any) => c.canvasId === canvasId);
}

// ── LINKS ───────────────────────────────────────────────────────
export function devCreateLink(canvasId: number, fromCardId: number, toCardId: number, label?: string) {
  const store = loadStore();
  const id = nextId(store, "cardLinks");
  const link = { id, canvasId, fromCardId, toCardId, label: label ?? "", createdAt: new Date().toISOString() };
  store.cardLinks[id] = link;
  saveStore();
  return link;
}

export function devDeleteLink(linkId: number) {
  const store = loadStore();
  delete store.cardLinks[linkId];
  saveStore();
}

// ── SOURCES ─────────────────────────────────────────────────────
export function devListSources(workspaceId: number) {
  return Object.values(loadStore().sources).filter((s: any) => s.workspaceId === workspaceId).sort((a: any, b: any) => b.updatedAt > a.updatedAt ? 1 : -1);
}

export function devCreateSource(workspaceId: number, data: any) {
  const store = loadStore();
  const id = nextId(store, "sources");
  const source = { id, workspaceId, ...data, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.sources[id] = source;
  saveStore();
  return source;
}

// ── COURSES ─────────────────────────────────────────────────────
export function devListCourses(workspaceId: number) {
  return Object.values(loadStore().courses).filter((c: any) => c.workspaceId === workspaceId).sort((a: any, b: any) => b.updatedAt > a.updatedAt ? 1 : -1);
}

export function devGetCourse(courseId: number) {
  const store = loadStore();
  const course = store.courses[courseId];
  if (!course) return null;
  const courseModules = Object.values(store.modules).filter((m: any) => m.courseId === courseId).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
  const withLessons = courseModules.map((mod: any) => {
    const modLessons = Object.values(store.lessons).filter((l: any) => l.moduleId === mod.id).sort((a: any, b: any) => a.orderIndex - b.orderIndex);
    const withObjs = modLessons.map((les: any) => ({
      ...les,
      learningObjectives: Object.values(store.learningObjectives).filter((lo: any) => lo.lessonId === les.id).sort((a: any, b: any) => a.orderIndex - b.orderIndex)
    }));
    return { ...mod, lessons: withObjs };
  });
  return { ...course, modules: withLessons };
}

export function devCreateCourse(workspaceId: number, title: string, sourceText: string) {
  const store = loadStore();
  const id = nextId(store, "courses");
  const course = { id, workspaceId, title, sourceText, status: "draft", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  store.courses[id] = course;
  // Create initial version
  const vId = nextId(store, "courseVersions");
  store.courseVersions[vId] = { id: vId, courseId: id, version: 1, astJson: "{}", changeLog: "Initial creation", createdBy: 1, createdAt: new Date().toISOString() };
  saveStore();
  return { id, insertId: id };
}

export function devUpdateCourse(courseId: number, data: any) {
  const store = loadStore();
  if (!store.courses[courseId]) return;
  store.courses[courseId] = { ...store.courses[courseId], ...data, updatedAt: new Date().toISOString() };
  saveStore();
}

export function devInsertModule(data: any) {
  const store = loadStore();
  const id = nextId(store, "modules");
  store.modules[id] = { id, ...data, createdAt: new Date().toISOString() };
  saveStore();
  return id;
}

export function devInsertLesson(data: any) {
  const store = loadStore();
  const id = nextId(store, "lessons");
  store.lessons[id] = { id, ...data, createdAt: new Date().toISOString() };
  saveStore();
  return id;
}

export function devInsertLearningObjective(data: any) {
  const store = loadStore();
  const id = nextId(store, "learningObjectives");
  store.learningObjectives[id] = { id, ...data };
  saveStore();
  return id;
}

export function devGetLesson(lessonId: number) {
  const store = loadStore();
  const lesson = store.lessons[lessonId];
  if (!lesson) return null;
  const course = store.courses[lesson.courseId ?? 0] ?? null;
  return { lesson, course, objectives: Object.values(store.learningObjectives).filter((lo: any) => lo.lessonId === lessonId) };
}

export function devMarkMastery(userId: number, courseId: number, lessonId: number, score: number) {
  const store = loadStore();
  const key = `${userId}_${lessonId}`;
  store.studentMastery[key] = { userId, courseId, lessonId, score, status: "completed", completedAt: new Date().toISOString() };
  saveStore();
}

export function devGetCompletedLessons(userId: number, courseId: number): number[] {
  const store = loadStore();
  return Object.values(store.studentMastery)
    .filter((m: any) => m.userId === userId && m.courseId === courseId)
    .map((m: any) => m.lessonId);
}
