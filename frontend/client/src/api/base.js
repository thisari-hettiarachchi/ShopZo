const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim();

const fallbackApiUrl = (() => {
  if (typeof window === "undefined") {
    return "http://localhost:5000/api";
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "http://localhost:5000/api";
  }

  return `${window.location.origin}/api`;
})();

export const API_BASE_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/+$/, "");

if (import.meta.env.PROD && !configuredApiUrl) {
  console.warn(
    `Missing VITE_API_URL (or VITE_API_BASE_URL). Falling back to ${fallbackApiUrl}.`,
  );
}

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
