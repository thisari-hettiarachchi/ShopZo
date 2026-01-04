import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Store, ShoppingBag, ArrowRight, Check } from 'lucide-react';

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    accountType: 'customer',
    agreeTerms: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert(`${isLogin ? 'Login' : 'Registration'} successful!`);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <style>{`
        :root {
          --color-primary: #F59E0B;
          --color-secondary: #FB923C;
          --color-accent: #FDE68A;
          --bg-main: #FFFBEB;
          --bg-card: #FFFFFF;
          --bg-muted: #FEF3C7;
          --bg-hover: #ef9e5d;
          --text-primary: #1F2937;
          --text-secondary: #4B5563;
          --text-muted: #9CA3AF;
          --border: #FDE68A;
          --shadow: rgba(0, 0, 0, 0.08);
        }
        [data-theme="dark"] {
          --color-primary: #FBBF24;
          --color-secondary: #FB923C;
          --color-accent: #FDE047;
          --bg-main: #0F0A00;
          --bg-card: #1C1402;
          --bg-muted: #2A1F04;
          --text-primary: #FFFBEB;
          --text-secondary: #FDE68A;
          --text-muted: #FCD34D;
          --border: #78350F;
          --shadow: rgba(0, 0, 0, 0.5);
        }
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
        body {
          background-color: var(--bg-main);
          color: var(--text-primary);
        }
        .gradient-text {
          background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .gradient-bg {
          background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-20px) rotate(-15deg); }
        }
        
        .animate-slide-in {
          animation: slideIn 0.4s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .float-icon {
          animation: float 6s ease-in-out infinite;
        }
        
        .input-field {
          width: 100%;
          padding: 12px 12px 12px 45px;
          border: 2px solid var(--border);
          border-radius: 8px;
          background-color: var(--bg-card);
          color: var(--text-primary);
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .input-field:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }
        
        .input-field::placeholder {
          color: var(--text-muted);
        }
        
        .btn-primary {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 8px;
          background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
          color: white;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px var(--shadow);
        }
        
        .btn-primary:active {
          transform: translateY(0);
        }
        
        .account-type-btn {
          flex: 1;
          padding: 16px;
          border: 2px solid var(--border);
          border-radius: 8px;
          background-color: var(--bg-card);
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }
        
        .account-type-btn:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
        
        .account-type-btn.active {
          border-color: var(--color-primary);
          background-color: var(--bg-muted);
          box-shadow: 0 4px 12px var(--shadow);
        }
        
        .checkbox-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
        }
        
        .custom-checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--border);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }
        
        .custom-checkbox.checked {
          background: linear-gradient(to right, var(--color-primary), var(--color-secondary));
          border-color: var(--color-primary);
        }
        
        .social-btn {
          flex: 1;
          padding: 12px;
          border: 2px solid var(--border);
          border-radius: 8px;
          background-color: var(--bg-card);
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          color: var(--text-primary);
          transition: all 0.3s ease;
        }
        
        .social-btn:hover {
          border-color: var(--color-primary);
          transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
          .branding-section {
            display: none !important;
          }
        }
      `}</style>

      <div style={{ width: '100%', maxWidth: '1000px', display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '0', backgroundColor: 'var(--bg-card)', borderRadius: '16px', boxShadow: '0 10px 40px var(--shadow)', overflow: 'hidden' }}>
        
        {/* Left Side - Branding */}
        <div className="gradient-bg branding-section" style={{ padding: '60px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
          <div className="float-icon" style={{ position: 'absolute', top: '10%', right: '-50px', opacity: 0.1 }}>
            <Store size={200} color="white" />
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ marginBottom: '30px' }}>
              <Store size={50} color="white" />
            </div>
            <h2 style={{ fontSize: '32px', fontWeight: 'bold', color: 'white', marginBottom: '15px' }}>
              Welcome to MarketHub
            </h2>
            <p style={{ color: 'white', opacity: 0.95, fontSize: '16px', lineHeight: '1.6', marginBottom: '30px' }}>
              {isLogin 
                ? 'Sign in to access your account and continue your shopping journey.'
                : 'Create your account and join thousands of vendors and shoppers worldwide.'
              }
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={20} color="white" />
                </div>
                <span style={{ color: 'white', fontSize: '14px' }}>Secure & Trusted Platform</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={20} color="white" />
                </div>
                <span style={{ color: 'white', fontSize: '14px' }}>10,000+ Active Vendors</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={20} color="white" />
                </div>
                <span style={{ color: 'white', fontSize: '14px' }}>24/7 Customer Support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div style={{ padding: '60px 40px', backgroundColor: 'var(--bg-card)' }}>
          <div className="animate-fade-in">
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '14px' }}>
              {isLogin 
                ? 'Enter your credentials to access your account'
                : 'Fill in your details to get started'
              }
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Account Type Selection - Only for Register */}
              {!isLogin && (
                <div className="animate-slide-in">
                  <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '10px' }}>
                    I want to
                  </label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div
                      className={`account-type-btn ${formData.accountType === 'customer' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, accountType: 'customer' }))}
                    >
                      <ShoppingBag size={24} color={formData.accountType === 'customer' ? 'var(--color-primary)' : 'var(--text-muted)'} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: formData.accountType === 'customer' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Shop</span>
                    </div>
                    <div
                      className={`account-type-btn ${formData.accountType === 'vendor' ? 'active' : ''}`}
                      onClick={() => setFormData(prev => ({ ...prev, accountType: 'vendor' }))}
                    >
                      <Store size={24} color={formData.accountType === 'vendor' ? 'var(--color-primary)' : 'var(--text-muted)'} />
                      <span style={{ fontSize: '14px', fontWeight: '600', color: formData.accountType === 'vendor' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Sell</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Name Field - Only for Register */}
              {!isLogin && (
                <div className="animate-slide-in" style={{ position: 'relative' }}>
                  <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Full Name
                  </label>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '42px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="input-field"
                  />
                </div>
              )}

              {/* Email Field */}
              <div className="animate-slide-in" style={{ position: 'relative' }}>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Email Address
                </label>
                <Mail size={18} style={{ position: 'absolute', left: '12px', top: '42px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="your@email.com"
                  className="input-field"
                />
              </div>

              {/* Password Field */}
              <div className="animate-slide-in" style={{ position: 'relative' }}>
                <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                  Password
                </label>
                <Lock size={18} style={{ position: 'absolute', left: '12px', top: '42px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="input-field"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '42px', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>

              {/* Confirm Password - Only for Register */}
              {!isLogin && (
                <div className="animate-slide-in" style={{ position: 'relative' }}>
                  <label style={{ display: 'block', color: 'var(--text-primary)', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                    Confirm Password
                  </label>
                  <Lock size={18} style={{ position: 'absolute', left: '12px', top: '42px', color: 'var(--text-muted)' }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    className="input-field"
                  />
                  <div
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '12px', top: '42px', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </div>
                </div>
              )}

              {/* Remember Me / Terms */}
              <div className="animate-slide-in" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px', flexWrap: 'wrap', gap: '10px' }}>
                {isLogin ? (
                  <>
                    <label className="checkbox-wrapper" onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                      <div className={`custom-checkbox ${formData.agreeTerms ? 'checked' : ''}`}>
                        {formData.agreeTerms && <Check size={14} color="white" />}
                      </div>
                      <span style={{ color: 'var(--text-secondary)' }}>Remember me</span>
                    </label>
                    <span style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}>
                      Forgot password?
                    </span>
                  </>
                ) : (
                  <label className="checkbox-wrapper" onClick={() => setFormData(prev => ({ ...prev, agreeTerms: !prev.agreeTerms }))}>
                    <div className={`custom-checkbox ${formData.agreeTerms ? 'checked' : ''}`}>
                      {formData.agreeTerms && <Check size={14} color="white" />}
                    </div>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      I agree to the <span style={{ color: 'var(--color-primary)', cursor: 'pointer' }}>Terms & Conditions</span>
                    </span>
                  </label>
                )}
              </div>

              {/* Submit Button */}
              <button onClick={handleSubmit} className="btn-primary">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </button>

              {/* Divider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '10px 0' }}>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
                <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>OR</span>
                <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border)' }} />
              </div>

              {/* Social Login Buttons */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="social-btn">
                  Google
                </button>
                <button className="social-btn">
                  Facebook
                </button>
              </div>

              {/* Toggle Login/Register */}
              <div style={{ textAlign: 'center', fontSize: '14px', marginTop: '10px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>
                  {isLogin ? "Don't have an account? " : "Already have an account? "}
                </span>
                <span
                  onClick={() => setIsLogin(!isLogin)}
                  style={{ color: 'var(--color-primary)', cursor: 'pointer', fontWeight: '600' }}
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