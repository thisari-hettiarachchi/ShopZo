import React, { useState, useEffect, useRef } from 'react';
import { Store, Users, ShieldCheck, TrendingUp, Heart, Award, Package, Globe } from 'lucide-react';
import Assets from "../../assets/assets";
import HeroSection from "../../components/sections/about/HeroSection";
import StatsSection from "../../components/sections/about/StatsSection";
import OurStorySection from "../../components/sections/about/OurStorySection";
import ValuesSection from "../../components/sections/about/ValuesSection";
import VisionMission from "../../components/sections/about/VisionMission";
import CTASection from "../../components/sections/about/CTASection";
import WhyChoose from "../../components/sections/about/WhyChoose";

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
  .shopzo-root h1,
  .shopzo-root h2,
  .shopzo-root h3,
  .shopzo-root .display-font { font-family: 'Playfair Display', serif; }
  .shopzo-root .mono-font { font-family: 'Space Mono', monospace; }
`;

function CountUp({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => entry.isIntersecting && setIsVisible(true),
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    let startTime;
    let animationFrame;
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));
      if (percentage < 1) animationFrame = requestAnimationFrame(animate);
      else setCount(end);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutUs() {
  const [hoveredStat, setHoveredStat] = useState(null);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  const stats = [
    { label: 'Active Vendors', value: 10000, suffix: '+', icon: Store },
    { label: 'Happy Customers', value: 500, suffix: 'K+', icon: Users },
    { label: 'Products Listed', value: 1, suffix: 'M+', icon: Package },
    { label: 'Countries Served', value: 50, suffix: '+', icon: Globe }
  ];

  const values = [
    { 
      icon: ShieldCheck, 
      title: 'Trust & Security', 
      description: 'We prioritize secure transactions and protect both buyers and sellers with advanced verification systems.'
    },
    { 
      icon: Heart, 
      title: 'Customer First', 
      description: 'Every decision we make is centered around creating the best experience for our community.'
    },
    { 
      icon: TrendingUp, 
      title: 'Growth & Innovation', 
      description: 'We constantly evolve our platform with cutting-edge features to help vendors thrive.'
    },
    { 
      icon: Award, 
      title: 'Quality Assurance', 
      description: 'We maintain high standards through rigorous vendor vetting and product quality checks.'
    }
  ];

  return (
    <div className="shopzo-root min-h-screen bg-[var(--bg-main)]">
      <style>{FONT_STYLE}</style>
      <HeroSection aboutImage={Assets.about} />
      <StatsSection
        stats={stats}
        CountUp={CountUp}
        hoveredStat={hoveredStat}
        setHoveredStat={setHoveredStat}
      />
      <OurStorySection />
      <ValuesSection
        values={values}
        hoveredValue={hoveredValue}
        setHoveredValue={setHoveredValue}
      />
      <VisionMission
        hoveredTeam={hoveredTeam}
        setHoveredTeam={setHoveredTeam}
      />
      <CTASection />
      <WhyChoose />
    </div>
  );
}