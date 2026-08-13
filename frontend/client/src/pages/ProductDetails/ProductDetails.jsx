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
  Plus,
  X,
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
import { formatVariantLabel, normalizeColors, getImagesForColor, toCartColor } from "../../utils/productVariants";

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
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [isPanning, setIsPanning] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
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
    setSelectedSize("");
    setSelectedColor(null);
    setActiveImage(0);
    resetZoom();
    setCanReview(false);
    setSimilarProducts([]);

    fetchProductById(id).then((data) => {
      setProduct(data);
      const colors = normalizeColors(data?.colors);
      const sizes = Array.isArray(data?.sizes) ? data.sizes : [];
      setSelectedColor(colors[0] || null);
      setSelectedSize(sizes[0] || "");
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
      if (token && canReview) {
        setIsReviewModalOpen(true);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [product, searchParams, token, canReview]);

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

  const images = getImagesForColor(product, selectedColor);
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

  const availableSizes = Array.isArray(product?.sizes) ? product.sizes : [];
  const availableColors = normalizeColors(product?.colors);

  const selectColor = (color) => {
    setSelectedColor(color);
    setActiveImage(0);
    resetZoom();
  };

  const ensureVariantSelection = () => {
    if (availableSizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return false;
    }
    if (availableColors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!token) return toast.error("You must be logged in to add to cart");
    if (!ensureVariantSelection()) return;

    try {
      const updatedCart = await addToCartApi(product._id, quantity, token, {
        selectedSize,
        selectedColor: toCartColor(selectedColor),
      });

      if (updatedCart?.message && !updatedCart?.items) {
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

  const openReviewModal = () => {
    if (!token) {
      toast.error("Login to submit a review");
      return;
    }
    if (!canReview) {
      toast.error("Only customers who purchased this product can submit a review");
      return;
    }
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    if (isSubmittingReview) return;
    setIsReviewModalOpen(false);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token) return toast.error("Login to submit a review");
    if (!canReview) {
      return toast.error("Only customers who purchased this product can submit a review");
    }
    if (!reviewForm.title.trim() && !reviewForm.comment.trim()) {
      return toast.error("Please add a title or comment for your review");
    }

    setIsSubmittingReview(true);
    try {
      const created = await postProductReview(product._id, reviewForm);
      if (created?.message && !created?._id) {
        toast.error(created.message);
        return;
      }

      toast.success("Thanks for your review!");
      const latest = await fetchProductReviews(product._id);
      setReviews(Array.isArray(latest) ? latest : []);
      setReviewForm({ rating: 5, title: "", comment: "" });
      setIsReviewModalOpen(false);

      const refreshed = await fetchProductById(product._id);
      if (refreshed?._id) setProduct(refreshed);
      setCanReview(false);
    } catch (error) {
      toast.error(error?.message || "Failed to submit review");
    } finally {
      setIsSubmittingReview(false);
    }
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
    if (!ensureVariantSelection()) return;
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
            selectedSize,
            selectedColor: toCartColor(selectedColor),
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

  const ratingCount = Number(product.ratingCount ?? reviews.length ?? 0);
  const averageRating =
    Number(product.rating) ||
    (reviews.length
      ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
      : 0);
  const ratingBreakdown = [1, 2, 3, 4, 5].reduce((acc, stars) => {
    acc[stars] = reviews.filter((review) => Number(review.rating) === stars).length;
    return acc;
  }, {});

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
                    i < Math.round(averageRating || 0)
                      ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <a
                href="#reviews"
                className="ml-2 text-sm text-[var(--text-secondary)] transition hover:text-[var(--color-primary)] hover:underline"
              >
                ({ratingCount} Ratings)
              </a>
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
                LKR {product.price}
              </p>
              {product.oldPrice && (
                <p className="mt-1 text-sm text-gray-400 line-through">
                  LKR {product.oldPrice}
                </p>
              )}
            </div>

            {availableColors.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-[var(--text-secondary)]">
                  Color{selectedColor ? `: ${selectedColor.name}` : ""}
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {availableColors.map((color) => {
                    const active =
                      selectedColor?.hex?.toLowerCase() === color.hex.toLowerCase();
                    const thumb = color.images?.[0];
                    return (
                      <button
                        key={`${color.name}-${color.hex}`}
                        type="button"
                        title={color.name}
                        onClick={() => selectColor(color)}
                        className={`relative h-9 w-9 overflow-hidden rounded-full border-2 transition ${
                          active
                            ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/35"
                            : "border-[var(--border)] hover:border-[var(--color-primary)]/40"
                        }`}
                        style={
                          thumb
                            ? {
                                backgroundImage: `url(${thumb})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }
                            : { backgroundColor: color.hex }
                        }
                        aria-label={color.name}
                        aria-pressed={active}
                      >
                        {active && (
                          <span
                            className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${
                              !thumb &&
                              (color.hex.toLowerCase() === "#ffffff" ||
                                color.hex.toLowerCase() === "#d6c3a5")
                                ? "text-gray-800"
                                : "text-white"
                            } ${thumb ? "bg-black/25" : ""}`}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {availableSizes.length > 0 && (
              <div className="mb-6">
                <p className="mb-2 text-sm font-medium text-[var(--text-secondary)]">Size</p>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-11 rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          active
                            ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                            : "border-[var(--border)] bg-[var(--bg-main)] text-[var(--text-primary)] hover:border-[var(--color-primary)]/50"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

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
                  <span className="ml-auto text-sm font-bold">LKR 286</span>
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
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => {
                      const vendorId = product.vendor?._id || product.vendor?.id;
                      if (!vendorId) return toast.error("Vendor profile unavailable");
                      navigate(`/vendors/${vendorId}`);
                    }}
                    className="text-left font-bold text-[var(--text-primary)] transition hover:text-[var(--color-primary)]"
                  >
                    {product.vendor?.storeName || product.vendor?.name || "Vendor"}
                  </button>
                  <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="font-semibold text-gray-700">
                      {product.rating || "New"} / 5
                    </span>
                    <span>({product.ratingCount ?? 0} reviews)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const vendorId = product.vendor?._id || product.vendor?.id;
                      if (!vendorId) return toast.error("Vendor profile unavailable");
                      navigate(`/vendors/${vendorId}`);
                    }}
                    className="mt-2 text-xs font-semibold text-[var(--color-primary)] hover:underline"
                  >
                    Visit store
                  </button>
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

        {/* -------- Ratings & Reviews (separate section under product) -------- */}
        <section
          id="reviews"
          ref={reviewsSectionRef}
          className="mx-auto mt-10 max-w-7xl scroll-mt-24"
        >
          <div className="overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_24px_60px_-40px_var(--shadow)]">
            <div className="border-b border-[var(--border)] px-6 py-6 md:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="section-eyebrow">Customer feedback</p>
                  <h2 className="display-font mt-2 text-3xl font-bold tracking-tight text-[var(--text-primary)] md:text-4xl">
                    Ratings & Reviews
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm text-[var(--text-secondary)]">
                    See what buyers think about this product, and share your experience after purchase.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openReviewModal}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-4 py-2.5 text-sm font-bold text-white shadow-[0_14px_28px_-16px_var(--shadow)] transition hover:opacity-90"
                >
                  <Plus size={16} />
                  Review
                </button>
              </div>
            </div>

            <div className="grid gap-8 px-6 py-8 md:grid-cols-[260px_1fr] md:px-8">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--text-secondary)]">
                  Overall rating
                </p>
                <p className="mt-3 text-5xl font-black tracking-tight text-[var(--text-primary)]">
                  {Number(averageRating || 0).toFixed(1)}
                </p>
                <div className="mt-2 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.round(averageRating || 0)
                          ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-sm text-[var(--text-secondary)]">
                  Based on {ratingCount} {ratingCount === 1 ? "rating" : "ratings"}
                </p>

                <div className="mt-5 space-y-2">
                  {[5, 4, 3, 2, 1].map((stars) => {
                    const count = ratingBreakdown[stars] || 0;
                    const pct = ratingCount > 0 ? Math.round((count / ratingCount) * 100) : 0;
                    return (
                      <div key={stars} className="flex items-center gap-2 text-xs">
                        <span className="w-6 tabular-nums text-[var(--text-secondary)]">{stars}★</span>
                        <div className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--bg-muted)]">
                          <div
                            className="h-full rounded-full bg-[var(--color-primary)]"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right tabular-nums text-[var(--text-secondary)]">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {reviews.map((review) => (
                  <div
                    key={review._id}
                    className="rounded-2xl border border-[var(--border)] bg-[var(--bg-main)] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-semibold">
                        {review.user?.name || "Customer"}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">
                        {review.verifiedBuyer ? "Verified Buyer" : "Buyer"}
                      </p>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < review.rating
                              ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    {review.title && (
                      <p className="mt-2 text-sm font-semibold">{review.title}</p>
                    )}
                    {review.comment && (
                      <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">
                        {review.comment}
                      </p>
                    )}
                    {review.reply?.text && (
                      <div className="mt-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3">
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
                  <div className="rounded-2xl border border-dashed border-[var(--border)] px-4 py-10 text-center">
                    <p className="text-sm font-medium text-[var(--text-primary)]">No reviews yet</p>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      Be the first to rate this product after purchasing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {isReviewModalOpen && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={closeReviewModal}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="w-full max-w-lg overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.45)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-primary)]">
                  Verified purchase
                </p>
                <h3 id="review-modal-title" className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                  Write a review
                </h3>
              </div>
              <button
                type="button"
                onClick={closeReviewModal}
                disabled={isSubmittingReview}
                className="rounded-full border border-[var(--border)] p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-50"
                aria-label="Close review modal"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 px-5 py-5">
              <p className="text-sm text-[var(--text-secondary)]">
                Reviewing <span className="font-semibold text-[var(--text-primary)]">{product.name}</span>
              </p>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Rating</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      type="button"
                      onClick={() => setReviewForm((prev) => ({ ...prev, rating: stars }))}
                      className="rounded-lg p-1 transition hover:bg-[var(--bg-muted)]"
                      aria-label={`${stars} stars`}
                    >
                      <Star
                        className={`h-6 w-6 ${
                          stars <= reviewForm.rating
                            ? "fill-[var(--color-primary)] text-[var(--color-primary)]"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Title</span>
                <input
                  value={reviewForm.title}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Review title"
                  className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium">Your feedback</span>
                <textarea
                  value={reviewForm.comment}
                  onChange={(e) =>
                    setReviewForm((prev) => ({ ...prev, comment: e.target.value }))
                  }
                  placeholder="Share what you liked or what could be better..."
                  rows={4}
                  className="w-full resize-none rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3 py-2.5 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>

              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReviewModal}
                  disabled={isSubmittingReview}
                  className="h-11 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--bg-muted)] disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="h-11 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-5 text-sm font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingReview ? "Submitting…" : "Submit review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <SimilarProductsSection
        products={similarProducts}
        category={product.category}
      />
    </div>
  );
}
