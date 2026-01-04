import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Assets from "../assets/assets";

export default function Hero() {
  // Background images
  const bgImages = [Assets.hero, Assets.hero1, Assets.hero2];

  // Right-side images
  const rightImages = [Assets.heroSide, Assets.heroSide1, Assets.heroSide3];

  // Text content
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

  const [currentIndex, setCurrentIndex] = useState(0);

  // Carousel timing (10 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % bgImages.length);
    }, 5000); // ⏱️ 5 seconds
    return () => clearInterval(interval);
  }, [bgImages.length]);

  return (
    <section className="relative w-full h-[85vh] flex items-center justify-center overflow-hidden">
      {/* Background Image Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0 bg-cover bg-center -z-20"
          style={{ backgroundImage: `url(${bgImages[currentIndex]})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Hero Content */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="container mx-auto px-10 lg:px-20 flex flex-col lg:flex-row items-center justify-between text-white"
      >
        {/* Left Content */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-white">
                {heroText[currentIndex].title}
              </h1>

              <p className="text-lg lg:text-xl max-w-xl text-white/90">
                {heroText[currentIndex].description}
              </p>
            </motion.div>
          </AnimatePresence>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="bg-[var(--bg-main)] hover:bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-300">
              Shop Now
            </button>
          </motion.div>
        </div>

        {/* Right Image Carousel */}
        <div className="flex-1 mt-8 lg:mt-0 flex justify-center lg:justify-end relative w-full lg:w-[550px] h-auto">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentIndex}
              src={rightImages[currentIndex]}
              alt="Featured Product"
              className="w-full lg:w-[550px] rounded-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          </AnimatePresence>
        </div>
      </motion.div>
    </section>
  );
}
