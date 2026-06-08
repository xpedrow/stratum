import DOMPurify from "dompurify";

export type SanitizeMode = "text" | "html";

export function sanitize(raw: string, mode: SanitizeMode = "text"): string {
  if (!raw) return "";

  if (mode === "text") {
    return DOMPurify.sanitize(raw, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
  }

  return DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: ["b", "i", "em", "strong", "br"],
    ALLOWED_ATTR: [],
    FORBID_ATTR: ["onerror", "onmouseover", "onclick", "onload", "onfocus"],
  });
}

export function sanitizeList(items: string[]): string[] {
  return items.map((item) => sanitize(item));
}
