import { Resend } from "resend";

let resendClient = null;

export const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;
  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }
  return resendClient;
};

export const getResendFrom = () =>
  process.env.RESEND_FROM_EMAIL?.trim() || "ShopZo <onboarding@resend.dev>";

export const isResendConfigured = () => Boolean(process.env.RESEND_API_KEY?.trim());
