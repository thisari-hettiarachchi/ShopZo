import React, { useState, useEffect, useRef } from 'react';
import { Store, Users, ShieldCheck, TrendingUp, Heart, Award, Package, Globe, ArrowRight, Sparkles } from 'lucide-react';

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
    { label: 'Active Vendors', value: 10000, suffix: '+', icon: Store, color: 'text-yellow-500' },
    { label: 'Happy Customers', value: 500, suffix: 'K+', icon: Users, color: 'text-orange-400' },
    { label: 'Products Listed', value: 1, suffix: 'M+', icon: Package, color: 'text-yellow-400' },
    { label: 'Countries Served', value: 50, suffix: '+', icon: Globe, color: 'text-yellow-500' }
  ];

  const values = [
    { icon: ShieldCheck, title: 'Trust & Security', description: 'We prioritize secure transactions and protect both buyers and sellers with advanced verification systems.', gradient: 'bg-gradient-to-r from-yellow-500 to-orange-400' },
    { icon: Heart, title: 'Customer First', description: 'Every decision we make is centered around creating the best experience for our community.', gradient: 'bg-gradient-to-r from-orange-400 to-yellow-400' },
    { icon: TrendingUp, title: 'Growth & Innovation', description: 'We constantly evolve our platform with cutting-edge features to help vendors thrive.', gradient: 'bg-gradient-to-r from-yellow-400 to-yellow-500' },
    { icon: Award, title: 'Quality Assurance', description: 'We maintain high standards through rigorous vendor vetting and product quality checks.', gradient: 'bg-gradient-to-r from-yellow-500 to-yellow-200' }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', initial: 'SJ' },
    { name: 'Michael Chen', role: 'CTO', initial: 'MC' },
    { name: 'Emily Rodriguez', role: 'Head of Vendor Relations', initial: 'ER' },
    { name: 'David Kim', role: 'Head of Operations', initial: 'DK' }
  ];

  return (
    <div className="min-h-screen bg-yellow-50">
      {/* Hero Section */}
      <div className="relative py-20 bg-gradient-to-r from-yellow-500 to-orange-400 overflow-hidden text-center">
        <div className="absolute top-1/5 right-10 opacity-10 animate-bounce-slow">
          <Sparkles size={100} className="text-white" />
        </div>
        <div className="absolute bottom-1/5 left-10 opacity-10 animate-bounce-slower">
          <Store size={80} className="text-white" />
        </div>
        <div className="max-w-6xl mx-auto px-5">
          <h1 className="text-5xl font-bold text-white animate-slide-up">About Our Marketplace</h1>
          <p className="text-lg text-white/90 mt-5 max-w-xl mx-auto animate-slide-up animate-delay-200">
            Connecting vendors and customers worldwide through a trusted, innovative platform built on transparency and excellence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto -mt-10 px-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setHoveredStat(idx)}
            onMouseLeave={() => setHoveredStat(null)}
            className={`relative p-8 rounded-xl text-center shadow-md border-2 transition-all duration-300 ease-in-out cursor-pointer
                        ${hoveredStat === idx ? 'shadow-xl -translate-y-2 scale-105 border-yellow-400' : 'border-yellow-200'}`}
          >
            <div className={`inline-block mb-4 transform transition-transform duration-500 ${hoveredStat === idx ? 'scale-125 rotate-180' : ''}`}>
              <stat.icon size={40} className={`${hoveredStat === idx ? stat.color : 'text-yellow-500'} mx-auto`} />
            </div>
            <div className={`text-3xl font-bold mb-1 transition-transform duration-300 ${hoveredStat === idx ? 'scale-110' : ''}`}>
              <CountUp end={stat.value} suffix={stat.suffix} />
            </div>
            <p className="text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto my-20 px-5 grid gap-10 md:grid-cols-2 items-center">
        <div>
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400 mb-5">Our Story</h2>
          <p className="text-gray-600 mb-3">
            Founded in 2020, our platform was born from a simple vision: to create a marketplace where vendors of all sizes could thrive and customers could discover unique products from around the world.
          </p>
          <p className="text-gray-600 mb-3">
            What started as a small team passionate about e-commerce has grown into a global community of thousands of vendors and millions of satisfied customers.
          </p>
          <p className="text-gray-600">
            Today, we continue to innovate and expand, always keeping our core mission at heart: empowering entrepreneurs and delighting customers with exceptional shopping experiences.
          </p>
        </div>
        <div className="bg-yellow-100 p-16 rounded-xl text-center border-2 border-yellow-200 animate-bounce-slow">
          <Store size={100} className="text-yellow-500 mx-auto mb-5" />
          <h3 className="text-2xl font-bold mb-2 text-gray-800">Building Trust Daily</h3>
          <p className="text-gray-600">Every transaction strengthens our community</p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-yellow-100 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-[var(--color-primary)] to-orange-400 text-center mb-12">Our Core Values</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 ">
            {values.map((value, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`relative p-8 rounded-xl border-2 shadow-md transition-all duration-400 ease-in-out cursor-pointer overflow-hidden bg-[var(--bg-muted)]
                            ${hoveredValue === idx ? 'shadow-xl -translate-y-2' : ''}`}
              >
                {hoveredValue === idx && (
                  <div className={`absolute top-0 left-0 w-full h-1 ${value.gradient} animate-shimmer`} />
                )}
                <div className={`inline-block mb-5 transform transition-transform duration-400 ${hoveredValue === idx ? 'scale-125 rotate-6' : ''}`}>
                  <value.icon size={40} className="text-yellow-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className={`text-gray-600 transition-transform duration-300 ${hoveredValue === idx ? 'translate-x-1' : ''}`}>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-6xl mx-auto my-20 px-5">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-400 text-center mb-12">
          Meet Our Leadership Team
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {team.map((member, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredTeam(idx)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative p-8 rounded-xl text-center border-2 shadow-md transition-all duration-400 ease-in-out cursor-pointer
                          ${hoveredTeam === idx ? 'shadow-xl -translate-y-2 scale-105' : ''}`}
            >
              <div className={`w-24 h-24 rounded-full bg-yellow-100 mx-auto mb-5 flex items-center justify-center text-2xl font-bold text-yellow-500 border-2
                               ${hoveredTeam === idx ? 'scale-115 rotate-3 shadow-lg border-orange-400' : 'border-yellow-500'}`}>
                {member.initial}
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-2 transition-transform duration-300 ${hoveredTeam === idx ? 'scale-105' : ''}`}>{member.name}</h3>
              <p className="text-gray-600 text-sm">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-yellow-100 py-16 mt-10 text-center">
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-gray-800 mb-5">Join Our Growing Community</h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a vendor looking to expand your business or a customer seeking quality products, we're here to help you succeed.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="flex items-center gap-2 px-8 py-4 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-400 text-white font-semibold shadow-md transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
              Become a Vendor <ArrowRight size={18} />
            </button>
            <button className="flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-yellow-500 text-yellow-500 font-semibold transition-all duration-300 hover:bg-yellow-500 hover:text-white hover:-translate-y-1">
              Start Shopping <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
