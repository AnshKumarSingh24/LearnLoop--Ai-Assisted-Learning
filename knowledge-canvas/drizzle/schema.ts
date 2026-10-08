import { boolean, float, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const workspaces = mysqlTable("workspaces", {
  id: int("id").autoincrement().primaryKey(),
  ownerId: int("ownerId").notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  slug: varchar("slug", { length: 160 }).notNull(),
  description: text("description"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ ownerIdx: index("workspace_owner_idx").on(table.ownerId), slugIdx: uniqueIndex("workspace_slug_idx").on(table.slug) }));

export const workspaceMembers = mysqlTable("workspaceMembers", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["owner", "editor", "viewer"]).default("viewer").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ memberIdx: uniqueIndex("workspace_member_idx").on(table.workspaceId, table.userId) }));

export const canvases = mysqlTable("canvases", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  viewportX: float("viewportX").default(0).notNull(),
  viewportY: float("viewportY").default(0).notNull(),
  zoom: float("zoom").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ workspaceIdx: index("canvas_workspace_idx").on(table.workspaceId) }));

export const cardGroups = mysqlTable("cardGroups", {
  id: int("id").autoincrement().primaryKey(),
  canvasId: int("canvasId").notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  color: varchar("color", { length: 32 }).notNull(),
  x: float("x").default(0).notNull(),
  y: float("y").default(0).notNull(),
  width: float("width").default(540).notNull(),
  height: float("height").default(360).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ canvasIdx: index("group_canvas_idx").on(table.canvasId) }));

export const cards = mysqlTable("cards", {
  id: int("id").autoincrement().primaryKey(),
  canvasId: int("canvasId").notNull(),
  groupId: int("groupId"),
  sourceId: int("sourceId"),
  title: varchar("title", { length: 240 }).notNull(),
  body: text("body").notNull(),
  cardType: mysqlEnum("cardType", ["note", "quote", "question", "insight", "summary"]).default("note").notNull(),
  accent: varchar("accent", { length: 32 }).default("mint").notNull(),
  x: float("x").default(0).notNull(),
  y: float("y").default(0).notNull(),
  width: float("width").default(260).notNull(),
  height: float("height").default(180).notNull(),
  pinned: boolean("pinned").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ canvasIdx: index("card_canvas_idx").on(table.canvasId), sourceIdx: index("card_source_idx").on(table.sourceId) }));

export const cardLinks = mysqlTable("cardLinks", {
  id: int("id").autoincrement().primaryKey(),
  canvasId: int("canvasId").notNull(),
  fromCardId: int("fromCardId").notNull(),
  toCardId: int("toCardId").notNull(),
  label: varchar("label", { length: 120 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ canvasIdx: index("link_canvas_idx").on(table.canvasId) }));

export const notes = mysqlTable("notes", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  canvasId: int("canvasId"),
  title: varchar("title", { length: 240 }).notNull(),
  body: text("body").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ workspaceIdx: index("note_workspace_idx").on(table.workspaceId) }));

export const sources = mysqlTable("sources", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  sourceType: mysqlEnum("sourceType", ["url", "pdf", "document", "image", "audio", "artifact", "connector"]).default("url").notNull(),
  url: text("url"),
  storageKey: text("storageKey"),
  mimeType: varchar("mimeType", { length: 120 }),
  excerpt: text("excerpt"),
  metadata: text("metadata"),
  externalId: varchar("externalId", { length: 240 }),
  adapter: varchar("adapter", { length: 80 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => ({ workspaceIdx: index("source_workspace_idx").on(table.workspaceId), externalIdx: index("source_external_idx").on(table.externalId) }));

export const syncRuns = mysqlTable("syncRuns", {
  id: int("id").autoincrement().primaryKey(),
  workspaceId: int("workspaceId").notNull(),
  adapter: varchar("adapter", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["idle", "running", "completed", "failed"]).default("idle").notNull(),
  itemsProcessed: int("itemsProcessed").default(0).notNull(),
  errorMessage: text("errorMessage"),
  lastCursor: text("lastCursor"),
  startedAt: timestamp("startedAt"),
  finishedAt: timestamp("finishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ workspaceIdx: index("sync_workspace_idx").on(table.workspaceId) }));

export const sourceCards = mysqlTable("sourceCards", {
  id: int("id").autoincrement().primaryKey(),
  sourceId: int("sourceId").notNull(),
  cardId: int("cardId").notNull(),
  passage: text("passage"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => ({ sourceCardIdx: uniqueIndex("source_card_idx").on(table.sourceId, table.cardId) }));

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Workspace = typeof workspaces.$inferSelect;
export type Canvas = typeof canvases.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type Source = typeof sources.$inferSelect;
export type SyncRun = typeof syncRuns.$inferSelect;
