import { real, integer, text, sqliteTable, uniqueIndex, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  openId: text("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: text("email", { length: 320 }),
  loginMethod: text("loginMethod", { length: 64 }),
  role: text({ enum: ["user", "admin"] }).default("user").notNull(),
  theme: text("theme", { length: 16 }).default("system").notNull(),
  language: text("language", { length: 8 }).default("en").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  lastSignedIn: integer("lastSignedIn", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
});

export const workspaces = sqliteTable("workspaces", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  ownerId: integer("ownerId").notNull(),
  name: text("name", { length: 160 }).notNull(),
  slug: text("slug", { length: 160 }).notNull(),
  description: text("description"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ ownerIdx: index("workspace_owner_idx").on(table.ownerId), slugIdx: uniqueIndex("workspace_slug_idx").on(table.slug) }));

export const workspaceMembers = sqliteTable("workspaceMembers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  userId: integer("userId").notNull(),
  role: text({ enum: ["owner", "editor", "viewer"] }).default("viewer").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ memberIdx: uniqueIndex("workspace_member_idx").on(table.workspaceId, table.userId) }));

export const canvases = sqliteTable("canvases", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  title: text("title", { length: 200 }).notNull(),
  description: text("description"),
  viewportX: real("viewportX").default(0).notNull(),
  viewportY: real("viewportY").default(0).notNull(),
  zoom: real("zoom").default(1).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ workspaceIdx: index("canvas_workspace_idx").on(table.workspaceId) }));

export const cardGroups = sqliteTable("cardGroups", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  canvasId: integer("canvasId").notNull(),
  title: text("title", { length: 200 }).notNull(),
  color: text("color", { length: 32 }).notNull(),
  x: real("x").default(0).notNull(),
  y: real("y").default(0).notNull(),
  width: real("width").default(540).notNull(),
  height: real("height").default(360).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ canvasIdx: index("group_canvas_idx").on(table.canvasId) }));

export const cards = sqliteTable("cards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  canvasId: integer("canvasId").notNull(),
  groupId: integer("groupId"),
  sourceId: integer("sourceId"),
  title: text("title", { length: 240 }).notNull(),
  body: text("body").notNull(),
  cardType: text({ enum: ["note", "quote", "question", "insight", "summary"] }).default("note").notNull(),
  accent: text("accent", { length: 32 }).default("mint").notNull(),
  x: real("x").default(0).notNull(),
  y: real("y").default(0).notNull(),
  width: real("width").default(260).notNull(),
  height: real("height").default(180).notNull(),
  pinned: integer("pinned", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ canvasIdx: index("card_canvas_idx").on(table.canvasId), sourceIdx: index("card_source_idx").on(table.sourceId) }));

export const cardLinks = sqliteTable("cardLinks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  canvasId: integer("canvasId").notNull(),
  fromCardId: integer("fromCardId").notNull(),
  toCardId: integer("toCardId").notNull(),
  label: text("label", { length: 120 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ canvasIdx: index("link_canvas_idx").on(table.canvasId) }));

export const notes = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  canvasId: integer("canvasId"),
  title: text("title", { length: 240 }).notNull(),
  body: text("body").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ workspaceIdx: index("note_workspace_idx").on(table.workspaceId) }));

export const sources = sqliteTable("sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  title: text("title", { length: 300 }).notNull(),
  sourceType: text({ enum: ["url", "pdf", "document", "image", "audio", "artifact", "connector"] }).default("url").notNull(),
  url: text("url"),
  storageKey: text("storageKey"),
  mimeType: text("mimeType", { length: 120 }),
  excerpt: text("excerpt"),
  metadata: text("metadata"),
  externalId: text("externalId", { length: 240 }),
  adapter: text("adapter", { length: 80 }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ workspaceIdx: index("source_workspace_idx").on(table.workspaceId), externalIdx: index("source_external_idx").on(table.externalId) }));

export const syncRuns = sqliteTable("syncRuns", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  adapter: text("adapter", { length: 80 }).notNull(),
  status: text({ enum: ["idle", "running", "completed", "failed"] }).default("idle").notNull(),
  itemsProcessed: integer("itemsProcessed").default(0).notNull(),
  errorMessage: text("errorMessage"),
  lastCursor: text("lastCursor"),
  startedAt: integer("startedAt", { mode: "timestamp" }),
  finishedAt: integer("finishedAt", { mode: "timestamp" }),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ workspaceIdx: index("sync_workspace_idx").on(table.workspaceId) }));

export const sourceCards = sqliteTable("sourceCards", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  sourceId: integer("sourceId").notNull(),
  cardId: integer("cardId").notNull(),
  passage: text("passage"),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ sourceCardIdx: uniqueIndex("source_card_idx").on(table.sourceId, table.cardId) }));

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  workspaceId: integer("workspaceId").notNull(),
  title: text("title", { length: 300 }).notNull(),
  description: text("description"),
  sourceText: text("sourceText"),
  status: text({ enum: ["draft", "generating", "generated", "exporting", "exported", "error"] }).default("draft").notNull(),
  astJson: text("astJson"),
  validationErrors: text("validationErrors"),
  scormPackageKey: text("scormPackageKey"),
  version: integer("version").default(1).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ workspaceIdx: index("course_workspace_idx").on(table.workspaceId) }));

export const modules = sqliteTable("modules", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  title: text("title", { length: 300 }).notNull(),
  description: text("description"),
  orderIndex: integer("orderIndex").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ courseIdx: index("module_course_idx").on(table.courseId) }));

export const lessons = sqliteTable("lessons", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  moduleId: integer("moduleId").notNull(),
  title: text("title", { length: 300 }).notNull(),
  description: text("description"),
  orderIndex: integer("orderIndex").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ moduleIdx: index("lesson_module_idx").on(table.moduleId) }));

export const learningObjectives = sqliteTable("learningObjectives", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: integer("lessonId").notNull(),
  loId: text("loId", { length: 64 }).notNull(),
  text: text("text").notNull(),
  bloomVerb: text("bloomVerb", { length: 32 }).notNull(),
  bloomLevel: text("bloomLevel", { length: 32 }).notNull(),
  sourceSpans: text("sourceSpans"),
  prerequisites: text("prerequisites"),
  isVerified: integer("isVerified", { mode: "boolean" }).default(false).notNull(),
  orderIndex: integer("orderIndex").default(0).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ lessonIdx: index("lo_lesson_idx").on(table.lessonId), loIdIdx: uniqueIndex("lo_loid_idx").on(table.loId) }));

export const assessments = sqliteTable("assessments", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  loId: integer("loId").notNull(),
  stem: text("stem").notNull(),
  optionsJson: text("optionsJson").notNull(),
  correctIndex: integer("correctIndex").notNull(),
  bloomAlignment: text("bloomAlignment", { length: 32 }),
  status: text({ enum: ["draft", "reviewed", "approved", "rejected"] }).default("draft").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ loIdx: index("assessment_lo_idx").on(table.loId) }));

export const courseVersions = sqliteTable("courseVersions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseId: integer("courseId").notNull(),
  version: integer("version").notNull(),
  astJson: text("astJson"),
  changeLog: text("changeLog"),
  createdBy: integer("createdBy").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ courseVersionIdx: uniqueIndex("course_version_idx").on(table.courseId, table.version) }));

export const studentMastery = sqliteTable("student_mastery", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull(),
  courseId: integer("courseId").notNull(),
  lessonId: integer("lessonId").notNull(),
  status: text("status").notNull().default("completed"),
  score: integer("score").notNull().default(100),
  completedAt: integer("completedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ 
  userCourseIdx: index("mastery_user_course_idx").on(table.userId, table.courseId),
  lessonIdx: uniqueIndex("mastery_lesson_idx").on(table.userId, table.lessonId) 
}));

export const userPreferences = sqliteTable("userPreferences", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").notNull().unique(),
  fontSize: text("fontSize", { length: 16 }).default("Medium").notNull(),
  editorFont: text("editorFont", { length: 16 }).default("Default").notNull(),
  defaultView: text("defaultView", { length: 32 }).default("Dashboard").notNull(),
  personalizedLearning: integer("personalizedLearning", { mode: "boolean" }).default(true).notNull(),
  aiSuggestions: integer("aiSuggestions", { mode: "boolean" }).default(true).notNull(),
  learningReminders: integer("learningReminders", { mode: "boolean" }).default(true).notNull(),
  weeklyProgress: integer("weeklyProgress", { mode: "boolean" }).default(false).notNull(),
  profileVisibility: integer("profileVisibility", { mode: "boolean" }).default(false).notNull(),
  cloudStorage: integer("cloudStorage", { mode: "boolean" }).default(false).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
  updatedAt: integer("updatedAt", { mode: "timestamp" }).default(sql`(strftime(\'%s\', \'now\'))`).notNull(),
}, table => ({ userIdx: uniqueIndex("pref_user_idx").on(table.userId) }));

export const learnerProfiles = sqliteTable("learnloop_learner_profiles", {
  userId: integer("user_id").primaryKey().notNull(),
  profileJson: text("profile_json").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type Canvas = typeof canvases.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type SyncRun = typeof syncRuns.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Module = typeof modules.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type LearningObjective = typeof learningObjectives.$inferSelect;
export type Assessment = typeof assessments.$inferSelect;
export type CourseVersion = typeof courseVersions.$inferSelect;
export type StudentMastery = typeof studentMastery.$inferSelect;
export type UserPreferences = typeof userPreferences.$inferSelect;
