import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { sdk } from "./sdk";
import { getDb } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

// Local development identity used when no database or OAuth session is configured.
const DEV_DEMO_USER: User = {
  id: 1,
  openId: "dev_local_identity",
  name: null,
  email: null,
  loginMethod: "dev",
  role: "user",
  theme: "system",
  language: "en",
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // DEV MODE: If no DATABASE_URL is configured, auto-inject a demo user so
  // all features work locally without OAuth or MySQL.
  if (!process.env.DATABASE_URL) {
    return {
      req: opts.req,
      res: opts.res,
      user: DEV_DEMO_USER,
    };
  }

  let user: User | null = null;
  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
  };
}
