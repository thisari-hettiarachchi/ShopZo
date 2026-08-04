import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("STRIPE_SECRET_KEY is not set - Stripe checkout will fail until it is configured.");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2024-06-20",
});

export const STRIPE_CURRENCY = (process.env.STRIPE_CURRENCY || "lkr").toLowerCase();
export const CLIENT_FRONTEND_URL = (process.env.CLIENT_FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

export default stripe;
