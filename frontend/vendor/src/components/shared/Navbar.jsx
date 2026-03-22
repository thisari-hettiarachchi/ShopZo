import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  User,
  Menu,
  X,
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
  const [isDarkMode, setIsDarkMode] = useState(false)
  const navigate = useNavigate()

  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem('token'))
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)

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
      <div className="max-w-4xl mx-auto px-4">
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

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-2">

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
                          localStorage.removeItem('vendor')
                          setIsLoggedIn(false)
                          navigate('/auth')
                        }}
                      >
                        Logout
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* THEME */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full btn-icon"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

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
