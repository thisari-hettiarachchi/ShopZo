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
    { 
      icon: ShieldCheck, 
      title: 'Trust & Security', 
      description: 'We prioritize secure transactions and protect both buyers and sellers with advanced verification systems.',
      gradient: 'bg-gradient-to-br from-yellow-500 to-orange-400'
    },
    { 
      icon: Heart, 
      title: 'Customer First', 
      description: 'Every decision we make is centered around creating the best experience for our community.',
      gradient: 'bg-gradient-to-br from-orange-400 to-yellow-400'
    },
    { 
      icon: TrendingUp, 
      title: 'Growth & Innovation', 
      description: 'We constantly evolve our platform with cutting-edge features to help vendors thrive.',
      gradient: 'bg-gradient-to-br from-yellow-400 to-yellow-500'
    },
    { 
      icon: Award, 
      title: 'Quality Assurance', 
      description: 'We maintain high standards through rigorous vendor vetting and product quality checks.',
      gradient: 'bg-gradient-to-br from-yellow-500 to-amber-400'
    }
  ];

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', initial: 'SJ', color: 'from-yellow-400 to-orange-500' },
    { name: 'Michael Chen', role: 'CTO', initial: 'MC', color: 'from-orange-400 to-yellow-500' },
    { name: 'Emily Rodriguez', role: 'Head of Vendor Relations', initial: 'ER', color: 'from-yellow-500 to-amber-400' },
    { name: 'David Kim', role: 'Head of Operations', initial: 'DK', color: 'from-amber-400 to-yellow-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-amber-50">
      {/* Hero Section with Image */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-32 px-6">
        <div 
          className="absolute inset-0 opacity-30 bg-cover bg-center"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1920")',
            backgroundBlendMode: 'overlay'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-600/20 via-orange-600/20 to-amber-600/20"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-full mb-8 shadow-2xl border border-white/20">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="font-semibold">Trusted by thousands worldwide</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-8 text-white drop-shadow-2xl tracking-tight">
            About Our Marketplace
          </h1>
          <p className="text-2xl text-white/95 leading-relaxed max-w-3xl mx-auto font-light">
            Connecting vendors and customers worldwide through a trusted, innovative platform built on transparency and excellence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredStat(idx)}
              onMouseLeave={() => setHoveredStat(null)}
              className={`relative p-8 rounded-2xl text-center transition-all duration-500 ease-out cursor-pointer group overflow-hidden ${
                hoveredStat === idx 
                  ? 'shadow-2xl -translate-y-3 scale-105 bg-white border-2 border-yellow-400' 
                  : 'shadow-xl bg-white border-2 border-transparent hover:shadow-2xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-400 to-amber-500 opacity-0 transition-opacity duration-500 ${hoveredStat === idx ? 'opacity-10' : ''}`}></div>
              
              <stat.icon 
                className={`w-14 h-14 mx-auto mb-5 transition-all duration-500 ${stat.color} ${
                  hoveredStat === idx ? 'scale-125 rotate-12 drop-shadow-lg' : 'group-hover:scale-110'
                }`} 
              />
              <div className="text-5xl font-black mb-3 bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-bold text-gray-600 uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 block">Our Journey</span>
              <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent leading-tight">
                Our Story
              </h2>
            </div>
            <div className="space-y-5 text-lg text-gray-700 leading-relaxed">
              <p className="text-xl font-semibold text-gray-800">
                Founded in 2020, our platform was born from a simple vision: to create a marketplace where vendors of all sizes could thrive and customers could discover unique products from around the world.
              </p>
              <p>
                What started as a small team passionate about e-commerce has grown into a global community of thousands of vendors and millions of satisfied customers.
              </p>
              <p>
                Today, we continue to innovate and expand, always keeping our core mission at heart: empowering entrepreneurs and delighting customers with exceptional shopping experiences.
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <div className="flex-1 p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                <div className="text-3xl font-black text-orange-600">2020</div>
                <div className="text-sm text-gray-600 font-medium">Founded</div>
              </div>
              <div className="flex-1 p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border-2 border-orange-200">
                <div className="text-3xl font-black text-yellow-600">500K+</div>
                <div className="text-sm text-gray-600 font-medium">Customers</div>
              </div>
              <div className="flex-1 p-4 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                <div className="text-3xl font-black text-amber-600">50+</div>
                <div className="text-sm text-gray-600 font-medium">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl transform -rotate-3 opacity-20"></div>
            <div className="relative bg-gradient-to-br from-white to-amber-50 p-12 rounded-3xl shadow-2xl border-4 border-white">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-500 rounded-full mb-6 shadow-2xl">
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </div>
                <h3 className="text-3xl font-black text-gray-800 mb-4">Building Trust Daily</h3>
                <p className="text-gray-700 text-lg font-medium">Every transaction strengthens our community</p>
                <div className="mt-8 pt-8 border-t-2 border-gray-200">
                  <div className="flex justify-around">
                    <div>
                      <div className="text-2xl font-black text-orange-600">4.9★</div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-yellow-600">99%</div>
                      <div className="text-xs text-gray-600">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-amber-600">24/7</div>
                      <div className="text-xs text-gray-600">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gradient-to-b from-white via-amber-50 to-yellow-50 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 block">What Drives Us</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Our Core Values
            </h2>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`relative p-10 rounded-3xl border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-white group ${
                  hoveredValue === idx ? 'shadow-2xl -translate-y-2 border-yellow-400 scale-[1.02]' : 'shadow-lg border-gray-100 hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 ${value.gradient} opacity-0 transition-opacity duration-500 ${hoveredValue === idx ? 'opacity-10' : ''}`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 ${value.gradient} rounded-2xl mb-6 shadow-lg transition-all duration-500 ${
                    hoveredValue === idx ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                  }`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-gray-800">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-28 px-6">
        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-orange-300 rounded-full blur-2xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-amber-300 rounded-full blur-2xl opacity-30 animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-yellow-400 rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-orange-200 rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 block">Our Direction</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Vision & Mission
            </h2>
            <p className="text-gray-700 text-xl max-w-2xl mx-auto">
              Guiding principles that drive our innovation and commitment
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Vision */}
            <div
              onMouseEnter={() => setHoveredTeam(0)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative p-10 rounded-3xl bg-white border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 0 ? 'shadow-2xl -translate-y-2 scale-[1.02] border-yellow-400' : 'shadow-lg border-yellow-100 hover:shadow-xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 opacity-0 transition-opacity duration-500 ${hoveredTeam === 0 ? 'opacity-10' : ''}`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl mb-6 shadow-lg transition-all duration-500 ${
                  hoveredTeam === 0 ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                }`}>
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-800">Our Vision</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To become the world's most trusted and innovative marketplace, where entrepreneurs and customers connect seamlessly across borders, cultures, and communities. We envision a future where every vendor has the tools to succeed and every customer finds exactly what they're looking for.
                </p>
              </div>
            </div>

            {/* Mission */}
            <div
              onMouseEnter={() => setHoveredTeam(1)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative p-10 rounded-3xl bg-white border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 1 ? 'shadow-2xl -translate-y-2 scale-[1.02] border-orange-400' : 'shadow-lg border-orange-100 hover:shadow-xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 opacity-0 transition-opacity duration-500 ${hoveredTeam === 1 ? 'opacity-10' : ''}`}></div>
              
              <div className="relative z-10">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl mb-6 shadow-lg transition-all duration-500 ${
                  hoveredTeam === 1 ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                }`}>
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-800">Our Mission</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  To empower vendors with cutting-edge technology and support while providing customers with a secure, diverse shopping experience. We're committed to building a sustainable ecosystem that benefits all stakeholders through transparency, innovation, and exceptional service.
                </p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            33% {
              transform: translateY(-20px) translateX(10px);
            }
            66% {
              transform: translateY(10px) translateX(-10px);
            }
          }
          
          @keyframes float-delayed {
            0%, 100% {
              transform: translateY(0) translateX(0);
            }
            33% {
              transform: translateY(15px) translateX(-15px);
            }
            66% {
              transform: translateY(-10px) translateX(15px);
            }
          }
          
          @keyframes float-slow {
            0%, 100% {
              transform: translateY(0) translateX(0) scale(1);
            }
            50% {
              transform: translateY(-30px) translateX(20px) scale(1.1);
            }
          }
          
          .animate-float {
            animation: float 8s ease-in-out infinite;
          }
          
          .animate-float-delayed {
            animation: float-delayed 10s ease-in-out infinite;
          }
          
          .animate-float-slow {
            animation: float-slow 12s ease-in-out infinite;
          }
        `}</style>
      </div>

      {/* Why Choose Us Section */}
      <div className="py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-orange-500 uppercase tracking-widest mb-4 block">What Sets Us Apart</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-600 via-orange-500 to-amber-600 bg-clip-text text-transparent">
              Why Choose Us
            </h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
              We go beyond being just a marketplace—we're your partner in success with unmatched features and support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Advanced Security</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Bank-level encryption and fraud protection systems keep every transaction safe and secure.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>SSL encryption for all transactions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Real-time fraud detection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Secure payment gateway</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Users className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">24/7 Support</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Our dedicated support team is always available to help you succeed and resolve any issues.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Live chat support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Dedicated account managers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Multi-language assistance</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Globe className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Global Reach</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Connect with customers and vendors from over 50 countries worldwide.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>International shipping options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Multi-currency support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Localized marketplace</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Easy Management</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Intuitive dashboard and tools make selling and buying effortless for everyone.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Simple product listing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Inventory management</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Analytics & insights</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-yellow-400 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Growth Tools</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Powerful marketing and analytics tools to help vendors scale their business.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>SEO optimization tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Promotional campaigns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Performance reports</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-500 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
              <div className="relative p-10 rounded-3xl bg-white border-2 border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Award className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-gray-800">Quality Control</h3>
                <p className="text-gray-600 leading-relaxed text-lg mb-6">
                  Rigorous quality checks ensure only the best products and vendors on our platform.
                </p>
                <ul className="space-y-3 text-gray-600">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Vendor verification process</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Product quality reviews</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0"></div>
                    <span>Customer feedback system</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-500 to-amber-600 py-24 px-6">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10 animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-orange-300 rounded-full blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-6 drop-shadow-lg">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-white/95 mb-10 leading-relaxed max-w-2xl mx-auto">
            Whether you're a vendor looking to expand your business or a customer seeking quality products, we're here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group px-8 py-4 bg-white text-orange-600 rounded-full font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              Become a Vendor
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="group px-8 py-4 bg-transparent border-3 border-white text-white rounded-full font-bold text-lg shadow-xl hover:bg-white hover:text-orange-600 transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
              Start Shopping
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}