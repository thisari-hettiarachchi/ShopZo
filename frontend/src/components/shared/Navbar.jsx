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

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || []
    setCartCount(cart.length)
  }

  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    setWishlistCount(wishlist.length)
  }

  useEffect(() => {
    updateCartCount()
    updateWishlistCount()
    setIsLoggedIn(!!localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    const handleStorage = () => {
      updateCartCount()
      updateWishlistCount()
    }
    window.addEventListener('storage', handleStorage)
    window.addEventListener('cartUpdated', handleStorage)
    window.addEventListener('wishlistUpdated', handleStorage)

    return () => {
      window.removeEventListener('storage', handleStorage)
      window.removeEventListener('cartUpdated', handleStorage)
      window.removeEventListener('wishlistUpdated', handleStorage)
    }
  }, [])

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
    <nav className="sticky top-4 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar-main h-16 px-6 rounded-full border backdrop-blur-md flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-full btn-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <img src={Assets.logo} alt="ShopZo" className="h-8 w-auto" />
              <p className="logo-text text-lg font-semibold tracking-wide">
                ShopZO
              </p>
            </div>

          </div>

          {/* CENTER MENU */}
          <div className="hidden lg:flex items-center gap-2">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition
                    ${
                      activeMenu === item.id
                        ? 'bg-[var(--bg-muted)] text-[var(--color-primary)]'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--color-primary)]'
                    }`}
                >
                  <Icon size={16} />
                  {item.label}
                </NavLink>
              )
            })}
          </div>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2">
            {/* SEARCH */}
            <button
              className="p-2 rounded-full btn-icon md:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={20} />
            </button>

            {/* ACCOUNT */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="p-2 rounded-full btn-icon"
              >
                <User size={20} />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-[var(--bg-card)] border rounded-xl shadow-lg">
                  {!isLoggedIn ? (
                    <>
                      <NavLink to="/auth" className="block px-4 py-2 hover:bg-[var(--bg-muted)]">
                        Sign In
                      </NavLink>
                      <NavLink to="/auth" className="block px-4 py-2 hover:bg-[var(--bg-muted)]">
                        Sign Up
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink to="/profile" className="block px-4 py-2 hover:bg-[var(--bg-muted)]">
                        Profile
                      </NavLink>
                      <button
                        className="w-full text-left px-4 py-2 hover:bg-[var(--bg-muted)]"
                        onClick={() => {
                          localStorage.removeItem('token')
                          setIsLoggedIn(false)
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* WISHLIST */}
            <NavLink to="/wishlist" className="relative p-2 rounded-full btn-icon">
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="badge absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* CART */}
            <NavLink to="/cart" className="relative p-2 rounded-full btn-icon">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="badge absolute -top-1 -right-1 h-4 w-4 text-[10px] flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </NavLink>

            {/* THEME */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full btn-icon"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* MOBILE SEARCH */}
        {isSearchOpen && (
          <div className="md:hidden mt-3">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full search-input"
            />
          </div>
        )}

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-3 mobile-menu rounded-2xl">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3"
                >
                  <Icon size={18} />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        )}
      </div>
    </nav>
  )
}
