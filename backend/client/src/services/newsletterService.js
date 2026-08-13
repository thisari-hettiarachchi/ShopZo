import crypto from "crypto";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email = "") => String(email).trim().toLowerCase();

const makeError = (message, status = 400) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export const subscribeEmail = async (rawEmail, source = "footer") => {
  const email = normalizeEmail(rawEmail);
  if (!EMAIL_RE.test(email)) {
    throw makeError("Please enter a valid email address.");
  }

  const existing = await NewsletterSubscriber.findOne({ email });
  if (existing?.isActive) {
    return { subscriber: existing, created: false, reactivated: false };
  }

  if (existing) {
    existing.isActive = true;
    existing.unsubscribedAt = null;
    existing.subscribedAt = new Date();
    existing.source = source || existing.source || "footer";
    if (!existing.unsubscribeToken) {
      existing.unsubscribeToken = crypto.randomBytes(32).toString("hex");
    }
    await existing.save();
    return { subscriber: existing, created: false, reactivated: true };
  }

  const subscriber = await NewsletterSubscriber.create({
    email,
    source: source || "footer",
    unsubscribeToken: crypto.randomBytes(32).toString("hex"),
  });

  return { subscriber, created: true, reactivated: false };
};

export const unsubscribeByToken = async (token) => {
  if (!token || typeof token !== "string") {
    throw makeError("Unsubscribe token is required.");
  }

  const subscriber = await NewsletterSubscriber.findOne({ unsubscribeToken: token });
  if (!subscriber) {
    throw makeError("Subscription not found.", 404);
  }

  if (!subscriber.isActive) {
    return { subscriber, alreadyUnsubscribed: true };
  }

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();
  return { subscriber, alreadyUnsubscribed: false };
};

export const unsubscribeByEmail = async (rawEmail) => {
  const email = normalizeEmail(rawEmail);
  if (!EMAIL_RE.test(email)) {
    throw makeError("Please enter a valid email address.");
  }

  const subscriber = await NewsletterSubscriber.findOne({ email });
  if (!subscriber) {
    throw makeError("No newsletter subscription found for that email.", 404);
  }

  if (!subscriber.isActive) {
    return { subscriber, alreadyUnsubscribed: true };
  }

  subscriber.isActive = false;
  subscriber.unsubscribedAt = new Date();
  await subscriber.save();
  return { subscriber, alreadyUnsubscribed: false };
};

export const getSubscriberByToken = async (token) => {
  if (!token) return null;
  return NewsletterSubscriber.findOne({ unsubscribeToken: token }).lean();
};

const preferenceFieldForAlert = (alertType) => {
  if (alertType === "new_product") return "preferences.newProducts";
  if (alertType === "price_drop") return "preferences.priceDrops";
  if (alertType === "discount") return "preferences.discounts";
  return null;
};

export const getActiveSubscribersForAlert = async (alertType) => {
  const preferenceField = preferenceFieldForAlert(alertType);
  const query = { isActive: true };
  if (preferenceField) {
    query[preferenceField] = { $ne: false };
  }
  return NewsletterSubscriber.find(query)
    .select("email unsubscribeToken preferences")
    .lean();
};
