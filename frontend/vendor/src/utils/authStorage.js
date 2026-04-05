const TOKEN_KEY = "token";
const VENDOR_KEY = "vendor";

const safeParse = (value) => {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const migrateFromLocalToSession = () => {
  const sessionToken = sessionStorage.getItem(TOKEN_KEY);
  const localToken = localStorage.getItem(TOKEN_KEY);

  if (!sessionToken && localToken) {
    sessionStorage.setItem(TOKEN_KEY, localToken);
  }

  const sessionVendor = sessionStorage.getItem(VENDOR_KEY);
  const localVendor = localStorage.getItem(VENDOR_KEY);

  if (!sessionVendor && localVendor) {
    sessionStorage.setItem(VENDOR_KEY, localVendor);
  }

  // Keep auth tab-scoped so closing the tab logs the vendor out.
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VENDOR_KEY);
};

export const getVendorToken = () => {
  migrateFromLocalToSession();
  return sessionStorage.getItem(TOKEN_KEY) || "";
};

export const readVendorSession = () => {
  migrateFromLocalToSession();
  return safeParse(sessionStorage.getItem(VENDOR_KEY));
};

export const saveVendorSession = ({ token, vendor }) => {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }

  if (vendor) {
    sessionStorage.setItem(VENDOR_KEY, JSON.stringify(vendor));
  } else {
    sessionStorage.removeItem(VENDOR_KEY);
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VENDOR_KEY);
};

export const clearVendorSession = () => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(VENDOR_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(VENDOR_KEY);
};

export const isVendorAuthenticated = () => {
  const token = getVendorToken();
  const vendor = readVendorSession();
  return Boolean(token && vendor);
};
