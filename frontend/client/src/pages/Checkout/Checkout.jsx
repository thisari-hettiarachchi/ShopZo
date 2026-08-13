import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  ShoppingBag,
  MapPin,
  Tag,
  X,
  Loader2,
  Mail,
  Phone,
  User,
  Home,
} from "lucide-react";
import { fetchCart } from "../../api/cartApi";
import { getAddresses } from "../../services/addressService";
import { getUserProfile } from "../../services/userService";
import { validateCoupon } from "../../services/checkoutService";
import { useNavigate, useLocation } from "react-router-dom";

const emptyShipping = {
  fullName: "",
  email: "",
  phone: "",
  region: "",
  addressLine: "",
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allAddresses, setAllAddresses] = useState([]);
  const [addressMode, setAddressMode] = useState("saved"); // saved | custom
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [shipping, setShipping] = useState(emptyShipping);
  const [profileEmail, setProfileEmail] = useState("");

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        if (!token) {
          toast.error("Please login to continue");
          navigate("/auth");
          return;
        }

        let profileName = "";
        let email = "";
        try {
          const profileRes = await getUserProfile();
          profileName = profileRes.data?.name || "";
          email = profileRes.data?.email || "";
          setProfileEmail(email);
        } catch (err) {
          console.error("Profile load error:", err);
        }

        if (location.state?.products && location.state.products.length > 0) {
          const buyNowProducts = location.state.products.map((product) => ({
            _id: product._id,
            product: {
              _id: product._id,
              name: product.name,
              image: product.image,
              images: product.image ? [product.image] : product.images,
            },
            price: product.price,
            qty: product.quantity || 1,
            vendor: product.vendor,
          }));
          setCartItems(buyNowProducts);
        } else {
          const cart = await fetchCart(token);
          setCartItems(cart.items || []);
        }

        const addressRes = await getAddresses();
        const addresses = addressRes.data || [];
        setAllAddresses(addresses);

        const defaultShipping =
          addresses.find((a) => a.isDefaultShipping) || addresses[0] || null;

        if (defaultShipping) {
          setAddressMode("saved");
          setSelectedAddressId(defaultShipping.id || defaultShipping._id);
          setShipping({
            fullName: defaultShipping.fullName || profileName,
            email,
            phone: defaultShipping.phone || "",
            region: defaultShipping.region || "",
            addressLine: defaultShipping.addressLine || "",
          });
        } else {
          setAddressMode("custom");
          setShipping({
            ...emptyShipping,
            fullName: profileName,
            email,
          });
        }
      } catch (err) {
        console.error("Checkout load error:", err);
        toast.error("Failed to load checkout data");
      } finally {
        setLoading(false);
      }
    };

    loadCheckoutData();
  }, [token, location.state, navigate]);

  const itemsTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const deliveryFee = 286;
  const discountAmount = discount?.discountAmount || 0;
  const total = Math.max(itemsTotal + deliveryFee - discountAmount, 0);
  const itemCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);

  const applySavedAddress = (addr) => {
    if (!addr) return;
    setSelectedAddressId(addr.id || addr._id);
    setShipping((prev) => ({
      fullName: addr.fullName || prev.fullName,
      email: profileEmail || prev.email,
      phone: addr.phone || "",
      region: addr.region || "",
      addressLine: addr.addressLine || "",
    }));
  };

  const handleAddressModeChange = (mode) => {
    setAddressMode(mode);
    if (mode === "saved") {
      const selected =
        allAddresses.find((a) => (a.id || a._id) === selectedAddressId) ||
        allAddresses.find((a) => a.isDefaultShipping) ||
        allAddresses[0];
      if (selected) applySavedAddress(selected);
    } else {
      setSelectedAddressId(null);
      setShipping((prev) => ({
        ...prev,
        email: profileEmail || prev.email,
      }));
    }
  };

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") return;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    setIsApplyingPromo(true);
    try {
      const result = await validateCoupon(promoCode.trim(), itemsTotal);
      setDiscount(result);
      setIsPromoApplied(true);
      toast.success(`Coupon "${result.code}" applied - LKR ${result.discountAmount} off`);
    } catch (err) {
      setDiscount(null);
      setIsPromoApplied(false);
      toast.error(err.response?.data?.message || "Invalid coupon code");
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setDiscount(null);
    setIsPromoApplied(false);
  };

  const buildShippingAddress = () => ({
    fullName: shipping.fullName.trim(),
    email: profileEmail || shipping.email,
    phone: shipping.phone.trim(),
    region: shipping.region.trim(),
    addressLine: shipping.addressLine.trim(),
  });

  const validateShipping = () => {
    const address = buildShippingAddress();
    if (!address.fullName) return "Please enter your full name.";
    if (!address.phone) return "Please enter your contact number.";
    if (!address.addressLine) return "Please enter your street address.";
    if (!address.region) return "Please enter your city / region.";
    if (addressMode === "saved" && allAddresses.length > 0 && !selectedAddressId) {
      return "Please select a saved address or switch to a custom address.";
    }
    return null;
  };

  const handleProceed = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    const error = validateShipping();
    if (error) {
      toast.error(error);
      return;
    }

    navigate("/proceedtopay", {
      state: {
        cartItems,
        address: buildShippingAddress(),
        deliveryFee,
        couponCode: isPromoApplied ? discount?.code : null,
        discountAmount,
      },
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[var(--bg-main)]">
        <p className="text-sm text-[var(--text-muted)]">Loading checkout...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--bg-main)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 opacity-80"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 10% -10%, color-mix(in srgb, var(--color-primary) 22%, transparent), transparent 70%), radial-gradient(ellipse 60% 50% at 90% 0%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 65%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_12px_28px_-18px_var(--shadow)]">
            <ShoppingBag className="h-6 w-6 text-[var(--color-primary)]" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              Secure Checkout
            </p>
            <h1
              className="text-3xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Complete Your Order
            </h1>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Add shipping details, review items, then continue to payment.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {/* Shipping information */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--color-primary)]">
                  <User size={18} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Shipping information
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Your email is linked to your account and cannot be changed here.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="Full name"
                  icon={User}
                  name="fullName"
                  value={shipping.fullName}
                  onChange={handleShippingChange}
                  placeholder="Recipient full name"
                />
                <Field
                  label="Contact number"
                  icon={Phone}
                  name="phone"
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  placeholder="07X XXX XXXX"
                />
                <div className="sm:col-span-2">
                  <Field
                    label="Email"
                    icon={Mail}
                    name="email"
                    type="email"
                    value={profileEmail || shipping.email}
                    onChange={handleShippingChange}
                    placeholder="you@example.com"
                    disabled
                    hint="Autofilled from your ShopZo account"
                  />
                </div>
              </div>
            </section>

            {/* Delivery address */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl md:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-hover)] text-[var(--color-primary)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <h2
                    className="text-xl font-semibold text-[var(--text-primary)]"
                    style={{ fontFamily: "'Sora', sans-serif" }}
                  >
                    Delivery address
                  </h2>
                  <p className="text-sm text-[var(--text-muted)]">
                    Use a saved address or enter a custom one for this order.
                  </p>
                </div>
              </div>

              <div className="mb-5 grid gap-3 sm:grid-cols-2">
                <ModeButton
                  active={addressMode === "saved"}
                  onClick={() => handleAddressModeChange("saved")}
                  title="Saved address"
                  subtitle={
                    allAddresses.length
                      ? `${allAddresses.length} saved`
                      : "No saved addresses yet"
                  }
                  disabled={allAddresses.length === 0}
                />
                <ModeButton
                  active={addressMode === "custom"}
                  onClick={() => handleAddressModeChange("custom")}
                  title="Custom address"
                  subtitle="Fill address fields below"
                />
              </div>

              {addressMode === "saved" && allAddresses.length > 0 && (
                <div className="mb-5 space-y-3">
                  {allAddresses.map((addr) => {
                    const id = addr.id || addr._id;
                    const active = selectedAddressId === id;
                    return (
                      <label
                        key={id}
                        className={`flex cursor-pointer gap-3 rounded-2xl border-2 p-4 transition ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--bg-hover)]"
                            : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--border))]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="savedAddress"
                          className="mt-1 accent-[var(--color-primary)]"
                          checked={active}
                          onChange={() => applySavedAddress(addr)}
                        />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-[var(--text-primary)]">
                              {addr.fullName}
                            </p>
                            {addr.isDefaultShipping && (
                              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-[var(--text-secondary)]">{addr.phone}</p>
                          <p className="text-sm text-[var(--text-muted)]">
                            {addr.addressLine}, {addr.region}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}

              {addressMode === "saved" && allAddresses.length === 0 && (
                <div className="mb-5 rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-main)] px-4 py-5 text-sm text-[var(--text-muted)]">
                  You have no saved addresses. Switch to custom address to continue, or add one
                  later in your profile Address Book.
                </div>
              )}

              <div className="grid gap-4">
                <Field
                  label="Street address"
                  icon={Home}
                  name="addressLine"
                  value={shipping.addressLine}
                  onChange={handleShippingChange}
                  placeholder="House no, street, landmark"
                  disabled={addressMode === "saved" && Boolean(selectedAddressId)}
                />
                <Field
                  label="City / Region"
                  icon={MapPin}
                  name="region"
                  value={shipping.region}
                  onChange={handleShippingChange}
                  placeholder="City, province or region"
                  disabled={addressMode === "saved" && Boolean(selectedAddressId)}
                />
                {addressMode === "custom" && (
                  <p className="text-xs text-[var(--text-muted)]">
                    This custom address is used for this order only and is not saved to your
                    address book automatically.
                  </p>
                )}
                {addressMode === "saved" && selectedAddressId && (
                  <p className="text-xs text-[var(--text-muted)]">
                    Address fields are filled from your selection. Switch to custom address to
                    edit them for this order.
                  </p>
                )}
              </div>
            </section>

            {/* Coupon */}
            <section className="rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl">
              <div className="mb-4 flex items-center gap-3">
                <Tag className="text-[var(--color-primary)]" />
                <h2
                  className="text-xl font-semibold text-[var(--text-primary)]"
                  style={{ fontFamily: "'Sora', sans-serif" }}
                >
                  Have a coupon?
                </h2>
              </div>

              {isPromoApplied ? (
                <div className="flex items-center justify-between rounded-xl border border-[var(--color-primary)] bg-[var(--bg-muted)] p-4">
                  <div>
                    <p className="font-semibold text-[var(--color-primary)]">{discount?.code}</p>
                    <p className="text-sm text-[var(--text-secondary)]">
                      You saved LKR {discountAmount.toLocaleString("en-LK")}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[var(--text-muted)] transition hover:text-red-500"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-4 py-3 text-sm uppercase text-[var(--text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:shadow-[var(--ring)]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromo}
                    disabled={isApplyingPromo || !promoCode.trim()}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {isApplyingPromo && <Loader2 size={16} className="animate-spin" />}
                    Apply
                  </button>
                </div>
              )}
            </section>
          </div>

          {/* Order summary */}
          <aside className="h-fit rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-36px_var(--shadow)] backdrop-blur-xl lg:sticky lg:top-24">
            <h2
              className="mb-1 text-xl font-semibold text-[var(--text-primary)]"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Order summary
            </h2>
            <p className="mb-5 text-sm text-[var(--text-muted)]">
              {itemCount} {itemCount === 1 ? "item" : "items"} in this order
            </p>

            {cartItems.length === 0 ? (
              <p className="mb-5 text-sm text-[var(--text-muted)]">No items in cart</p>
            ) : (
              <div className="mb-5 max-h-72 space-y-3 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div
                    key={item._id || item.product?._id}
                    className="flex gap-3 rounded-2xl bg-[var(--bg-main)] p-3"
                  >
                    <img
                      src={item.product?.image || item.product?.images?.[0]}
                      alt={item.product?.name || "Product"}
                      className="h-16 w-16 rounded-xl border border-[var(--border)] bg-[var(--bg-muted)] object-contain"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[var(--text-primary)]">
                        {item.product?.name}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">
                        Qty: {item.qty}
                        {item.vendor?.storeName || item.vendor?.name
                          ? ` · ${item.vendor?.storeName || item.vendor?.name}`
                          : ""}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[var(--color-primary)]">
                        LKR {(item.price * item.qty).toLocaleString("en-LK")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-2 border-t border-[var(--border)] pt-4 text-sm">
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Items total</span>
                <span>LKR {itemsTotal.toLocaleString("en-LK")}</span>
              </div>
              <div className="flex justify-between text-[var(--text-secondary)]">
                <span>Delivery</span>
                <span>LKR {deliveryFee.toLocaleString("en-LK")}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Coupon discount</span>
                  <span>- LKR {discountAmount.toLocaleString("en-LK")}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-[var(--border)] pt-3 text-lg font-bold text-[var(--text-primary)]">
                <span>Total</span>
                <span className="text-[var(--color-primary)]">
                  LKR {total.toLocaleString("en-LK")}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceed}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-3.5 text-sm font-semibold text-white shadow-[0_12px_28px_-14px_rgba(249,115,22,0.55)] transition hover:opacity-90"
            >
              Proceed to Pay
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  icon: Icon,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  hint,
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"
        />
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full rounded-xl border bg-[var(--bg-main)] py-3 pl-11 pr-4 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-muted)] disabled:cursor-not-allowed disabled:opacity-70"
          style={{
            borderColor: disabled ? "var(--border)" : undefined,
          }}
          onFocus={(e) => {
            if (!disabled) {
              e.currentTarget.style.borderColor = "var(--color-primary)";
              e.currentTarget.style.boxShadow = "var(--ring)";
            }
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "var(--border)";
            e.currentTarget.style.boxShadow = "none";
          }}
        />
      </div>
      {hint && <p className="mt-1.5 text-xs text-[var(--text-muted)]">{hint}</p>}
    </div>
  );
}

function ModeButton({ active, onClick, title, subtitle, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-2xl border-2 px-4 py-3 text-left transition disabled:cursor-not-allowed disabled:opacity-50 ${
        active
          ? "border-[var(--color-primary)] bg-[var(--bg-hover)]"
          : "border-[var(--border)] hover:border-[color-mix(in_srgb,var(--color-primary)_40%,var(--border))]"
      }`}
    >
      <p className="text-sm font-semibold text-[var(--text-primary)]">{title}</p>
      <p className="mt-0.5 text-xs text-[var(--text-muted)]">{subtitle}</p>
    </button>
  );
}
