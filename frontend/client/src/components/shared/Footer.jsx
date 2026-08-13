import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube, Loader2 } from 'lucide-react';
import Assets from '../../assets/assets'
import { subscribeNewsletter } from '../../api/newsletterApi'

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [subscribing, setSubscribing] = useState(false);

  const handleSubscribe = async (event) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error('Please enter your email');
      return;
    }

    setSubscribing(true);
    try {
      const data = await subscribeNewsletter(trimmed, 'footer');
      toast.success(data.message || 'Subscribed successfully');
      if (!data.alreadySubscribed) {
        setEmail('');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Failed to subscribe');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <footer className="bg-[var(--bg-card)] border-t-2 border-[var(--border)] mt-16">
      {/* Newsletter Section */}
      <div className="border-b border-[var(--border)] bg-[var(--bg-main)] px-4 py-12 md:py-14">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[var(--border)] bg-[var(--bg-card)] p-6 shadow-[0_24px_60px_-40px_var(--shadow)] md:p-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-primary)]">
                Newsletter
              </p>
              <h2 className="text-[2rem] font-black leading-[1.1] tracking-tight text-[var(--text-primary)] md:text-[2.75rem]">
                Stay ahead of{" "}
                <span className="italic text-[var(--color-primary)]">every deal</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-[var(--text-secondary)] md:text-base">
                Get new product alerts, price-drop notices, and discount emails from ShopZo — unsubscribe anytime.
              </p>
            </div>

            <div className="w-full max-w-md">
              <form
                className="flex flex-col gap-2 sm:flex-row"
                onSubmit={handleSubscribe}
              >
                <label className="flex h-12 flex-1 items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--bg-main)] px-3.5 transition focus-within:border-[var(--color-primary)]">
                  <Mail size={16} className="shrink-0 text-[var(--color-primary)]" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={subscribing}
                    placeholder="Enter your email"
                    className="h-full w-full bg-transparent text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-muted)] disabled:opacity-60"
                  />
                </label>
                <button
                  type="submit"
                  disabled={subscribing}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] px-6 text-sm font-bold text-white shadow-[0_14px_28px_-16px_var(--shadow)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {subscribing ? <Loader2 size={16} className="animate-spin" /> : null}
                  {subscribing ? 'Subscribing…' : 'Subscribe'}
                </button>
              </form>
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                {["No spam, ever", "New products & deals", "Unsubscribe anytime"].map((item) => (
                  <span key={item} className="text-xs text-[var(--text-secondary)]">
                    {item}
                  </span>
                ))}
                <Link
                  to="/newsletter/unsubscribe"
                  className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
                >
                  Unsubscribe
                </Link>
              </div>
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
                <img src={Assets.payment} alt="Payment Methods" className="h-25 w-auto" />
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