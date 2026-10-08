import { COOKIE_NAME } from "@shared/const";

export function captureApiHeaders(): Record<string, string> {
  try {
    const rawCookie = sessionStorage.getItem("manus-cookie");
    const prefix = `${COOKIE_NAME}=`;
    const cookie = rawCookie?.split(";").find(part => part.trim().startsWith(prefix));
    const token = cookie?.trim().slice(prefix.length);
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

export function captureApiUrl(path: string): string {
  const baseUrl = import.meta.env.VITE_CAPTURE_API_URL || "http://localhost:8080";
  return `${baseUrl}${path}`;
}
