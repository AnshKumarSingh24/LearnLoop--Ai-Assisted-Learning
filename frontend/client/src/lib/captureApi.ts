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

export function getCaptureApiBaseUrl(): string {
  if (import.meta.env.VITE_CAPTURE_API_URL) {
    return import.meta.env.VITE_CAPTURE_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1") {
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  return "http://localhost:8080";
}

export const CAPTURE_API_URL = getCaptureApiBaseUrl();

export function captureApiUrl(path: string): string {
  const baseUrl = getCaptureApiBaseUrl();
  return `${baseUrl}${path}`;
}

