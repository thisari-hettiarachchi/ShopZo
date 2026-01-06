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
    <section className="relative w-full h-screen flex justify-start overflow-hidden mt-[-70px]"
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

          <button className="bg-[var(--bg-main)] hover:bg-[var(--color-secondary)] text-[var(--color-primary)] font-semibold px-8 py-3 rounded-lg shadow-lg transition">
            Shop Now
          </button>
        </div>

        {/* Right Image */}
        <div className="flex-1 flex justify-center lg:justify-end  mt-[100px]">
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
  );
}
