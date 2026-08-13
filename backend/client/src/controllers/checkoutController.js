import stripe, {
  STRIPE_CURRENCY,
  CLIENT_FRONTEND_URL,
  toStripeUnitAmount,
  fromStripeUnitAmount,
} from "../config/stripe.js";
import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import Coupon from "../models/Coupon.js";
import Notification from "../models/Notification.js";

const groupItemsByVendor = (items) => {
  const vendorMap = {};
  items.forEach((item) => {
    const vid = String(item.vendor);
    if (!vendorMap[vid]) {
      vendorMap[vid] = { products: [], total: 0 };
    }
    vendorMap[vid].products.push({
      product: item.product,
      quantity: item.qty,
      price: item.price,
    });
    vendorMap[vid].total += item.price * item.qty;
  });
  return vendorMap;
};

const findActiveCoupon = async (code, subtotal) => {
  if (!code) return { coupon: null, discountAmount: 0 };

  const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), isActive: true });
  if (!coupon) return { coupon: null, discountAmount: 0, error: "Invalid or expired coupon code" };

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { coupon: null, discountAmount: 0, error: "Coupon is not active yet" };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { coupon: null, discountAmount: 0, error: "Coupon has expired" };
  }
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { coupon: null, discountAmount: 0, error: "Coupon usage limit reached" };
  }
  if (subtotal < (coupon.minOrderAmount || 0)) {
    return { coupon: null, discountAmount: 0, error: `Minimum order amount of LKR ${coupon.minOrderAmount} required` };
  }

  let discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  if (coupon.maxDiscountAmount) discount = Math.min(discount, coupon.maxDiscountAmount);
  discount = Math.min(discount, subtotal);

  return { coupon, discountAmount: Math.round(discount * 100) / 100 };
};

const resolveVendorId = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value._id || value.id || null;
  return value;
};

// POST /api/checkout/validate-coupon
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    if (!code) return res.status(400).json({ message: "Coupon code is required" });

    const { coupon, discountAmount, error } = await findActiveCoupon(code, Number(subtotal) || 0);
    if (error || !coupon) {
      return res.status(400).json({ message: error || "Invalid coupon code" });
    }

    res.json({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountAmount,
    });
  } catch (error) {
    console.error("Error validating coupon:", error);
    res.status(500).json({ message: "Failed to validate coupon" });
  }
};

// POST /api/checkout/create-session
export const createCheckoutSession = async (req, res) => {
  try {
    const { items, shippingAddress, couponCode } = req.body;
    const deliveryFee = Math.max(Number(req.body.deliveryFee) || 0, 0);

    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({
        message: "Stripe is not configured. Set STRIPE_SECRET_KEY in the client backend .env file.",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to checkout" });
    }
    if (!shippingAddress) {
      return res.status(400).json({ message: "A shipping address is required" });
    }

    const normalizedItems = [];
    for (const item of items) {
      const productId = item.product?._id || item.product;
      const vendorId = resolveVendorId(item.vendor) || resolveVendorId(item.product?.vendor);
      const qty = Number(item.qty) || 1;
      const price = Number(item.price);

      if (!productId) {
        return res.status(400).json({ message: "Each checkout item must include a product id." });
      }
      if (!vendorId) {
        return res.status(400).json({
          message: "One or more cart items are missing a vendor. Please remove them and add the products again.",
        });
      }
      if (!Number.isFinite(price) || price < 0 || qty < 1) {
        return res.status(400).json({ message: "Invalid item price or quantity." });
      }

      normalizedItems.push({
        product: productId,
        vendor: vendorId,
        name: item.name || item.product?.name || "ShopZo product",
        qty,
        price,
      });
    }

    const subtotal = normalizedItems.reduce((sum, item) => sum + item.price * item.qty, 0);
    const { coupon: appliedCoupon, discountAmount } = await findActiveCoupon(couponCode, subtotal);
    const payableBeforeDelivery = Math.max(subtotal - discountAmount, 0);
    const grandTotal = payableBeforeDelivery + deliveryFee;

    if (grandTotal <= 0) {
      return res.status(400).json({ message: "Order total must be greater than zero." });
    }

    const discountRatio = subtotal > 0 ? discountAmount / subtotal : 0;
    const vendorMap = groupItemsByVendor(normalizedItems);
    const vendorIds = Object.keys(vendorMap);
    const deliveryPerVendor = deliveryFee / vendorIds.length;

    const ordersToInsert = vendorIds.map((vid) => {
      const vendorDiscount = Math.round(vendorMap[vid].total * discountRatio * 100) / 100;
      return {
        user: req.user._id,
        vendor: vid,
        products: vendorMap[vid].products,
        total: Math.max(vendorMap[vid].total - vendorDiscount + deliveryPerVendor, 0),
        status: "Pending",
        statusHistory: [{ status: "Placed", at: new Date() }],
        shippingAddress,
        paymentMethod: "stripe",
        paymentStatus: "pending",
        currency: STRIPE_CURRENCY,
        coupon: appliedCoupon ? { code: appliedCoupon.code, discountAmount: vendorDiscount } : undefined,
      };
    });

    const draftOrders = await Order.insertMany(ordersToInsert);

    const lineItems = normalizedItems.map((item) => ({
      price_data: {
        currency: STRIPE_CURRENCY,
        product_data: { name: item.name },
        unit_amount: toStripeUnitAmount(item.price),
      },
      quantity: item.qty,
    }));

    if (deliveryFee > 0) {
      lineItems.push({
        price_data: {
          currency: STRIPE_CURRENCY,
          product_data: { name: "Delivery fee" },
          unit_amount: toStripeUnitAmount(deliveryFee),
        },
        quantity: 1,
      });
    }

    const sessionParams = {
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      success_url: `${CLIENT_FRONTEND_URL}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${CLIENT_FRONTEND_URL}/order/cancel`,
      customer_email: req.user.email,
      metadata: {
        userId: String(req.user._id),
        orderIds: draftOrders.map((order) => String(order._id)).join(","),
        deliveryFee: String(deliveryFee),
      },
    };

    if (discountAmount > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: toStripeUnitAmount(discountAmount),
        currency: STRIPE_CURRENCY,
        duration: "once",
        name: appliedCoupon?.code || "SHOPZO",
      });
      sessionParams.discounts = [{ coupon: stripeCoupon.id }];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    await Order.updateMany(
      { _id: { $in: draftOrders.map((order) => order._id) } },
      { $set: { stripeSessionId: session.id } }
    );

    res.json({ url: session.url, sessionId: session.id });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    const stripeMessage = error?.raw?.message || error?.message;
    res.status(500).json({
      message: stripeMessage
        ? `Failed to start checkout: ${stripeMessage}`
        : "Failed to start checkout",
      code: error?.code,
    });
  }
};

const finalizeOrdersForSession = async (session) => {
  const orderIds = (session.metadata?.orderIds || "").split(",").filter(Boolean);
  if (orderIds.length === 0) return [];

  const orders = await Order.find({ _id: { $in: orderIds } });
  if (orders.length === 0) return [];

  const alreadyPaid = orders.every((order) => order.paymentStatus === "paid");
  if (alreadyPaid) return orders;

  await Order.updateMany(
    { _id: { $in: orderIds } },
    {
      $set: {
        paymentStatus: "paid",
        stripePaymentIntentId: session.payment_intent,
        amountPaid: fromStripeUnitAmount(session.amount_total || 0),
      },
    }
  );

  await Promise.all(
    orders.flatMap((order) =>
      order.products.map((item) =>
        Product.updateOne({ _id: item.product }, { $inc: { stock: -item.quantity } })
      )
    )
  );

  const couponCode = orders.find((order) => order.coupon?.code)?.coupon?.code;
  if (couponCode) {
    await Coupon.updateOne({ code: couponCode }, { $inc: { usedCount: 1 } });
  }

  const userId = session.metadata?.userId;
  if (userId) {
    await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });
    await Notification.create({
      user: userId,
      type: "order",
      title: "Payment successful",
      message: `Your payment was received and your order${orderIds.length > 1 ? "s are" : " is"} now being processed.`,
      metadata: { orderIds },
    });
  }

  return Order.find({ _id: { $in: orderIds } });
};

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    if (event.type === "checkout.session.completed") {
      await finalizeOrdersForSession(event.data.object);
    }
  } catch (error) {
    console.error("Error finalizing order from Stripe webhook:", error);
  }

  res.json({ received: true });
};

export const confirmCheckoutSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);

    if (session.payment_status !== "paid") {
      return res.status(202).json({ status: session.payment_status, message: "Payment not completed yet" });
    }

    const orders = await finalizeOrdersForSession(session);
    res.json({ status: "paid", orders });
  } catch (error) {
    console.error("Error confirming checkout session:", error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
};
