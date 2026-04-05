import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Store, ArrowRight, Check } from 'lucide-react';
import { registerUser, loginUser } from "../services/authService";
import { isVendorAuthenticated, saveVendorSession } from "../utils/authStorage";

export default function AuthPages() {
  const navigate = useNavigate(); 
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (isVendorAuthenticated()) {
      navigate("/", { replace: true });
    }
  }, [navigate]);
  const [formData, setFormData] = useState({
    storeName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await loginUser({
          email: formData.email,
          password: formData.password
        });

        console.log(res.data);

        saveVendorSession({ token: res.data.token, vendor: res.data?.vendor || null });
        alert("Login successful");

        navigate("/"); 

      } else {
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }

        const res = await registerUser({
          storeName: formData.storeName,
          email: formData.email,
          password: formData.password,
        });

        console.log(res.data);
        alert("Account created successfully");
        setIsLogin(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 py-0 md:py-2" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl" style={{ backgroundColor: 'var(--bg-card)', boxShadow: '0 10px 40px var(--shadow)' }}>
        
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center p-12 relative overflow-hidden" style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}>
          <div className="float-icon absolute top-[10%] -right-12 opacity-10">
            <Store size={200} color="white" />
          </div>
          <div className="relative z-10">
            <div className="mb-8">
              <Store size={50} color="white" />
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to ShopZo
            </h2>
            <p className="text-white opacity-95 text-base leading-relaxed mb-8">
              {isLogin 
                ? 'Sign in to access your account and continue your shopping journey.'
                : 'Create your customer account and start shopping in minutes.'
              }
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Check size={20} color="white" />
                </div>
                <span className="text-white text-sm">Secure & Trusted Platform</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Check size={20} color="white" />
                </div>
                <span className="text-white text-sm">Thousands of products available</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Check size={20} color="white" />
                </div>
                <span className="text-white text-sm">24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-12" style={{ backgroundColor: 'var(--bg-card)' }}>
          <div className="animate-fade-in">
            <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Fill in your details to get started'
              }
            </p>

            <div className="flex flex-col gap-5">
              {/* Store Name Field - Only for Register */}
              {!isLogin && (
                <div className="animate-slide-in relative">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Store Name
                  </label>
                  <Store size={18} className="absolute left-3 top-[42px]" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="storeName"
                    value={formData.storeName}
                    onChange={handleInputChange}
                    placeholder="John's Store"
                    className="w-full pl-11 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none focus:shadow-lg"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="animate-slide-in relative">
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Email Address
                </label>
                <Mail size={18} className="absolute left-3 top-[42px]" style={{ color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="w-full pl-11 pr-3 py-3 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none focus:shadow-lg"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>

              {/* Password Field */}
              <div className="animate-slide-in relative">
                <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                  Password
                </label>
                <Lock size={18} className="absolute left-3 top-[42px]" style={{ color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-11 py-3 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none focus:shadow-lg"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'var(--color-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'var(--border)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-[42px] cursor-pointer"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Confirm Password - Only for Register */}
              {!isLogin && (
                <div className="animate-slide-in relative">
                  <label className="block text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Confirm Password
                  </label>
                  <Lock size={18} className="absolute left-3 top-[42px]" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-11 py-3 rounded-lg border-2 text-sm transition-all duration-300 focus:outline-none focus:shadow-lg"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-card)',
                      color: 'var(--text-primary)'
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary)';
                      e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--border)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-[42px] cursor-pointer"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              )}

              {/* Remember Me / Terms */}
              <div className="animate-slide-in flex justify-between items-center text-sm flex-wrap gap-2">
                {isLogin ? (
                  <>
                    <label className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300`}
                        style={{
                          borderColor: formData.agreeTerms ? 'var(--color-primary)' : 'var(--border)',
                          background: formData.agreeTerms ? 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' : 'transparent'
                        }}
                      >
                        {formData.agreeTerms && <Check size={14} color="white" />}
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                    </label>
                    <span className="font-semibold cursor-pointer" style={{ color: 'var(--color-primary)' }}>
                      Forgot password?
                    </span>
                  </>
                ) : (
                  <label className="flex items-center gap-2 cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0`}
                      style={{
                        borderColor: formData.agreeTerms ? 'var(--color-primary)' : 'var(--border)',
                        background: formData.agreeTerms ? 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' : 'transparent'
                      }}
                    >
                      {formData.agreeTerms && <Check size={14} color="white" />}
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      I agree to the <span className="cursor-pointer" style={{ color: 'var(--color-primary)' }}>Terms & Conditions</span>
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button 
                onClick={handleSubmit} 
                className="w-full py-3.5 rounded-lg border-0 text-white text-base font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0"
                style={{ background: 'linear-gradient(to right, var(--color-primary), var(--color-secondary))' }}
              >
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-2">
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--text-muted)' }}>OR</span>
                <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border)' }} />
              </div>

              {/* Social Login Buttons */}
              <div className="flex gap-3">
                <button className="flex-1 py-3 rounded-lg border-2 font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  Google
                </button>
                <button className="flex-1 py-3 rounded-lg border-2 font-semibold text-sm cursor-pointer transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    borderColor: 'var(--border)',
                    backgroundColor: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  Facebook
                </button>
              </div>

              {/* Toggle Login/Register */}
              <div className="text-center text-sm mt-2">
                <span style={{ color: 'var(--text-secondary)' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold cursor-pointer"
                  style={{ color: 'var(--color-primary)' }}
                >
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
