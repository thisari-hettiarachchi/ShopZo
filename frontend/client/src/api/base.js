const configuredApiUrl =
  import.meta.env.VITE_API_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim();
const fallbackApiUrl = "http://localhost:5000/api";

export const API_BASE_URL = (configuredApiUrl || fallbackApiUrl).replace(/\/+$/, "");

if (import.meta.env.PROD && !configuredApiUrl) {
  console.warn(
    "Missing VITE_API_URL (or VITE_API_BASE_URL). Falling back to localhost API URL.",
  );
}

export const authHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
