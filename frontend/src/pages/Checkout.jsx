import React, { useState } from 'react';
import { ShoppingCart, MapPin, User, Tag, FileText, Edit } from 'lucide-react';

export default function CheckoutPage() {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);

  const orderDetails = {
    itemName: 'Rosemary by Nutty Frutyss 50g',
    seller: 'Nutty Frutyss',
    originalPrice: 470,
    discountedPrice: 350,
    discount: 26,
    quantity: 1,
    deliveryFee: 286
  };

  const itemsTotal = orderDetails.discountedPrice * orderDetails.quantity;
  const total = itemsTotal + orderDetails.deliveryFee;

  const handleApplyPromo = () => {
    if (promoCode.trim()) {
      setIsPromoApplied(true);
    }
  };

  const handleProceedToPay = () => {
    alert('Proceeding to payment...');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 px-4 relative overflow-hidden">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

        * { font-family: 'Poppins', sans-serif; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-15deg); }
          50% { transform: translateY(-20px) rotate(-15deg); }
        }

        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        .animate-slide-in { animation: slideIn 0.4s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
        .float-icon { animation: float 6s ease-in-out infinite; }
        .pulse-slow { animation: pulse 3s ease-in-out infinite; }
      `}</style>

      {/* Floating Icons */}
      <div className="fixed top-20 right-20 text-[var(--color-accent)] opacity-10 text-9xl float-icon pointer-events-none">🛒</div>
      <div className="fixed bottom-20 left-20 text-[var(--color-secondary)] opacity-10 text-8xl float-icon pointer-events-none" style={{ animationDelay: '2s' }}>💳</div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 logo-text">
            Checkout
          </h1>
          <p className="text-[var(--text-secondary)]">Review your order and complete payment</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* LEFT SECTION */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)] animate-slide-in">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                    <MapPin className="text-white w-5 h-5" />
                  </div>
                  <h2 className="text-xl font-semibold">Shipping & Billing</h2>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-[var(--color-primary)] hover:bg-[var(--bg-muted)] transition">
                  <Edit className="w-4 h-4" /> EDIT
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-[var(--color-primary)]" />
                  <p className="font-medium">Thisari Hettiarachchi</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-[var(--color-primary)] mt-1" />
                  <div>
                    <p className="font-medium">701405126</p>
                    <p className="text-[var(--text-secondary)]">
                      HOME313/3, Ashokarama Road, Ihala Bomiriya, Kaduwela, Colombo
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Package */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)] animate-slide-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <ShoppingCart className="text-white w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Package 1 of 1</h2>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Shipped by <span className="text-[var(--color-primary)] font-semibold">NUTTY FRUTYSS</span>
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-[var(--border)] pt-4">
                <div className="flex gap-4 p-4 rounded-xl bg-[var(--bg-muted)] border border-[var(--border)]">
                  <div className="w-20 h-20 bg-[var(--bg-card)] rounded-lg flex items-center justify-center text-4xl">🌿</div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">{orderDetails.itemName}</h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">{orderDetails.seller}</p>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xl font-bold text-[var(--color-primary)]">Rs. {orderDetails.discountedPrice}</span>
                      <span className="text-sm line-through text-[var(--text-muted)]">Rs. {orderDetails.originalPrice}</span>
                      <span className="px-2 py-1 bg-[var(--color-primary)] text-white text-xs rounded">
                        -{orderDetails.discount}%
                      </span>
                    </div>
                    <p className="text-sm">Qty: {orderDetails.quantity}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="space-y-6">
            {/* Promo */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)] animate-slide-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                  <Tag className="text-white w-5 h-5" />
                </div>
                <h2 className="text-xl font-semibold">Promotion</h2>
              </div>

              <div className="flex gap-3">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Enter promo code"
                  className="flex-1 px-4 py-3 rounded-lg bg-[var(--bg-main)] border-2 border-[var(--border)] focus:border-[var(--color-primary)] outline-none"
                />
                <button onClick={handleApplyPromo} className="px-6 py-3 rounded-lg search-btn">
                  APPLY
                </button>
              </div>

              {isPromoApplied && (
                <p className="mt-3 text-sm text-green-600 font-medium">✓ Promo code applied successfully!</p>
              )}
            </div>

            {/* Order Summary */}
            <div className="bg-[var(--bg-card)] rounded-2xl shadow-lg p-6 border-2 border-[var(--border)] sticky top-4 animate-slide-in">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Items Total</span>
                  <span>Rs. {itemsTotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>Rs. {orderDetails.deliveryFee}</span>
                </div>

                <div className="border-t-2 border-[var(--border)] pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-[var(--color-primary)]">Rs. {total}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToPay}
                className="w-full mt-6 py-4 rounded-xl search-btn text-lg pulse-slow"
              >
                Proceed to Pay
              </button>

              <p className="mt-4 text-xs text-center text-[var(--text-muted)]">🔒 Secure checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
