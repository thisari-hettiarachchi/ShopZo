const vendorApiBaseUrl =
  import.meta.env.VITE_VENDOR_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_BASE_URL?.trim() ||
  import.meta.env.VITE_API_URL?.trim();

const clientApiBaseUrl =
  import.meta.env.VITE_CLIENT_API_BASE_URL?.trim() ||
  import.meta.env.VITE_CLIENT_API_URL?.trim();

const runtimeFallback = (() => {
  if (typeof window === "undefined") {
    return {
      vendor: "http://localhost:5001/api",
      client: "http://localhost:5000/api",
    };
  }

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  return {
    vendor: isLocalhost ? "http://localhost:5001/api" : `${window.location.origin}/api`,
    client: isLocalhost ? "http://localhost:5000/api" : `${window.location.origin}/api`,
  };
})();

export const VENDOR_API_BASE_URL = (vendorApiBaseUrl || runtimeFallback.vendor).replace(/\/+$/, "");
export const CLIENT_API_BASE_URL = (clientApiBaseUrl || runtimeFallback.client).replace(/\/+$/, "");
