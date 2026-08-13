import {
  getSubscriberByToken,
  subscribeEmail,
  unsubscribeByEmail,
  unsubscribeByToken,
} from "../services/newsletterService.js";
import {
  sendProductAlertToSubscribers,
  sendWelcomeEmail,
} from "../services/newsletterMailer.js";

export const subscribe = async (req, res) => {
  try {
    const { email, source } = req.body || {};
    const result = await subscribeEmail(email, source || "footer");

    if (!result.created && !result.reactivated) {
      return res.status(200).json({
        message: "You’re already subscribed to the ShopZo newsletter.",
        alreadySubscribed: true,
      });
    }

    // Fire-and-forget welcome email so subscribe stays fast.
    sendWelcomeEmail(result.subscriber).catch((error) => {
      console.error("[newsletter] Welcome email failed:", error.message);
    });

    return res.status(result.created ? 201 : 200).json({
      message: result.reactivated
        ? "Welcome back — your newsletter subscription is active again."
        : "Subscribed successfully. Check your inbox for a welcome email.",
      alreadySubscribed: false,
      reactivated: result.reactivated,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to subscribe",
    });
  }
};

export const unsubscribe = async (req, res) => {
  try {
    const token = req.body?.token || req.query?.token;
    const email = req.body?.email || req.query?.email;

    const result = token
      ? await unsubscribeByToken(token)
      : await unsubscribeByEmail(email);

    return res.status(200).json({
      message: result.alreadyUnsubscribed
        ? "You’re already unsubscribed."
        : "You’ve been unsubscribed. You won’t receive newsletter emails anymore.",
      alreadyUnsubscribed: result.alreadyUnsubscribed,
      email: result.subscriber.email,
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      message: error.message || "Failed to unsubscribe",
    });
  }
};

export const subscriptionStatus = async (req, res) => {
  try {
    const token = req.query?.token;
    const subscriber = await getSubscriberByToken(token);
    if (!subscriber) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    return res.json({
      email: subscriber.email,
      isActive: subscriber.isActive,
      preferences: subscriber.preferences,
      unsubscribedAt: subscriber.unsubscribedAt,
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load subscription status" });
  }
};

export const dispatchProductAlert = async (req, res) => {
  try {
    const { alertType, product, previousPrice } = req.body || {};
    const allowed = new Set(["new_product", "price_drop", "discount"]);

    if (!allowed.has(alertType)) {
      return res.status(400).json({ message: "Invalid alert type" });
    }
    if (!product || !product._id || !product.name) {
      return res.status(400).json({ message: "Product payload is required" });
    }

    const result = await sendProductAlertToSubscribers({
      alertType,
      product,
      previousPrice,
    });

    return res.json({
      message: "Newsletter alert processed",
      result,
    });
  } catch (error) {
    console.error("[newsletter] Alert dispatch failed:", error.message);
    return res.status(500).json({ message: "Failed to dispatch newsletter alert" });
  }
};
