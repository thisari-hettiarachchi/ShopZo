import dotenv from "dotenv";
import Stripe from "stripe";

// Ensure env is loaded even when this module is imported before server.js calls dotenv.config()
dotenv.config();

const secretKey = (process.env.STRIPE_SECRET_KEY || "").replace(/^["']|["']$/g, "").trim();

if (!secretKey) {
  console.warn("STRIPE_SECRET_KEY is not set - Stripe checkout will fail until it is configured.");
}

const stripe = new Stripe(secretKey || "sk_test_placeholder");

export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY || "lkr")
  .replace(/^["']|["']$/g, "")
  .trim()
  .toLowerCase();

export const CLIENT_FRONTEND_URL = (
  process.env.CLIENT_FRONTEND_URL ||
  process.env.FRONTEND_URL ||
  "http://localhost:5173"
)
  .replace(/^["']|["']$/g, "")
  .replace(/\/+$/, "");

/** Stripe zero-decimal currencies (amount already in smallest unit). */
const ZERO_DECIMAL_CURRENCIES = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
]);

export const toStripeUnitAmount = (amount) => {
  const value = Number(amount);
  if (!Number.isFinite(value) || value < 0) return 0;
  if (ZERO_DECIMAL_CURRENCIES.has(STRIPE_CURRENCY)) {
    return Math.round(value);
  }
  return Math.round(value * 100);
};

export const fromStripeUnitAmount = (amount) => {
  const value = Number(amount) || 0;
  if (ZERO_DECIMAL_CURRENCIES.has(STRIPE_CURRENCY)) return value;
  return value / 100;
};

export default stripe;
