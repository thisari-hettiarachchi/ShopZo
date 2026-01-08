import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, TrendingUp, Award } from "lucide-react";
import Assets from "../assets/assets";
import axios from "axios";

export default function Hero() {
  const bgImages = [Assets.hero, Assets.hero1, Assets.hero2];
  const rightImages = [Assets.heroSide, Assets.heroSide1, Assets.heroSide3];

  const heroText = [
    {
      title: (
        <>
          Up to <span className="text-white">50% OFF</span> Mega Sale
        </>
      ),
      description:
        "Don’t miss out on our biggest discounts of the season. Grab your favorites before the sale ends.",
    },
    {
      title: (
        <>
          Latest <span className="text-white">Mobile & Smart Devices</span>
        </>
      ),
      description:
        "Shop mobile phones, accessories, smart watches, and tablets with unbeatable prices and premium quality.",
    },
    {
      title: (
        <>
          Beauty & <span className="text-white">Makeup Essentials</span>
        </>
      ),
      description:
        "Discover top makeup brands and beauty must-haves to elevate your everyday look with confidence.",
    },
  ];

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/categories");
        setCategories(res.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const flashSaleProducts = [
    { name: "Wireless Earbuds", price: 499, oldPrice: 699, discount: 29, rating: 4.5 },
    { name: "Smart Watch Pro", price: 899, oldPrice: 1299, discount: 31, rating: 4.8 },
    { name: "Phone Case Set", price: 299, oldPrice: 499, discount: 40, rating: 4.3 },
    { name: "USB-C Cable", price: 199, oldPrice: 299, discount: 33, rating: 4.6 },
    { name: "Power Bank 20K", price: 799, oldPrice: 999, discount: 20, rating: 4.7 },
  ];

  const vendors = [
    { name: "TechZone", rating: 4.9, products: 245 },
    { name: "Fashion Hub", rating: 4.7, products: 189 },
    { name: "BeautyMart", rating: 4.8, products: 312 },
    { name: "GadgetStore", rating: 4.6, products: 456 },
    { name: "HomeEssentials", rating: 4.9, products: 198 },
  ];

  const SLIDE_DURATION = 5000;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const intervalRef = useRef(null);
  const progressRef = useRef(null);

  const startCarousel = () => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);

    intervalRef.current = setInterval(() => {
      nextSlide();
    }, SLIDE_DURATION);

    progressRef.current = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, SLIDE_DURATION / 100);
  };

  const stopCarousel = () => {
    clearInterval(intervalRef.current);
    clearInterval(progressRef.current);
  };

  useEffect(() => {
    if (!isPaused) startCarousel();
    return () => stopCarousel();
  }, [currentIndex, isPaused]);

  const nextSlide = () => {
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % bgImages.length);
  };

  const prevSlide = () => {
    setProgress(0);
    setCurrentIndex((prev) =>
      prev === 0 ? bgImages.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* HERO SECTION */}
      <section
        className="relative w-full h-screen flex justify-start overflow-hidden mt-[-70px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Background Carousel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            className="absolute inset-0 bg-cover bg-center -z-20"
            style={{ backgroundImage: `url(${bgImages[currentIndex]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          />
        </AnimatePresence>

        {/* Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white"
        >
          <ChevronLeft size={28} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-40 bg-black/40 hover:bg-black/60 p-3 rounded-full text-white"
        >
          <ChevronRight size={28} />
        </button>

        {/* Content */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="container mx-auto px-10 lg:px-20 flex flex-col lg:flex-row items-center justify-between text-white"
        >
          {/* Left */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                  {heroText[currentIndex].title}
                </h1>
                <p className="text-lg lg:text-xl max-w-xl text-white/90">
                  {heroText[currentIndex].description}
                </p>
              </motion.div>
            </AnimatePresence>

            <div className="relative inline-block p-0.5 rounded-full overflow-hidden hover:scale-105 transition duration-300 active:scale-100 before:content-[''] before:absolute before:inset-0 before:bg-[conic-gradient(from_0deg,_#FFFFFF,_#FFFFFF,_#FFFFFF)] button-wrapper">
              <button className="relative z-10 bg-[var(--color-primary)] text-white rounded-full px-8 py-3 font-medium text-sm">
                Shop Now
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex-1 flex justify-center lg:justify-end mt-[100px]">
            <AnimatePresence mode="wait">
              <motion.img
                key={currentIndex}
                src={rightImages[currentIndex]}
                alt="Featured"
                className="w-full lg:w-[550px] rounded-lg"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8 }}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      </section>

      
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Shop by Categories
              </h2>
              <p className="text-gray-600">Explore our wide range of products</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group relative overflow-hidden flex flex-col items-center justify-center h-44 bg-white rounded-2xl shadow-md hover:shadow-2xl p-4 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                <div className="text-5xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                  {cat.icon}
                </div>
                <span className="text-sm md:text-base font-semibold text-gray-800 text-center group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLASH SALE SECTION */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-3 rounded-xl">
                <TrendingUp className="text-white" size={28} />
              </div>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Flash Sale
                </h2>
                <p className="text-gray-600">Limited time offers</p>
              </div>
            </div>
            <button className="text-base font-semibold text-amber-600 hover:text-amber-700 px-6 py-2 rounded-full border-2 border-amber-600 hover:bg-amber-50 transition-all">
              View All
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {flashSaleProducts.map((product, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-2xl shadow-md hover:shadow-2xl p-5 cursor-pointer transform transition-all duration-300 hover:-translate-y-2 border border-gray-100"
              >
                <div className="relative w-full h-44 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center text-6xl overflow-hidden">
                  <span className="group-hover:scale-110 transition-transform duration-300">🛍️</span>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    -{product.discount}%
                  </div>
                </div>
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-amber-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm text-gray-600">{product.rating}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xl text-amber-600">Rs. {product.price}</span>
                  <span className="text-sm text-gray-400 line-through">Rs. {product.oldPrice}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED VENDORS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-xl">
              <Award className="text-white" size={28} />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                Featured Vendors
              </h2>
              <p className="text-gray-600">Top-rated sellers you can trust</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {vendors.map((vendor, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-2xl p-6 cursor-pointer hover:-translate-y-2 transition-all duration-300 border border-gray-100"
              >
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-5xl mb-4 group-hover:scale-110 transition-transform shadow-lg">
                  🏪
                  <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" />
                </div>
                <span className="text-gray-900 font-bold text-lg mb-2 text-center group-hover:text-amber-600 transition-colors">
                  {vendor.name}
                </span>
                <div className="flex items-center gap-1 mb-1">
                  <Star size={14} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-700">{vendor.rating}</span>
                </div>
                <span className="text-xs text-gray-500">{vendor.products} Products</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section className="py-16 px-4 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6">
          <div className="group flex-1 h-64 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-white font-bold overflow-hidden relative cursor-pointer transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-4xl mb-2">Mega Sale</div>
              <div className="text-lg font-normal opacity-90">Up to 70% OFF</div>
            </div>
          </div>
          
          <div className="group flex-1 h-64 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-3xl shadow-xl hover:shadow-2xl flex flex-col items-center justify-center text-white font-bold overflow-hidden relative cursor-pointer transform hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-all" />
            <div className="relative z-10 text-center">
              <div className="text-6xl mb-4">✨</div>
              <div className="text-4xl mb-2">New Arrivals</div>
              <div className="text-lg font-normal opacity-90">Fresh Collections</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
