import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Assets from '../../assets/assets'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-card)] border-t-2 border-[var(--border)] mt-16">
      {/* Newsletter Section */}
      <div className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[var(--shadow)] md:p-10"
          style={{ boxShadow: 'var(--shadow)' }}>

        {/* Top accent bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl"
            style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary), var(--color-accent))' }} />

        {/* Glow blobs */}
        <div className="pointer-events-none absolute -right-16 -top-14 h-48 w-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(249,115,22,0.12), transparent 70%)' }} />
        <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.10), transparent 70%)' }} />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">

            {/* Badge */}
            <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{ background: 'linear-gradient(90deg, rgba(249,115,22,0.12), rgba(34,211,238,0.08))', borderColor: 'rgba(249,115,22,0.3)', color: 'var(--color-primary)' }}>
              <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
              Trusted by 12k+ developers
            </p>

            {/* Stars */}
            <div className="mt-3 flex items-center gap-2">
              {/* your existing stars SVG */}
              <span className="text-sm text-[var(--text-secondary)]">4.5/5 · 2,300+ Reviews</span>
            </div>

            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[40px] md:leading-[1.1]"
                style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              Get fresh deals, launches &{' '}
              <span className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                insider drops
              </span>{' '}first.
            </h2>
            <p className="mt-3 text-sm leading-relaxed md:text-base" style={{ color: 'var(--text-secondary)' }}>
              Weekly updates with no noise. Curated picks, price alerts, and exclusive seasonal offers — straight to your inbox.
            </p>
          </div>

          {/* Form box */}
          <div className="w-full max-w-md rounded-2xl border p-2.5"
              style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border)', boxShadow: '0 4px 20px rgba(249,115,22,0.08)' }}>
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex h-11 flex-1 items-center gap-2 rounded-xl border px-3"
                  style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
                {/* mail icon */}
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16.5 5.25L9 9.75 1.5 5.25"/><rect x="1.5" y="3" width="15" height="12" rx="1.5"/>
                </svg>
                <input type="email" placeholder="Enter your email"
                  className="h-full w-full bg-transparent text-sm outline-none"
                  style={{ color: 'var(--text-primary)' }} />
              </div>
              <button className="h-11 rounded-xl px-5 text-sm font-bold text-white"
                      style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-secondary))', boxShadow: '0 6px 18px rgba(249,115,22,0.28)' }}>
                Subscribe
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 px-1">
              {['No spam, ever', 'Unsubscribe anytime', 'Weekly digest'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <span className="inline-block w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--color-accent)' }} />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2">
              <img src={Assets.logo} alt="ShopZo Logo" className="h-8 w-auto" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
                ShopZo
              </h2>
            </div>

            <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">
              Your trusted multivendor marketplace for quality products from verified sellers worldwide.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <MapPin size={18} className="text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-sm">123 Market Street, Commerce City, CC 12345</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Phone size={18} className="text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-[var(--text-secondary)]">
                <Mail size={18} className="text-[var(--color-primary)] flex-shrink-0" />
                <span className="text-sm">support@shopzo.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: 'About Us', path: '/about' },
                { name: 'Contact Us', path: '/contact' },
                { name: 'Careers', path: '/careers' },
                { name: 'Press', path: '/press' },
                { name: 'Blog', path: '/blog' },
                { name: 'Affiliate Program', path: '/affiliate' }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Customer Service</h3>
            <ul className="space-y-2">
              {[
                { name: 'Help Center', path: '/help-center' },
                { name: 'Track Order', path: '/track-order' },
                { name: 'Return Policy', path: '/return-policy' },
                { name: 'Shipping Info', path: '/shipping-info' },
                { name: 'Payment Methods', path: '/payment-methods' },
                { name: 'Gift Cards', path: '/gift-cards' },
                { name: 'Size Guide', path: '/size-guide' }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>


          {/* For Sellers */}
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">For Sellers</h3>
            <ul className="space-y-2">
              {[
                { name: 'Become a Seller', path: '/auth' },
                { name: 'Seller Dashboard', path: '/seller/dashboard' },
                { name: 'Seller Guidelines', path: '/seller/guidelines' },
                { name: 'Seller Support', path: '/seller/support' },
                { name: 'Commission Rates', path: '/seller/commission' },
                { name: 'Success Stories', path: '/seller/success' }
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href={item.path}
                    className="text-[var(--text-secondary)] hover:text-[var(--color-primary)] text-sm transition-colors"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Payment Methods & App Download */}
        <div className="flex justify-between items-start border-t border-[var(--border)] pt-8 mb-8">
            {/* We Accept Section */}
            <div className="flex flex-col items-start">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                We Accept
                </h4>
                <img src={Assets.payment} alt="Payment Methods" className="h-14 w-auto" />
            </div>

            {/* Download Our App Section */}
            <div className="flex flex-col items-end">
                <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
                Download Our App
                </h4>
                <img src={Assets.download} alt="Download App" className="h-10 w-auto" />
            </div>
        </div>



        {/* Social Links & Copyright */}
        <div className="border-t border-[var(--border)] pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
              <span>Made with</span>
              <Heart size={16} className="text-[var(--color-primary)] fill-current" />
              <span>© {currentYear} ShopHub. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-4">
              {[
                { Icon: Facebook, label: 'Facebook' },
                { Icon: Twitter, label: 'Twitter' },
                { Icon: Instagram, label: 'Instagram' },
                { Icon: Linkedin, label: 'LinkedIn' },
                { Icon: Youtube, label: 'YouTube' }
              ].map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="p-2 rounded-full bg-[var(--bg-muted)] text-[var(--text-secondary)] hover:bg-[var(--color-primary)] hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--text-secondary)]">
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Privacy Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Terms of Service</a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Cookie Policy</a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Accessibility</a>
              <span>•</span>
              <a href="#" className="hover:text-[var(--color-primary)] transition-colors">Sitemap</a>
            </div>
          </div>
        </div>
      </div>
      
    </footer>
  );
}