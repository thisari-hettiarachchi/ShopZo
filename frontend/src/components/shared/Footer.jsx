import React from 'react';
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Assets from '../../assets/assets'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-card)] border-t-2 border-[var(--border)] mt-16">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-white text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Subscribe to Our Newsletter</h3>
              <p className="text-amber-50">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-80 px-4 py-3 rounded-lg bg-white text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="px-6 py-3 bg-white text-[var(--color-primary)] font-semibold rounded-lg hover:bg-amber-50 transition-all">
                Subscribe
              </button>
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