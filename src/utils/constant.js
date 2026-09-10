export const API_BASE = import.meta.env.DEV
  ? "/"
  : import.meta.env.VITE_API_BASE || "/";
// export const API_BASE = "https://gauravbhongade.online/";
const DEFAULT_IMAGE_API_BASE = "/media";
export const Image_API_BASE = (
  (import.meta.env.VITE_IMAGE_API_BASE || DEFAULT_IMAGE_API_BASE).trim() ||
  DEFAULT_IMAGE_API_BASE
).replace(/\/$/, "");
// export const Image_API_BASE = "https://gauravbhongade.online";

export const normalizeMediaUrl = (value) => {
  if (!value) return "";
  if (/^data:image/i.test(value)) return value;

  const trimmed = String(value).trim();
  if (!trimmed) return "";

  if (/^https?:\/\//i.test(trimmed)) {
    if (/^https?:\/\/media(?=\/|$)/i.test(trimmed)) {
      return trimmed.replace(/^https?:\/\/media(?=\/|$)/i, "");
    }
    return trimmed;
  }

  if (trimmed.startsWith("/media")) return trimmed;

  const normalizedPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${Image_API_BASE}${normalizedPath}`;
};
