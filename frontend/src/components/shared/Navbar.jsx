import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  Bell,
  Home,
  Package,
  Info,
  Phone,
  Moon,
  Sun
} from 'lucide-react'
import Assets from '../../assets/assets'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('home')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

  // Account menu
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  // Update counts from localStorage
  const updateCartCount = () => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart')) || []
      setCartCount(cart.length)
    } catch (error) {
      console.error('Error reading cart from localStorage:', error)
      setCartCount(0)
    }
  }

  const updateWishlistCount = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
      setWishlistCount(wishlist.length)
    } catch (error) {
      console.error('Error reading wishlist from localStorage:', error)
      setWishlistCount(0)
    }
  }

  // Initialize counts and auth state on mount
  useEffect(() => {
    updateCartCount()
    updateWishlistCount()

    const token = localStorage.getItem('token')
    setIsLoggedIn(!!token)
  }, [])

  // Listen to localStorage changes from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cart') {
        updateCartCount()
      } else if (e.key === 'wishlist') {
        updateWishlistCount()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  // Listen to custom events for same-tab updates
  useEffect(() => {
    const handleCartUpdate = () => {
      updateCartCount()
    }
    const handleWishlistUpdate = () => {
      updateWishlistCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('wishlistUpdated', handleWishlistUpdate)

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('wishlistUpdated', handleWishlistUpdate)
    }
  }, [])

  // Dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [isDarkMode])

  const mainMenuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
    { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' }
  ]

  return (
    <nav className="navbar-main sticky top-0 z-50">
      {/* Top Bar */}
      <div className="top-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Welcome to ShopZo</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:opacity-80 transition font-medium">Sell on ShopZo</button>
              <span className="hidden sm:inline">|</span>
              <button className="hover:opacity-80 transition hidden sm:inline">Help</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-3 p-2 rounded-md btn-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={24} className="icon-primary" /> : <Menu size={24} className="icon-primary" />}
            </button>
            <img src={Assets.logo} alt="ShopZo Logo" className="h-8 w-auto" />
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 text-[var(--text-primary)] hover:text-[var(--bg-hover)] ${
                    activeMenu === item.id ? 'active' : ''
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="w-full relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-20 rounded-full search-input"
              />
              <button className="absolute right-1 top-1 px-5 py-1.5 rounded-full search-btn">
                <Search size={18} />
              </button>
            </div>
          </div>

          <button className="md:hidden p-2 rounded-md btn-icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
            <Search size={22} />
          </button>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Account */}
            <div className="relative">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="hidden sm:flex items-center transition-colors duration-300 text-[var(--text-primary)] hover:text-[var(--bg-hover)]"
              >
                <User size={22} />
                <span className="hidden lg:inline text-sm font-medium ml-1">Account</span>
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-lg shadow-lg z-50">
                  {!isLoggedIn ? (
                    <div className="flex flex-col py-2">
                      <NavLink
                        to="/auth"
                        className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Sign In
                      </NavLink>
                      <NavLink
                        to="/auth"
                        className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        Sign Up
                      </NavLink>
                    </div>
                  ) : (
                    <div className="flex flex-col py-2">
                      <NavLink
                        to="/profile"
                        className="px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        View Profile
                      </NavLink>
                      <button
                        onClick={() => {
                          localStorage.removeItem('token')
                          setIsLoggedIn(false)
                          setIsAccountMenuOpen(false)
                        }}
                        className="text-left px-4 py-2 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <NavLink
              to="/wishlist"
              className="relative p-2 text-[var(--text-primary)] hover:text-[var(--bg-hover)]"
            >
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Notifications */}
            <button className="hidden sm:block relative p-2 text-[var(--text-primary)] hover:text-[var(--bg-hover)]">
              <Bell size={22} />
              <span className="absolute top-1 right-1 notification-dot rounded-full h-2 w-2"></span>
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="relative p-2 text-[var(--text-primary)] hover:text-[var(--bg-hover)]"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-[var(--color-primary)] text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-[var(--text-primary)] hover:text-[var(--bg-hover)]"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        {isSearchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-4 py-2 pr-12 rounded-full search-input"
              />
              <button className="absolute right-2 top-2 icon-primary">
                <Search size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden mobile-menu">
          <div className="px-4 py-3 space-y-1">
            <div className="pb-2 mb-2 border-b mobile-menu-divider">
              {mainMenuItems.map((item) => {
                const Icon = item.icon
                return (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => {
                      setActiveMenu(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium text-[var(--text-primary)] hover:text-[var(--bg-hover)] ${
                      activeMenu === item.id ? 'active' : ''
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                )
              })}
            </div>

            <div className="pt-2 border-t mobile-menu-divider">
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:text-[var(--bg-hover)]">
                <User size={18} />
                <span>My Account</span>
              </button>
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm text-[var(--text-primary)] hover:text-[var(--bg-hover)]">
                <Bell size={18} />
                <span>Notifications</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}