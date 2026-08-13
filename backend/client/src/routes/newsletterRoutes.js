import express from "express";
import {
  dispatchProductAlert,
  subscribe,
  subscriptionStatus,
  unsubscribe,
} from "../controllers/newsletterController.js";

const router = express.Router();

const requireInternalSecret = (req, res, next) => {
  const expected = process.env.NEWSLETTER_INTERNAL_SECRET?.trim();
  if (!expected) {
    return res.status(503).json({
      message: "NEWSLETTER_INTERNAL_SECRET is not configured on the client backend.",
    });
  }

  const provided = req.headers["x-newsletter-secret"];
  if (!provided || provided !== expected) {
    return res.status(401).json({ message: "Unauthorized newsletter alert request" });
  }

  return next();
};

router.post("/subscribe", subscribe);
router.post("/unsubscribe", unsubscribe);
router.get("/unsubscribe", unsubscribe);
router.get("/status", subscriptionStatus);
router.post("/internal/alerts", requireInternalSecret, dispatchProductAlert);

export default router;
