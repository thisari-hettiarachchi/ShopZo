import React, { useState, useEffect, useRef } from 'react';
import { Store, Users, ShieldCheck, TrendingUp, Heart, Award, Package, Globe, ArrowRight, Sparkles } from 'lucide-react';
import Assets from "../assets/assets";

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
    <div className="min-h-screen bg-[var(--bg-main)]">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden py-32 px-6 mt-[-70px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${Assets.about})` }}
        />

        {/* Light yellow overlay */}
        <div className="absolute inset-0 bg-yellow-200/25" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Brand gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)]/20 via-[var(--color-secondary)]/20 to-[var(--color-accent)]/20" />

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-lg text-white px-6 py-3 rounded-full mb-8 border border-white/20">
            <Sparkles className="w-5 h-5" />
            <span className="font-semibold">Trusted by thousands worldwide</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black mb-8 text-white">
            About Our Marketplace
          </h1>

          <p className="text-2xl text-white/90 max-w-3xl mx-auto">
            Connecting vendors and customers worldwide through a trusted,
            innovative platform built on transparency and excellence.
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
              className={`relative p-8 rounded-2xl text-center transition-all duration-500 ease-out cursor-pointer group overflow-hidden bg-[var(--bg-card)] ${
                hoveredStat === idx 
                  ? 'shadow-2xl -translate-y-3 scale-105 border-2 border-[var(--color-primary)]' 
                  : 'shadow-xl border-2 border-transparent hover:shadow-2xl'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] opacity-0 transition-opacity duration-500 ${hoveredStat === idx ? 'opacity-10' : ''}`}></div>
              
              <stat.icon 
                className={`w-14 h-14 mx-auto mb-5 transition-all duration-500 text-[var(--color-primary)] ${
                  hoveredStat === idx ? 'scale-125 rotate-12 drop-shadow-lg' : 'group-hover:scale-110'
                }`} 
              />
              <div className="text-5xl font-black mb-3 text-[var(--color-primary)]">
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-sm font-bold text-[var(--text-secondary)] uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-6xl mx-auto px-6 py-28">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-block">
              <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">Our Journey</span>
              <h2 className="text-5xl md:text-6xl font-black text-[var(--color-primary)] leading-tight">
                Our Story
              </h2>
            </div>
            <div className="space-y-5 text-lg text-[var(--text-secondary)] leading-relaxed">
              <p className="text-xl font-semibold text-[var(--text-primary)]">
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
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-secondary)]">2020</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Founded</div>
              </div>
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-primary)]">500K+</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Customers</div>
              </div>
              <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                <div className="text-3xl font-black text-[var(--color-accent)]">50+</div>
                <div className="text-sm text-[var(--text-secondary)] font-medium">Countries</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl transform rotate-3 opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-accent)] rounded-3xl transform -rotate-3 opacity-20"></div>
            <div className="relative bg-[var(--bg-card)] p-12 rounded-3xl shadow-2xl border-4 border-[var(--border)]">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] rounded-full mb-6 shadow-2xl">
                  <Heart className="w-12 h-12 text-white" fill="white" />
                </div>
                <h3 className="text-3xl font-black text-[var(--text-primary)] mb-4">Building Trust Daily</h3>
                <p className="text-[var(--text-secondary)] text-lg font-medium">Every transaction strengthens our community</p>
                <div className="mt-8 pt-8 border-t-2 border-[var(--border)]">
                  <div className="flex justify-around">
                    <div>
                      <div className="text-2xl font-black text-[var(--color-secondary)]">4.9★</div>
                      <div className="text-xs text-[var(--text-muted)]">Rating</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[var(--color-primary)]">99%</div>
                      <div className="text-xs text-[var(--text-muted)]">Satisfaction</div>
                    </div>
                    <div>
                      <div className="text-2xl font-black text-[var(--color-accent)]">24/7</div>
                      <div className="text-xs text-[var(--text-muted)]">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-[var(--bg-muted)] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">What Drives Us</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Our Core Values
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredValue(idx)}
                onMouseLeave={() => setHoveredValue(null)}
                className={`relative p-10 rounded-3xl border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden bg-[var(--bg-card)] group ${
                  hoveredValue === idx ? 'shadow-2xl -translate-y-2 border-[var(--color-primary)] scale-[1.02]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
                }`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 transition-opacity duration-500 ${hoveredValue === idx ? 'opacity-10' : ''}`}></div>
                
                <div className="relative z-10">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl mb-6 shadow-lg transition-all duration-500 ${
                    hoveredValue === idx ? 'scale-110 rotate-6' : 'group-hover:scale-105'
                  }`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[var(--text-primary)]">{value.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vision & Mission Section */}
      <div className="relative overflow-hidden bg-[var(--bg-main)] py-28 px-6">
        {/* Floating Bubbles */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-40 right-20 w-40 h-40 bg-[var(--color-secondary)] rounded-full blur-2xl opacity-30 animate-float-delayed"></div>
          <div className="absolute bottom-32 left-1/4 w-36 h-36 bg-[var(--color-accent)] rounded-full blur-2xl opacity-30 animate-float-slow"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-[var(--color-primary)] rounded-full blur-2xl opacity-30 animate-float"></div>
          <div className="absolute top-1/2 left-1/2 w-44 h-44 bg-[var(--color-secondary)] rounded-full blur-3xl opacity-20 animate-float-delayed"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">Our Direction</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Vision & Mission
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl mx-auto">
              Guiding principles that drive our innovation and commitment
            </p>
          </div>

          {/* Vision */}
          <div className="mb-16">
            <div
              onMouseEnter={() => setHoveredTeam(0)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative rounded-3xl bg-[var(--bg-card)] border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 0 ? 'shadow-2xl -translate-y-2 border-[var(--color-primary)]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Image Side */}
                <div className="relative h-80 md:h-auto overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1552664730-d307ca884978?w=800")',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-primary)]/80 to-[var(--color-secondary)]/80 mix-blend-multiply"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                      hoveredTeam === 0 ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                    }`}>
                      <Sparkles className="w-12 h-12 text-[var(--color-secondary)]" />
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="p-12">
                  <h3 className="text-4xl font-black mb-6 text-[var(--text-primary)]">Our Vision</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    To become the world's most trusted and innovative marketplace, where entrepreneurs and customers connect seamlessly across borders, cultures, and communities.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    We envision a future where every vendor has the tools to succeed and every customer finds exactly what they're looking for.
                  </p>
                  <div className="mt-8 flex gap-4">
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-primary)] mb-1">Global</div>
                      <div className="text-sm text-[var(--text-secondary)]">Marketplace</div>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-secondary)] mb-1">Innovation</div>
                      <div className="text-sm text-[var(--text-secondary)]">Driven</div>
                    </div>
                    <div className="flex-1 p-4 bg-[var(--bg-muted)] rounded-xl border-2 border-[var(--border)]">
                      <div className="text-2xl font-black text-[var(--color-accent)] mb-1">Trust</div>
                      <div className="text-sm text-[var(--text-secondary)]">First</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mission */}
          <div>
            <div
              onMouseEnter={() => setHoveredTeam(1)}
              onMouseLeave={() => setHoveredTeam(null)}
              className={`relative rounded-3xl bg-[var(--bg-card)] border-2 transition-all duration-500 ease-out cursor-pointer overflow-hidden group ${
                hoveredTeam === 1 ? 'shadow-2xl -translate-y-2 border-[var(--color-secondary)]' : 'shadow-lg border-[var(--border)] hover:shadow-xl'
              }`}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Content Side */}
                <div className="p-12 order-2 md:order-1">
                  <h3 className="text-4xl font-black mb-6 text-[var(--text-primary)]">Our Mission</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    To empower vendors with cutting-edge technology and support while providing customers with a secure, diverse shopping experience.
                  </p>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg">
                    We're committed to building a sustainable ecosystem that benefits all stakeholders through transparency, innovation, and exceptional service.
                  </p>
                  <div className="mt-8 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Empower entrepreneurs worldwide</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Deliver exceptional customer experiences</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-primary)]"></div>
                      <span className="text-[var(--text-secondary)] font-medium">Foster sustainable growth and innovation</span>
                    </div>
                  </div>
                </div>

                {/* Image Side */}
                <div className="relative h-80 md:h-auto overflow-hidden order-1 md:order-2">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{
                      backgroundImage: 'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800")',
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-[var(--color-secondary)]/80 to-[var(--color-accent)]/80 mix-blend-multiply"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${
                      hoveredTeam === 1 ? 'scale-110 rotate-12' : 'group-hover:scale-105'
                    }`}>
                      <TrendingUp className="w-12 h-12 text-[var(--color-secondary)]" />
                    </div>
                  </div>
                </div>
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
      <div className="py-28 px-6 bg-[var(--bg-muted)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-sm font-bold text-[var(--color-secondary)] uppercase tracking-widest mb-4 block">What Sets Us Apart</span>
            <h2 className="text-5xl md:text-6xl font-black mb-6 text-[var(--color-primary)]">
              Why Choose Us
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-3xl mx-auto leading-relaxed">
              We go beyond being just a marketplace—we're your partner in success with unmatched features and support
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: 'Advanced Security', desc: 'Bank-level encryption and fraud protection systems keep every transaction safe and secure.', features: ['SSL encryption for all transactions', 'Real-time fraud detection', 'Secure payment gateway'] },
              { icon: Users, title: '24/7 Support', desc: 'Our dedicated support team is always available to help you succeed and resolve any issues.', features: ['Live chat support', 'Dedicated account managers', 'Multi-language assistance'] },
              { icon: Globe, title: 'Global Reach', desc: 'Connect with customers and vendors from over 50 countries worldwide.', features: ['International shipping options', 'Multi-currency support', 'Localized marketplace'] },
              { icon: Package, title: 'Easy Management', desc: 'Intuitive dashboard and tools make selling and buying effortless for everyone.', features: ['Simple product listing', 'Inventory management', 'Analytics & insights'] },
              { icon: TrendingUp, title: 'Growth Tools', desc: 'Powerful marketing and analytics tools to help vendors scale their business.', features: ['SEO optimization tools', 'Promotional campaigns', 'Performance reports'] },
              { icon: Award, title: 'Quality Control', desc: 'Rigorous quality checks ensure only the best products and vendors on our platform.', features: ['Vendor verification process', 'Product quality reviews', 'Customer feedback system'] }
            ].map((item, idx) => (
              <div key={idx} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <div className="relative p-10 rounded-3xl bg-[var(--bg-card)] border-2 border-[var(--border)] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="w-20 h-20 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black mb-4 text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[var(--text-secondary)] leading-relaxed text-lg mb-6">
                    {item.desc}
                  </p>
                  <ul className="space-y-3 text-[var(--text-secondary)]">
                    {item.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-secondary)] mt-2 flex-shrink-0"></div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] py-24 px-6">
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