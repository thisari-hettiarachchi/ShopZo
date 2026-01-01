import React, { useState, useEffect } from 'react';
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSun,
  FiMoon
} from 'react-icons/fi';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  // Load theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <nav className="bg-[var(--bg-main)] shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <a href="/" className="text-2xl font-bold text-[var(--color-primary)]">
            ShopZo
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">

            {/* Categories Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className="flex items-center gap-1 text-[var(--text-primary)] hover:text-[var(--color-secondary)]"
              >
                Categories <FiChevronDown />
              </button>

              {categoryOpen && (
                <div className="absolute top-8 left-0 w-44 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg shadow-lg z-50">
                  {['Electronics', 'Fashion', 'Home', 'Beauty'].map(cat => (
                    <a
                      key={cat}
                      href={`/category/${cat.toLowerCase()}`}
                      className="block px-4 py-2 hover:bg-[var(--bg-muted)]"
                    >
                      {cat}
                    </a>
                  ))}
                </div>
              )}
            </div>

            <a href="/deals" className="text-[var(--text-primary)] hover:text-[var(--color-secondary)]">
              Deals
            </a>

            <a href="/vendors" className="text-[var(--text-primary)] hover:text-[var(--color-secondary)]">
              Vendors
            </a>

            {/* Search */}
            <input
              type="text"
              placeholder="Search products..."
              className="w-56 px-3 py-1.5 rounded-md border border-[var(--border)] bg-[var(--bg-card)] text-[var(--text-primary)]
              focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-[var(--bg-card)] border border-[var(--border)]
              text-[var(--text-primary)] hover:scale-105 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
            </button>

            <a href="/cart" className="relative text-[var(--text-primary)]">
              <FiShoppingCart size={22} />
              <span className="absolute -top-2 -right-2 text-xs bg-[var(--color-primary)] text-white rounded-full px-1">
                3
              </span>
            </a>

            <a href="/profile" className="text-[var(--text-primary)]">
              <FiUser size={22} />
            </a>

            {/* Mobile Menu */}
            <button
              className="md:hidden text-[var(--text-primary)]"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[var(--bg-main)] px-4 py-4 space-y-4 shadow-md">

          <input
            type="text"
            placeholder="Search products..."
            className="w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--bg-card)]"
          />

          <div>
            <p className="font-semibold">Categories</p>
            {['Electronics', 'Fashion', 'Home', 'Beauty'].map(cat => (
              <a key={cat} href={`/category/${cat.toLowerCase()}`} className="block py-1">
                {cat}
              </a>
            ))}
          </div>

          <a href="/deals">Deals</a>
          <a href="/vendors">Vendors</a>

          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 p-2 rounded-lg border border-[var(--border)]"
          >
            {theme === 'light' ? <FiMoon /> : <FiSun />}
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
