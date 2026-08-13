import { getResendClient, getResendFrom, isResendConfigured } from "../config/resend.js";
import { getActiveSubscribersForAlert } from "./newsletterService.js";

const CLIENT_FRONTEND_URL = () =>
  (process.env.CLIENT_FRONTEND_URL || process.env.FRONTEND_URL || "http://localhost:5173").replace(
    /\/+$/,
    ""
  );

const formatLkr = (value) =>
  `LKR ${Number(value || 0).toLocaleString("en-LK", { maximumFractionDigits: 2 })}`;

const productUrl = (productId) => `${CLIENT_FRONTEND_URL()}/products/${productId}`;

const unsubscribeUrl = (token) =>
  `${CLIENT_FRONTEND_URL()}/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;

const baseLayout = ({ title, preview, bodyHtml, token }) => `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f6f7f9;font-family:Arial,Helvetica,sans-serif;color:#111827;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">${preview}</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e5e7eb;">
            <tr>
              <td style="padding:22px 24px;background:linear-gradient(90deg,#f97316,#fb923c);color:#ffffff;">
                <div style="font-size:13px;letter-spacing:0.16em;text-transform:uppercase;opacity:0.9;">ShopZo</div>
                <h1 style="margin:8px 0 0;font-size:22px;line-height:1.25;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:16px 24px 24px;border-top:1px solid #f3f4f6;color:#6b7280;font-size:12px;line-height:1.5;">
                You’re receiving this because you subscribed to ShopZo alerts.
                <br />
                <a href="${unsubscribeUrl(token)}" style="color:#f97316;">Unsubscribe anytime</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

const productCardHtml = (product, extraLines = []) => {
  const image = product?.images?.[0];
  const lines = extraLines
    .filter(Boolean)
    .map((line) => `<p style="margin:0 0 8px;color:#4b5563;font-size:14px;">${line}</p>`)
    .join("");

  return `
    ${
      image
        ? `<img src="${image}" alt="${product.name || "Product"}" style="width:100%;max-height:260px;object-fit:cover;border-radius:14px;margin-bottom:16px;" />`
        : ""
    }
    <h2 style="margin:0 0 8px;font-size:20px;color:#111827;">${product.name || "New product"}</h2>
    ${lines}
    <p style="margin:0 0 18px;color:#111827;font-size:18px;font-weight:700;">${formatLkr(product.price)}</p>
    <a href="${productUrl(product._id)}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-weight:700;font-size:14px;">
      View product
    </a>
  `;
};

const alertCopy = (alertType, product, meta = {}) => {
  if (alertType === "new_product") {
    return {
      subject: `New on ShopZo: ${product.name}`,
      title: "New product alert",
      preview: `${product.name} just landed on ShopZo.`,
      lines: [product.category ? `Category: ${product.category}` : "", "Be first to check it out."],
    };
  }

  if (alertType === "price_drop") {
    return {
      subject: `Price drop: ${product.name}`,
      title: "Price drop alert",
      preview: `${product.name} just got cheaper on ShopZo.`,
      lines: [
        meta.previousPrice != null ? `Was ${formatLkr(meta.previousPrice)}` : "",
        `Now ${formatLkr(product.price)}`,
      ],
    };
  }

  return {
    subject: `Discount alert: ${product.name}`,
    title: "Discount alert",
    preview: `${product.name} has a new discount on ShopZo.`,
    lines: [
      Number(product.discount || 0) > 0 ? `${product.discount}% off right now` : "A special deal is live",
      product.isFlashSale ? "Included in Flash Sale" : "",
      meta.previousPrice != null && Number(meta.previousPrice) > Number(product.price)
        ? `Was ${formatLkr(meta.previousPrice)} · Now ${formatLkr(product.price)}`
        : "",
    ],
  };
};

const sendEmail = async ({ to, subject, html }) => {
  const resend = getResendClient();
  if (!resend) {
    console.warn("[newsletter] RESEND_API_KEY missing — skipped email to", to);
    return { skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: getResendFrom(),
    to: [to],
    subject,
    html,
  });

  if (error) {
    throw new Error(error.message || "Resend failed to send email");
  }

  return data;
};

export const sendWelcomeEmail = async (subscriber) => {
  if (!subscriber?.email) return;
  const html = baseLayout({
    title: "You’re subscribed",
    preview: "Welcome to ShopZo newsletter alerts.",
    token: subscriber.unsubscribeToken,
    bodyHtml: `
      <p style="margin:0 0 12px;font-size:15px;line-height:1.6;color:#374151;">
        Thanks for joining ShopZo alerts. We’ll email you about new products, price drops, and discounts.
      </p>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#374151;">
        You can unsubscribe anytime from any email footer.
      </p>
    `,
  });

  return sendEmail({
    to: subscriber.email,
    subject: "Welcome to ShopZo alerts",
    html,
  });
};

const chunk = (items, size) => {
  const groups = [];
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size));
  }
  return groups;
};

export const sendProductAlertToSubscribers = async ({
  alertType,
  product,
  previousPrice = null,
}) => {
  if (!product?._id || !product?.name) {
    return { sent: 0, failed: 0, skipped: true, reason: "invalid_product" };
  }

  if (!isResendConfigured()) {
    console.warn("[newsletter] RESEND_API_KEY missing — alert not sent");
    return { sent: 0, failed: 0, skipped: true, reason: "resend_not_configured" };
  }

  const subscribers = await getActiveSubscribersForAlert(alertType);
  if (subscribers.length === 0) {
    return { sent: 0, failed: 0, skipped: true, reason: "no_subscribers" };
  }

  const copy = alertCopy(alertType, product, { previousPrice });
  let sent = 0;
  let failed = 0;

  for (const group of chunk(subscribers, 8)) {
    await Promise.all(
      group.map(async (subscriber) => {
        try {
          const html = baseLayout({
            title: copy.title,
            preview: copy.preview,
            token: subscriber.unsubscribeToken,
            bodyHtml: productCardHtml(product, copy.lines),
          });
          await sendEmail({
            to: subscriber.email,
            subject: copy.subject,
            html,
          });
          sent += 1;
        } catch (error) {
          failed += 1;
          console.error(`[newsletter] Failed to email ${subscriber.email}:`, error.message);
        }
      })
    );
  }

  return { sent, failed, skipped: false, alertType, subscriberCount: subscribers.length };
};
