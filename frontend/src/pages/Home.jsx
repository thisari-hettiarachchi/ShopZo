import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Assets from "../assets/assets";

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

  // Categories with emojis/icons
  const categories = [
    { name: "Electronic Devices", icon: "💻" },
    { name: "Electronic Accessories", icon: "🔌" },
    { name: "Babies & Toys", icon: "🧸" },
    { name: "Groceries & Pets", icon: "🛒" },
    { name: "TV & Home Appliances", icon: "📺" },
    { name: "Health & Beauty", icon: "💄" },
    { name: "Women's Fashion", icon: "👗" },
    { name: "Men's Fashion", icon: "👔" },
    { name: "Home & Lifestyle", icon: "🏡" },
    { name: "Automotive & Motorbike", icon: "🏎️" },
    { name: "Watches & Accessories", icon: "⌚" },
    { name: "Sports & Outdoor", icon: "🏀" },
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

      {/* CATEGORIES SECTION */}
      <section className="bg-[var(--bg-main)] py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[var(--text-primary)]">
            Shop by Categories
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center w-full h-40 bg-[var(--bg-card)] dark:bg-[var(--bg-muted)] rounded-3xl shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105 hover:bg-gradient-to-br hover:from-[var(--color-primary)] hover:to-[var(--color-secondary)]"
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <span className="text-sm md:text-base font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] text-center">
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* FLASH SALE SECTION */}
      <section className="bg-[var(--bg-main)] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-[var(--text-primary)]">
              Flash Sale
            </h2>
            <button className="text-sm md:text-base font-medium text-[var(--color-primary)] hover:underline">
              Shop All
            </button>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-[var(--bg-card)] dark:bg-[var(--bg-muted)] rounded-2xl shadow-lg p-4 cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 flex items-center justify-center text-5xl">
                  🛍️
                </div>
                <h3 className="font-semibold text-[var(--text-primary)] dark:text-[var(--text-secondary)] mb-1">
                  Product Name
                </h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--color-primary)]">Rs. 499</span>
                  <span className="text-sm text-gray-400 line-through">Rs. 699</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>



    </>
  );
}
