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

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeMenu, setActiveMenu] = useState('home')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const [cartCount] = useState(3)
  const [wishlistCount] = useState(5)

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
      <div className="top-bar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10 text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium">Welcome to ShopZo</span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">
                Free shipping on orders over $50
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:opacity-80 transition font-medium">
                Sell on ShopZo
              </button>
              <span className="hidden sm:inline">|</span>
              <button className="hover:opacity-80 transition hidden sm:inline">
                Help
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-3 p-2 rounded-md btn-icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X size={24} className="icon-primary" />
              ) : (
                <Menu size={24} className="icon-primary" />
              )}
            </button>
            <div className="text-2xl font-bold logo-text">ShopZo</div>
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center space-x-8 ml-12">
            {mainMenuItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => setActiveMenu(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md font-medium btn-icon ${
                    activeMenu === item.id ? 'active' : ''
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              )
            })}
          </div>

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

          <button
            className="md:hidden p-2 rounded-md btn-icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search size={22} />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3">
            <button className="hidden sm:flex items-center space-x-1 p-2 rounded-md btn-icon">
              <User size={22} />
              <span className="hidden lg:inline text-sm font-medium">
                Account
              </span>
            </button>

            <NavLink to="/wishlist" className="relative p-2 rounded-md btn-icon">
              <Heart size={22} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 badge text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            <button className="hidden sm:block relative p-2 rounded-md btn-icon">
              <Bell size={22} />
              <span className="absolute top-1 right-1 notification-dot rounded-full h-2 w-2"></span>
            </button>

            <NavLink to="/cart" className="relative p-2 rounded-md btn-icon">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 badge text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {cartCount}
                </span>
              )}
            </NavLink>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-md btn-icon"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </div>

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
                    className={`flex items-center space-x-3 w-full px-3 py-2.5 text-sm font-medium rounded-md btn-icon ${
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
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-md sm:hidden btn-icon">
                <User size={18} />
                <span>My Account</span>
              </button>
              <button className="flex items-center space-x-2 w-full px-3 py-2 text-sm rounded-md sm:hidden btn-icon">
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
