import axios from "axios";
import { useEffect, useState } from "react";
import HeroSection from "../../components/sections/home/HeroSection";
import CategoriesSection from "../../components/sections/home/CategoriesSection";
import FlashSaleSection from "../../components/sections/home/FlashSaleSection";
import PromoSection from "../../components/sections/home/PromoSection";
import FeaturedVendorsSection from "../../components/sections/home/FeaturedVendorsSection";
import JustForYouSection from "../../components/sections/home/JustForYouSection";

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
  const [flashSaleProducts, setFlashSaleProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [justForYou, setJustForYou] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/categories").then((response) => setCategories(response.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products/flash-sale").then((response) => setFlashSaleProducts(response.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/vendors").then((response) => setVendors(response.data)).catch(console.error);
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then((response) => setJustForYou(response.data)).catch(console.error);
  }, []);

  return (
    <div className="shopzo-root bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FlashSaleSection products={flashSaleProducts} />
      <PromoSection />
      <FeaturedVendorsSection vendors={vendors} />
      <JustForYouSection products={justForYou} />
    </div>
  );
}
