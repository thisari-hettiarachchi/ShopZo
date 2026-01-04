import React, { useState, useEffect } from 'react';
import { Store, Users, ShieldCheck, TrendingUp, Heart, Award, Package, Globe } from 'lucide-react';

function CountUp({ end, duration = 3000, suffix = '' }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(end * easeOutQuart));

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count.toLocaleString()}{suffix}</>;
}

export default function AboutUs() {
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

  const team = [
    { name: 'Sarah Johnson', role: 'CEO & Founder', initial: 'SJ' },
    { name: 'Michael Chen', role: 'CTO', initial: 'MC' },
    { name: 'Emily Rodriguez', role: 'Head of Vendor Relations', initial: 'ER' },
    { name: 'David Kim', role: 'Head of Operations', initial: 'DK' }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)' }}>
    

      {/* Hero Section */}
      <div className="gradient-bg" style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '48px', fontWeight: 'bold', color: 'white', marginBottom: '20px' }}>
            About Our Marketplace
          </h1>
          <p style={{ fontSize: '20px', color: 'white', opacity: 0.95, maxWidth: '700px', margin: '0 auto' }}>
            Connecting vendors and customers worldwide through a trusted, innovative platform built on transparency and excellence.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div style={{ maxWidth: '1200px', margin: '-40px auto 80px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="card-hover"
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                boxShadow: '0 4px 12px var(--shadow)',
                border: '2px solid var(--border)',
                transition: 'all 0.3s ease'
              }}
            >
              <stat.icon size={40} style={{ color: 'var(--color-primary)', margin: '0 auto 15px' }} />
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '5px' }}>
                <CountUp end={stat.value} suffix={stat.suffix} />
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '16px' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Our Story Section */}
      <div style={{ maxWidth: '1200px', margin: '0 auto 80px', padding: '0 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '20px' }}>
              Our Story
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
              Founded in 2020, our platform was born from a simple vision: to create a marketplace where vendors of all sizes could thrive and customers could discover unique products from around the world.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8', marginBottom: '15px' }}>
              What started as a small team passionate about e-commerce has grown into a global community of thousands of vendors and millions of satisfied customers.
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', lineHeight: '1.8' }}>
              Today, we continue to innovate and expand, always keeping our core mission at heart: empowering entrepreneurs and delighting customers with exceptional shopping experiences.
            </p>
          </div>
          <div style={{ backgroundColor: 'var(--bg-muted)', borderRadius: '12px', padding: '60px', textAlign: 'center', border: '2px solid var(--border)' }}>
            <Store size={100} style={{ color: 'var(--color-primary)', margin: '0 auto 20px' }} />
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '10px' }}>
              Building Trust Daily
            </h3>
            <p style={{ color: 'var(--text-secondary)' }}>
              Every transaction strengthens our community
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div style={{ backgroundColor: 'var(--bg-muted)', padding: '80px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '50px' }}>
            Our Core Values
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {values.map((value, idx) => (
              <div
                key={idx}
                className="card-hover"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  padding: '30px',
                  borderRadius: '12px',
                  border: '2px solid var(--border)',
                  boxShadow: '0 4px 12px var(--shadow)',
                  transition: 'all 0.3s ease'
                }}
              >
                <value.icon size={40} style={{ color: 'var(--color-primary)', marginBottom: '20px' }} />
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '12px' }}>
                  {value.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div style={{ maxWidth: '1200px', margin: '80px auto', padding: '0 20px' }}>
        <h2 className="gradient-text" style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '50px' }}>
          Meet Our Leadership Team
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
          {team.map((member, idx) => (
            <div
              key={idx}
              className="card-hover"
              style={{
                backgroundColor: 'var(--bg-card)',
                padding: '30px',
                borderRadius: '12px',
                textAlign: 'center',
                border: '2px solid var(--border)',
                boxShadow: '0 4px 12px var(--shadow)',
                transition: 'all 0.3s ease'
              }}
            >
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-muted)',
                  border: '3px solid var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: 'var(--color-primary)'
                }}
              >
                {member.initial}
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
                {member.name}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                {member.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{ backgroundColor: 'var(--bg-muted)', padding: '60px 20px', marginTop: '40px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '20px' }}>
            Join Our Growing Community
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '30px' }}>
            Whether you're a vendor looking to expand your business or a customer seeking quality products, we're here to help you succeed.
          </p>
          <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              className="gradient-bg"
              style={{
                padding: '15px 35px',
                borderRadius: '8px',
                border: 'none',
                color: 'white',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px var(--shadow)'
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
              onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
            >
              Become a Vendor
            </button>
            <button
              style={{
                padding: '15px 35px',
                borderRadius: '8px',
                border: '2px solid var(--color-primary)',
                backgroundColor: 'transparent',
                color: 'var(--color-primary)',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--color-primary)';
              }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}