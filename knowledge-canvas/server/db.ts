import { and, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { canvases, cardGroups, cardLinks, cards, sources, syncRuns, users, workspaceMembers, workspaces, type InsertUser } from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  const values: InsertUser = { openId: user.openId, name: user.name ?? null, email: user.email ?? null, loginMethod: user.loginMethod ?? null, lastSignedIn: user.lastSignedIn ?? new Date(), role: user.role ?? (user.openId === ENV.ownerOpenId ? "admin" : "user") };
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: { name: values.name, email: values.email, loginMethod: values.loginMethod, lastSignedIn: values.lastSignedIn, role: values.role } });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return rows[0];
}

export async function ensureWorkspaceForUser(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await db.select().from(workspaces).where(eq(workspaces.ownerId, userId)).orderBy(workspaces.id).limit(1);
  if (existing[0]) return existing[0];
  const slug = `workspace-${userId}`;
  const result = await db.insert(workspaces).values({ ownerId: userId, name: "Research Garden", slug, description: "A quiet place for connected thinking." });
  const workspaceId = Number(result[0].insertId);
  await db.insert(workspaceMembers).values({ workspaceId, userId, role: "owner" });
  const canvasResult = await db.insert(canvases).values({ workspaceId, title: "Learning Garden", description: "A visual map of ideas and sources." });
  const canvasId = Number(canvasResult[0].insertId);
  await db.insert(cards).values([
    { canvasId, title: "Learning is a change in mental models", body: "A working thesis captured from the reading. Keep the wording close to the source, then add your own interpretation below.", cardType: "quote", accent: "mint", x: 120, y: 140, width: 270, height: 188 },
    { canvasId, title: "Models become useful when they connect", body: "A note about relationships: the value of an idea often comes from the bridges it creates between different observations.", cardType: "insight", accent: "lilac", x: 520, y: 320, width: 275, height: 188 },
    { canvasId, title: "What changes when the source is local?", body: "Question for the next pass through the research. Add evidence, counterexamples, and a synthesis card.", cardType: "question", accent: "peach", x: 910, y: 190, width: 270, height: 178 },
  ]);
  return { id: workspaceId, ownerId: userId, name: "Research Garden", slug, description: "A quiet place for connected thinking.", createdAt: new Date(), updatedAt: new Date() };
}

export async function getWorkspaceForUser(userId: number, workspaceId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select({ workspace: workspaces }).from(workspaces).leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id)).where(and(eq(workspaces.id, workspaceId), or(eq(workspaces.ownerId, userId), eq(workspaceMembers.userId, userId)))).limit(1);
  return rows[0]?.workspace;
}

export async function getCanvasSnapshot(userId: number, workspaceId: number, canvasId?: number) {
  const db = await getDb();
  if (!db) return undefined;
  const workspace = await getWorkspaceForUser(userId, workspaceId);
  if (!workspace) return undefined;
  const canvasRows = await db.select().from(canvases).where(and(eq(canvases.workspaceId, workspaceId), canvasId ? eq(canvases.id, canvasId) : undefined)).orderBy(canvases.id).limit(1);
  const canvas = canvasRows[0];
  if (!canvas) return undefined;
  const [groups, canvasCards, links] = await Promise.all([
    db.select().from(cardGroups).where(eq(cardGroups.canvasId, canvas.id)),
    db.select().from(cards).where(eq(cards.canvasId, canvas.id)).orderBy(desc(cards.updatedAt)),
    db.select().from(cardLinks).where(eq(cardLinks.canvasId, canvas.id)),
  ]);
  return { canvas, groups, cards: canvasCards, links };
}

export async function searchWorkspace(userId: number, workspaceId: number, query: string) {
  const db = await getDb();
  if (!db || !(await getWorkspaceForUser(userId, workspaceId))) return { cards: [], sources: [] };
  const term = `%${query}%`;
  const [cardResults, sourceResults] = await Promise.all([
    db.select().from(cards).innerJoin(canvases, eq(cards.canvasId, canvases.id)).where(and(eq(canvases.workspaceId, workspaceId), or(like(cards.title, term), like(cards.body, term)))).limit(20),
    db.select().from(sources).where(and(eq(sources.workspaceId, workspaceId), or(like(sources.title, term), like(sources.excerpt, term)))).limit(20),
  ]);
  return { cards: cardResults.map(row => row.cards), sources: sourceResults };
}

export async function listSources(userId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspaceForUser(userId, workspaceId))) return [];
  return db.select().from(sources).where(eq(sources.workspaceId, workspaceId)).orderBy(desc(sources.updatedAt)).limit(50);
}

export async function listSyncRuns(userId: number, workspaceId: number) {
  const db = await getDb();
  if (!db || !(await getWorkspaceForUser(userId, workspaceId))) return [];
  return db.select().from(syncRuns).where(eq(syncRuns.workspaceId, workspaceId)).orderBy(desc(syncRuns.createdAt)).limit(20);
}

export async function getCanvasForUser(userId: number, canvasId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select({ canvas: canvases }).from(canvases).innerJoin(workspaces, eq(workspaces.id, canvases.workspaceId)).leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id)).where(and(eq(canvases.id, canvasId), or(eq(workspaces.ownerId, userId), eq(workspaceMembers.userId, userId)))).limit(1);
  return rows[0]?.canvas;
}

export async function getCardForUser(userId: number, cardId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select({ card: cards }).from(cards).innerJoin(canvases, eq(canvases.id, cards.canvasId)).innerJoin(workspaces, eq(workspaces.id, canvases.workspaceId)).leftJoin(workspaceMembers, eq(workspaceMembers.workspaceId, workspaces.id)).where(and(eq(cards.id, cardId), or(eq(workspaces.ownerId, userId), eq(workspaceMembers.userId, userId)))).limit(1);
  return rows[0]?.card;
}

export async function canEditWorkspace(userId: number, workspaceId: number) {
  const db = await getDb();
  if (!db) return false;
  const rows = await db.select({ role: workspaceMembers.role }).from(workspaceMembers).innerJoin(workspaces, eq(workspaces.id, workspaceMembers.workspaceId)).where(and(eq(workspaceMembers.workspaceId, workspaceId), eq(workspaceMembers.userId, userId))).limit(1);
  return rows[0]?.role === "owner" || rows[0]?.role === "editor";
}
