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
      vendor: "https://shop-zo-vendor-backend.vercel.app/api",
      client: "https://shop-zo-9o9c.vercel.app/api",
    };
  }

  const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

  return {
    vendor: isLocalhost ? "http://localhost:5001/api" : "https://shop-zo-vendor-backend.vercel.app/api",
    client: isLocalhost ? "http://localhost:5000/api" : "https://shop-zo-9o9c.vercel.app/api",
  };
})();

export const VENDOR_API_BASE_URL = (vendorApiBaseUrl || runtimeFallback.vendor).replace(/\/+$/, "");
export const CLIENT_API_BASE_URL = (clientApiBaseUrl || runtimeFallback.client).replace(/\/+$/, "");
