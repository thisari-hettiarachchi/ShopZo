import { useState, useEffect, useRef } from 'react'
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    vendor: "",
    priceMin: "",
    priceMax: "",
    rating: "",
    availability: "",
    color: "",
    size: "",
  });
  const [sortBy, setSortBy] = useState("popularity");
  const searchDropdownRef = useRef(null);
  const [showFilters, setShowFilters] = useState(false);
    // Example: categories, vendors, colors, sizes for dropdowns (replace with real data or fetch from API)
    const categories = ["Electronics", "Clothing", "Books", "Home"];
    const vendors = ["Vendor A", "Vendor B", "Vendor C"];
    const colors = ["Red", "Blue", "Green", "Black"];
    const sizes = ["S", "M", "L", "XL"];
    // Close search dropdown on outside click
    useEffect(() => {
      function handleClickOutside(event) {
        if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
          setIsSearchOpen(false);
        }
      }
      if (isSearchOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      } else {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isSearchOpen]);
  const [activeMenu, setActiveMenu] = useState('home')
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Read theme from localStorage or system preference
    const stored = localStorage.getItem('theme');
    if (stored === 'dark') return true;
    if (stored === 'light') return false;
    // fallback to system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

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
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light';
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const mainMenuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'products', label: 'Products', icon: Package, path: '/products' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
    { id: 'contact', label: 'Contact', icon: Phone, path: '/contact' }
  ]

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="navbar-main h-16 px-6 rounded-full flex items-center justify-between">
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
            {/* SEARCH ICON (always visible) */}
            <button
              className="p-2 rounded-full btn-icon"
              onClick={() => setIsSearchOpen((v) => !v)}
              aria-label="Open search"
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

        {/* SEARCH & FILTER DROPDOWN */}
        {isSearchOpen && (
          <div ref={searchDropdownRef} className="absolute left-0 right-0 mx-auto max-w-xl w-full mt-4 z-50 bg-[var(--bg-card)] border rounded-2xl shadow-lg p-6">
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border"
              />
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  className="px-4 py-2 rounded-lg border bg-[var(--bg-muted)] text-[var(--color-primary)] font-medium"
                  onClick={() => setShowFilters(v => !v)}
                >
                  {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>
                <select className="border rounded-lg px-2 py-1" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                  <option value="popularity">Popularity</option>
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Discount</option>
                </select>
                <button className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white" onClick={() => {/* TODO: trigger search/filter action */}}>Search</button>
              </div>
              {showFilters && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <select className="border rounded-lg px-2 py-1" value={filters.category} onChange={e => setFilters(f => ({...f, category: e.target.value}))}>
                    <option value="">Category</option>
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select className="border rounded-lg px-2 py-1" value={filters.vendor} onChange={e => setFilters(f => ({...f, vendor: e.target.value}))}>
                    <option value="">Vendor</option>
                    {vendors.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                  <input type="number" placeholder="Min Price" className="border rounded-lg px-2 py-1 w-20" value={filters.priceMin} onChange={e => setFilters(f => ({...f, priceMin: e.target.value}))} />
                  <input type="number" placeholder="Max Price" className="border rounded-lg px-2 py-1 w-20" value={filters.priceMax} onChange={e => setFilters(f => ({...f, priceMax: e.target.value}))} />
                  <select className="border rounded-lg px-2 py-1" value={filters.rating} onChange={e => setFilters(f => ({...f, rating: e.target.value}))}>
                    <option value="">Rating</option>
                    {[5,4,3,2,1].map(r => <option key={r} value={r}>{r} & Up</option>)}
                  </select>
                  <select className="border rounded-lg px-2 py-1" value={filters.availability} onChange={e => setFilters(f => ({...f, availability: e.target.value}))}>
                    <option value="">Availability</option>
                    <option value="Available">Available</option>
                    <option value="Limited">Limited</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                  <select className="border rounded-lg px-2 py-1" value={filters.color} onChange={e => setFilters(f => ({...f, color: e.target.value}))}>
                    <option value="">Color</option>
                    {colors.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select className="border rounded-lg px-2 py-1" value={filters.size} onChange={e => setFilters(f => ({...f, size: e.target.value}))}>
                    <option value="">Size</option>
                    {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}
            </div>
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
