import fs from "node:fs";
import path from "node:path";

const PROFILE_FILE = path.join(process.cwd(), ".learner-profiles.json");
type Profile = Record<string, unknown>;

function readProfiles(): Record<string, Profile> {
  if (!fs.existsSync(PROFILE_FILE)) return {};
  const parsed: unknown = JSON.parse(fs.readFileSync(PROFILE_FILE, "utf8"));
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("The local learner profile store is invalid.");
  }
  return parsed as Record<string, Profile>;
}

export function devGetLearnerProfile(userId: number): Profile | undefined {
  return readProfiles()[String(userId)];
}

export function devSaveLearnerProfile(userId: number, patch: Profile): Profile {
  const profiles = readProfiles();
  const current = profiles[String(userId)] ?? {};
  const now = new Date().toISOString();
  const updated = { ...current, createdAt: current.createdAt ?? now, ...patch, updatedAt: now };
  profiles[String(userId)] = updated;
  fs.writeFileSync(PROFILE_FILE, JSON.stringify(profiles, null, 2), "utf8");
  return updated;
}
