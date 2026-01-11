import { inngest } from "../config/inngest.js";

export const sendOrderEmail = inngest.createFunction(
  { name: "Send Order Email" },
  { event: "order/created" },
  async ({ event }) => {
    console.log("Send email for order:", event.data.orderId);
  }
);
