import { useParams, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  ShoppingCart,
  Heart,
  Star,
  Truck,
  MapPin,
  Shield,
  Store,
  RefreshCcw,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
} from "lucide-react";
import {
  fetchProductById,
  fetchProductReviews,
  fetchProducts,
  fetchReviewEligibility,
  postProductReview,
} from "../../api/productApi";
import { API_BASE_URL, authHeaders } from "../../api/base";
import { addToCartApi } from "../../api/cartApi";
import {
  addToWishlistApi,
  removeFromWishlistApi,
  fetchWishlistApi,
} from "../../api/wishlistApi";
import SimilarProductsSection from "../../components/sections/product/SimilarProductsSection";

if (typeof document !== "undefined" && !document.getElementById("shopzo-fonts")) {
  const link = document.createElement("link");
  link.id = "shopzo-fonts";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&family=Space+Mono:wght@400;700&display=swap";
  document.head.appendChild(link);
}

const FONT_STYLE = `
  .shopzo-root { font-family: 'DM Sans', sans-serif; }
  .shopzo-root .display-font { font-family: 'Playfair Display', serif; }
  .shopzo-root .mono-font { font-family: 'Space Mono', monospace; }
  .shopzo-root .section-eyebrow {
    font-family: 'Space Mono', monospace;
    font-size: 12px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--color-primary);
  }
`;

const MIN_ZOOM = 1;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.5;

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = localStorage.getItem("token");

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const chatInputRef = useRef(null);
  const zoomAreaRef = useRef(null);
  const panStartRef = useRef(null);
  const reviewsSectionRef = useRef(null);

  const resetZoom = () => {
    setZoom(MIN_ZOOM);
    setZoomOrigin({ x: 50, y: 50 });
    setIsPanning(false);
    panStartRef.current = null;
  };

  useEffect(() => {
    setQuantity(1);
    setActiveImage(0);
    resetZoom();
    setCanReview(false);
    setSimilarProducts([]);

    fetchProductById(id).then((data) => {
      setProduct(data);
    });
    fetchProductReviews(id).then((data) => setReviews(Array.isArray(data) ? data : []));
  }, [id]);

  useEffect(() => {
    resetZoom();
  }, [activeImage]);

  useEffect(() => {
    if (!token || !id) {
      setCanReview(false);
      return;
    }

    fetchReviewEligibility(id)
      .then((data) => setCanReview(Boolean(data?.canReview)))
      .catch(() => setCanReview(false));
  }, [id, token]);

  useEffect(() => {
    if (!product || searchParams.get("review") !== "1") return;

    const timer = setTimeout(() => {
      reviewsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      const titleInput = reviewsSectionRef.current?.querySelector('input[placeholder="Review title"]');
      titleInput?.focus?.();
    }, 250);

    return () => clearTimeout(timer);
  }, [product, searchParams]);

  useEffect(() => {
    if (!product?.category) return;

    fetchProducts({ category: product.category, limit: 12, sort: "popularity" })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setSimilarProducts(list.filter((item) => item._id !== product._id).slice(0, 8));
      })
      .catch(() => setSimilarProducts([]));
  }, [product]);

  useEffect(() => {
    const loadChat = async () => {
      if (!token || !product?.vendor?._id) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/chat/messages?vendorId=${product.vendor._id}&productId=${product._id}`,
          { headers: authHeaders() }
        );
        if (!res.ok) return;
        const data = await res.json();
        setChatMessages(Array.isArray(data) ? data : []);
      } catch {
        setChatMessages([]);
      }
    };
    loadChat();
  }, [product, token]);

  useEffect(() => {
    if (!token || !product) return;

    fetchWishlistApi(token).then((data) => {
      const exists = data.items?.some((item) => item.product._id === product._id);
      setIsWishlisted(exists);
    });
  }, [product, token]);

  const images = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : product?.images
      ? [product.images]
      : [];
  const mainImage = images[activeImage] || images[0] || "";

  const handleWishlistClick = async () => {
    if (!token) return toast.error("Login to use wishlist");

    try {
      if (isWishlisted) {
        await removeFromWishlistApi(product._id, token);
        setIsWishlisted(false);
      } else {
        await addToWishlistApi(product._id, token);
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!token) return toast.error("You must be logged in to add to cart");

    try {
      const updatedCart = await addToCartApi(product._id, quantity, token);

      if (updatedCart?.message) {
        toast.info(updatedCart.message);
      } else {
        toast.success("Added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add to cart");
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Login to submit a review");
    if (!canReview) {
      return toast.error("Only customers who purchased this product can submit a review");
    }

    const created = await postProductReview(product._id, reviewForm);
    if (created?.message && !created?._id) return toast.error(created.message);

    toast.success("Thanks for your review!");
    const latest = await fetchProductReviews(product._id);
    setReviews(Array.isArray(latest) ? latest : []);
    setReviewForm({ rating: 5, title: "", comment: "" });

    const refreshed = await fetchProductById(product._id);
    if (refreshed?._id) setProduct(refreshed);
  };

  const handleSendChat = async () => {
    if (!token) return toast.error("Login to chat with vendor");
    if (!product?.vendor?._id || !chatInput.trim()) return;

    const res = await fetch(`${API_BASE_URL}/chat/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({
        vendorId: product.vendor._id,
        productId: product._id,
        message: chatInput,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setChatMessages((prev) => [...prev, data]);
      setChatInput("");
    }
  };

  const handleBuyNow = () => {
    if (!token) return toast.error("You must be logged in to checkout");
    navigate("/checkout", {
      state: {
        products: [
          {
            _id: product._id,
            name: product.name,
            price: product.price,
            image: mainImage,
            quantity: quantity,
            vendor: product.vendor,
          },
        ],
        quantity: quantity,
      },
    });
  };

  const showPrevImage = () => {
    if (!images.length) return;
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNextImage = () => {
    if (!images.length) return;
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const clampZoom = (value) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Number(value.toFixed(2))));

  const updateOriginFromPointer = (clientX, clientY) => {
    const el = zoomAreaRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setZoomOrigin({
      x: Math.min(100, Math.max(0, x)),
      y: Math.min(100, Math.max(0, y)),
    });
  };

  const zoomIn = (clientX, clientY) => {
    setZoom((prev) => {
      const next = clampZoom(prev + ZOOM_STEP);
      if (clientX != null && clientY != null && next > MIN_ZOOM) {
        updateOriginFromPointer(clientX, clientY);
      }
      return next;
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      const next = clampZoom(prev - ZOOM_STEP);
      if (next === MIN_ZOOM) {
        setZoomOrigin({ x: 50, y: 50 });
      }
      return next;
    });
  };

  const handleZoomWheel = (e) => {
    if (!mainImage) return;
    e.preventDefault();
    if (e.deltaY < 0) zoomIn(e.clientX, e.clientY);
    else zoomOut();
  };

  const handleZoomDoubleClick = (e) => {
    if (!mainImage) return;
    if (zoom > MIN_ZOOM) resetZoom();
    else zoomIn(e.clientX, e.clientY);
  };

  const handlePanStart = (e) => {
    if (zoom <= MIN_ZOOM) return;
    e.preventDefault();
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      originX: zoomOrigin.x,
      originY: zoomOrigin.y,
    };
  };

  const handlePanMove = (e) => {
    if (!isPanning || !panStartRef.current || !zoomAreaRef.current) return;
    const rect = zoomAreaRef.current.getBoundingClientRect();
    const dx = ((e.clientX - panStartRef.current.x) / rect.width) * 100;
    const dy = ((e.clientY - panStartRef.current.y) / rect.height) * 100;
    setZoomOrigin({
      x: Math.min(100, Math.max(0, panStartRef.current.originX - dx)),
      y: Math.min(100, Math.max(0, panStartRef.current.originY - dy)),
    });
  };

  const handlePanEnd = () => {
    setIsPanning(false);
    panStartRef.current = null;
  };

  if (!product) {
    return <p className="py-10 text-center text-[var(--text-secondary)]">Loading...</p>;
  }

  const reviewDisabled = !token || !canReview;

  return (
    <div className="shopzo-root min-h-screen bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>

      <div className="px-4 py-10">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr_300px]">
          {/* -------- Images -------- */}
          <div className="h-fit rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
            <div className="group relative overflow-hidden rounded-2xl bg-[var(--bg-muted)]">
              <div
                ref={zoomAreaRef}
                className={`aspect-square w-full touch-none select-none ${
                  zoom > MIN_ZOOM
                    ? isPanning
                      ? "cursor-grabbing"
                      : "cursor-grab"
                    : "cursor-zoom-in"
                }`}
                onWheel={handleZoomWheel}
                onDoubleClick={handleZoomDoubleClick}
                onMouseDown={handlePanStart}
                onMouseMove={handlePanMove}
                onMouseUp={handlePanEnd}
                onMouseLeave={handlePanEnd}
              >
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={product.name}
                    draggable={false}
                    className="h-full w-full object-cover will-change-transform"
                    style={{
                      transform: `scale(${zoom})`,
                      transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                      transition: isPanning ? "none" : "transform 0.2s ease-out",
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-[var(--text-muted)]">
                    No image
                  </div>
                )}
              </div>

              {mainImage && (
                <div className="absolute right-3 top-3 z-10 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => zoomIn()}
                    disabled={zoom >= MAX_ZOOM}
                    aria-label="Zoom in"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]/95 text-[var(--text-primary)] shadow-sm backdrop-blur transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={zoomOut}
                    disabled={zoom <= MIN_ZOOM}
                    aria-label="Zoom out"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]/95 text-[var(--text-primary)] shadow-sm backdrop-blur transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={resetZoom}
                    disabled={zoom <= MIN_ZOOM}
                    aria-label="Reset zoom"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]/95 text-[var(--text-primary)] shadow-sm backdrop-blur transition hover:border-[var(--color-primary)]/40 hover:text-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Maximize2 size={15} />
                  </button>
                </div>
              )}

              {zoom > MIN_ZOOM && (
                <div className="absolute left-3 top-3 z-10 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                  {Math.round(zoom * 100)}%
                </div>
              )}

              {images.length > 1 && zoom <= MIN_ZOOM && (
                <>
                  <button
                    type="button"
                    onClick={showPrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]/90 text-[var(--text-primary)] opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={showNextImage}
                    aria-label="Next image"
                    className="absolute right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-card)]/90 text-[var(--text-primary)] opacity-0 shadow-sm backdrop-blur transition group-hover:opacity-100"
                  >
                    <ChevronRight size={18} />
                  </button>
                  <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/35 px-2.5 py-1.5 backdrop-blur-sm">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`Show image ${i + 1}`}
                        onClick={() => setActiveImage(i)}
                        className={`h-1.5 rounded-full transition ${
                          activeImage === i ? "w-4 bg-white" : "w-1.5 bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition sm:h-[72px] sm:w-[72px] ${
                      activeImage === i
                        ? "border-[var(--color-primary)]"
                        : "border-transparent hover:border-[var(--color-primary)]/40"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* -------- Product Info -------- */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-2xl font-bold leading-tight text-[var(--text-primary)]">
                {product.name}
              </h1>
              <button
                onClick={handleWishlistClick}
                className="shrink-0 rounded-full border border-[var(--border)] p-2 transition hover:bg-[var(--bg-muted)]"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isWishlisted
                      ? "fill-red-500 text-red-500"
                      : "text-[var(--color-primary)]"
                  }`}
                />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.round(product.rating || 0)
                      ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-[var(--text-secondary)]">
                ({product.ratingCount ?? reviews.length ?? 0} Ratings)
              </span>
              <span className="mx-2 text-[var(--border)]">|</span>
              <Link
                to={`/products?category=${encodeURIComponent(product.category || "")}`}
                className="cursor-pointer text-sm text-[var(--color-primary)] hover:underline"
              >
                {product.category}
              </Link>
            </div>

            <div className="my-6">
              <p className="text-3xl font-bold text-[var(--color-primary)]">
                Rs. {product.price}
              </p>
              {product.oldPrice && (
                <p className="mt-1 text-sm text-gray-400 line-through">
                  Rs. {product.oldPrice}
                </p>
              )}
            </div>

            <div className="mb-8 flex items-center gap-4">
              <span className="text-sm font-medium text-[var(--text-secondary)]">
                Quantity
              </span>
              <div className="flex items-center rounded-lg border border-[var(--border)]">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="px-4 py-2 text-lg hover:bg-[var(--bg-muted)]"
                >
                  −
                </button>
                <span className="px-4 font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-lg hover:bg-[var(--bg-muted)]"
                >
                  +
                </button>
              </div>
              <span className="text-sm text-gray-400">
                Only {product.stock || 50} items left
              </span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBuyNow}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-100 px-6 py-3 font-semibold text-[var(--color-primary)] transition hover:bg-orange-200"
              >
                Buy Now
              </button>
              <button
                onClick={handleAddToCart}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 py-3 font-semibold text-white shadow-lg shadow-orange-500/30 transition hover:opacity-90"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </button>
            </div>

            <div className="mt-8 border-t border-[var(--border)] pt-6">
              <h3 className="mb-3 font-semibold">Product Description</h3>
              <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                {product.description}
              </p>
            </div>

            <div
              id="reviews"
              ref={reviewsSectionRef}
              className="mt-8 scroll-mt-24 border-t border-[var(--border)] pt-6"
            >
              <h3 className="mb-3 font-semibold">Ratings & Reviews</h3>

              <form
                onSubmit={handleSubmitReview}
                className="mb-5 grid grid-cols-1 gap-2 md:grid-cols-4"
              >
                <select
                  value={reviewForm.rating}
                  disabled={reviewDisabled}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, rating: Number(e.target.value) }))
                  }
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} Stars
                    </option>
                  ))}
                </select>
                <input
                  value={reviewForm.title}
                  disabled={reviewDisabled}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Review title"
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                />
                <input
                  value={reviewForm.comment}
                  disabled={reviewDisabled}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Your feedback"
                  className="rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
                />
                <button
                  type="submit"
                  disabled={reviewDisabled}
                  className="rounded-lg bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-45 md:col-span-4"
                >
                  Submit Review
                </button>
                <p className="text-xs text-[var(--text-secondary)] md:col-span-4">
                  {!token
                    ? "Login and purchase this product to leave a review."
                    : canReview
                      ? "You purchased this item — share your experience."
                      : "Purchase this product to unlock reviews."}
                </p>
              </form>

              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-xl border border-[var(--border)] p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {review.user?.name || "Customer"}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {review.verifiedBuyer ? "Verified Buyer" : "Buyer"}
                      </p>
                    </div>
                    <p className="mt-1 text-xs text-[var(--text-secondary)]">
                      {"★".repeat(review.rating)}
                      {"☆".repeat(Math.max(0, 5 - review.rating))}
                    </p>
                    {review.title && (
                      <p className="mt-1 text-sm font-semibold">{review.title}</p>
                    )}
                    {review.comment && (
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">
                        {review.comment}
                      </p>
                    )}
                    {review.reply?.text && (
                      <div className="mt-2 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] p-2.5">
                        <p className="text-xs font-semibold text-[var(--color-primary)]">
                          Seller response
                        </p>
                        <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                          {review.reply.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-sm text-[var(--text-secondary)]">No reviews yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* -------- Delivery & Vendor -------- */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Delivery
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <MapPin className="shrink-0 text-gray-400" size={20} />
                  <div>
                    <p className="text-sm font-medium">Standard Delivery</p>
                    <p className="text-xs text-gray-500">3 - 5 working days</p>
                  </div>
                  <span className="ml-auto text-sm font-bold">Rs. 286</span>
                </div>

                <div className="flex gap-3 border-t border-gray-100 pt-3">
                  <Truck className="shrink-0 text-gray-400" size={20} />
                  <p className="text-sm font-medium">Cash on Delivery Available</p>
                </div>
              </div>

              <div className="mb-3 mt-6 flex items-center justify-between text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Service
                </span>
              </div>

              <div className="space-y-4">
                <div className="flex gap-3">
                  <RefreshCcw className="shrink-0 text-gray-400" size={20} />
                  <p className="text-sm font-medium">14 Days Free Returns</p>
                </div>
                <div className="flex gap-3 border-t border-gray-100 pt-3">
                  <Shield className="shrink-0 text-gray-400" size={20} />
                  <p className="text-sm font-medium">Warranty Not Available</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-4">
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Sold By
                </span>
              </div>

              <div className="mb-4 flex items-center gap-3">
                <Store className="text-[var(--color-primary)]" size={32} />
                <div>
                  <p className="font-bold text-[var(--text-primary)]">
                    {product.vendor?.storeName || product.vendor?.name || "Vendor"}
                  </p>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-700">
                      {product.rating || "New"} / 5
                    </span>
                    <span>({product.ratingCount ?? 0} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-[var(--border)] p-2">
                <p className="mb-2 text-xs text-[var(--text-secondary)]">
                  Ask this vendor about delivery, color, warranty, and availability.
                </p>
                <div className="flex gap-2">
                  <input
                    ref={chatInputRef}
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--bg-main)] px-2 py-1 text-xs"
                    placeholder="Ask about delivery, color, warranty..."
                  />
                  <button
                    onClick={handleSendChat}
                    className="rounded-lg bg-[var(--color-primary)] px-3 py-1 text-xs font-semibold text-white"
                  >
                    Send
                  </button>
                </div>
                {chatMessages.length > 0 && (
                  <div className="mt-2 max-h-28 space-y-1 overflow-y-auto">
                    {chatMessages.slice(-4).map((msg) => (
                      <p key={msg._id || msg.createdAt} className="text-[11px] text-[var(--text-secondary)]">
                        {msg.message || msg.text}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <SimilarProductsSection
        products={similarProducts}
        category={product.category}
      />
    </div>
  );
}
