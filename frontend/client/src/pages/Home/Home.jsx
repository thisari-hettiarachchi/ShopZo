import axios from "axios";
import { useEffect, useState } from "react";
import HeroSection from "../../components/sections/home/HeroSection";
import CategoriesSection from "../../components/sections/home/CategoriesSection";
import NewArrivalsSection from "../../components/sections/home/NewArrivalsSection";
import BestSellersSection from "../../components/sections/home/BestSellersSection";
import PromoSection from "../../components/sections/home/PromoSection";
import ValuePropsSection from "../../components/sections/home/ValuePropsSection";
import JustForYouSection from "../../components/sections/home/JustForYouSection";
import { API_BASE_URL } from "../../api/base";

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

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [promoBanners, setPromoBanners] = useState([]);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/categories`).then((response) => setCategories(response.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/products`, { params: { limit: 100 } })
      .then((response) => setProducts(Array.isArray(response.data) ? response.data : []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/banners`).then((response) => setPromoBanners(response.data)).catch(console.error);
  }, []);

  return (
    <div className="shopzo-root bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <NewArrivalsSection products={products} />
      <BestSellersSection products={products} />
      <PromoSection banners={promoBanners} />
      <ValuePropsSection />
      <JustForYouSection products={products} />
    </div>
  );
}
