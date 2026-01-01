import React, { useState, useEffect } from "react";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  return (
    <nav className="bg-[var(--bg-main)] shadow-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
        <a href="/" className="flex items-center">
          <img src={logo} alt="Logo" className="h-12 w-12 ml-20" />
        </a>

        <div className="hidden md:flex items-center space-x-6">
          <a href="/products" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-300">
            Products
          </a>
          <a href="/categories" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-300">
            Categories
          </a>
          <a href="/about" className="text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-300">
            About
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
