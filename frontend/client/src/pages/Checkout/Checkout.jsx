import React, { useState, useEffect } from "react";
import { ShoppingCart, MapPin, User, Tag, Edit, X } from "lucide-react";
import { fetchCart } from "../../api/cartApi";
import { getAddresses, addAddress } from "../../services/addressService";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [address, setAddress] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // 🔹 popup state
  const [showAddressPopup, setShowAddressPopup] = useState(false);
  const [allAddresses, setAllAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: "",
    phone: "",
    region: "",
    addressLine: "",
  });

  useEffect(() => {
    const loadCheckoutData = async () => {
      try {
        // Check if products were passed via Buy Now button
        if (location.state?.products && location.state.products.length > 0) {
          const buyNowProducts = location.state.products.map((product) => ({
            _id: product._id,
            product: {
              _id: product._id,
              name: product.name,
              image: product.image,
            },
            price: product.price,
            qty: product.quantity || 1,
            vendor: product.vendor,
          }));
          setCartItems(buyNowProducts);
        } else {
          // Otherwise, fetch from cart API
          const cart = await fetchCart(token);
          setCartItems(cart.items || []);
        }

        const addressRes = await getAddresses();
        const addresses = addressRes.data || [];
        const defaultShipping =
          addresses.find((a) => a.isDefaultShipping) || addresses[0] || null;

        setAddress(defaultShipping);
        setAllAddresses(addresses);
        setSelectedAddressId(defaultShipping?.id || null);
      } catch (err) {
        console.error("Checkout load error:", err);
      }
    };

    loadCheckoutData();
  }, [token, location.state]);

  const itemsTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const deliveryFee = 286;
  const total = itemsTotal + deliveryFee;

  const handleSaveAddress = () => {
    const selected = allAddresses.find(
      (a) => a.id === selectedAddressId || a._id === selectedAddressId
    );
    setAddress(selected || null);
    setShowAddressPopup(false);
  };

  const handleAddNewAddress = async () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.region || !newAddress.addressLine) {
      return alert("Please fill all fields");
    }
    try {
      const res = await addAddress({ ...newAddress, isDefaultShipping: true });
      const added = res.data; 
      
      const addressesRes = await getAddresses();
      setAllAddresses(addressesRes.data || []);
      
      setSelectedAddressId(added._id || added.id);
      setIsAddingAddress(false);
    } catch (err) {
      alert("Failed to add address");
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold">Checkout</h1>
          <p className="text-[var(--text-secondary)]">
            Review your order and complete payment
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">

            {/* SHIPPING & BILLING */}
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl border-2 border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-[var(--color-primary)]" />
                  <h2 className="text-xl font-semibold">
                    Shipping & Billing
                  </h2>
                </div>

                {/* EDIT BUTTON */}
                <button
                  onClick={() => setShowAddressPopup(true)}
                  className="flex items-center gap-1 text-[var(--color-primary)]"
                >
                  <Edit size={16} /> EDIT
                </button>
              </div>

              {address ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={18} />
                    <span className="font-semibold">
                      {address.fullName}
                    </span>
                  </div>

                  <p className="text-sm">{address.phone}</p>

                  <p className="text-sm text-[var(--text-secondary)]">
                    {address.addressLine}, {address.region}
                  </p>

                  {address.isDefaultShipping && (
                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded bg-green-100 text-green-700">
                      Default Shipping Address
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-[var(--text-muted)]">
                  No address found. Please add one.
                </p>
              )}
            </div>

            {/* CART ITEMS */}
            <div className="bg-[var(--bg-card)] p-6 rounded-2xl border-2 border-[var(--border)]">
              <h2 className="text-xl font-semibold mb-4">
                Order Items
              </h2>

              {cartItems.length === 0 ? (
                <p className="text-center text-[var(--text-muted)]">
                  No items in cart
                </p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 mb-4 bg-[var(--bg-muted)] rounded-xl"
                  >
                    <img
                      src={item.product?.image || item.product?.images?.[0]}
                      alt={item.product?.name}
                      className="w-20 h-20 object-contain bg-white rounded"
                    />

                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {item.product?.name}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)]">
                        {item.vendor?.name || "Seller"}
                      </p>
                      <p className="font-bold text-[var(--color-primary)] mt-1">
                        Rs. {item.price}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-[var(--text-secondary)]">
                          Qty: <span className="font-semibold">{item.qty}</span>
                        </p>
                        <p className="text-sm font-semibold">
                          Subtotal: <span className="text-[var(--color-primary)]">Rs. {item.price * item.qty}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="bg-[var(--bg-card)] p-6 rounded-2xl border-2 border-[var(--border)] h-fit">
            <h2 className="text-xl font-semibold mb-4">
              Order Summary
            </h2>

            <div className="flex justify-between mb-2">
              <span>Items Total</span>
              <span>Rs. {itemsTotal}</span>
            </div>

            <div className="flex justify-between mb-2">
              <span>Delivery</span>
              <span>Rs. {deliveryFee}</span>
            </div>

            <div className="flex justify-between text-lg font-bold border-t pt-3">
              <span>Total</span>
              <span className="text-[var(--color-primary)]">
                Rs. {total}
              </span>
            </div>

            <button 
              onClick={() => {
                if (!address) {
                  alert("Please select or add a shipping & billing address before proceeding.");
                  setShowAddressPopup(true);
                  if (allAddresses.length === 0) setIsAddingAddress(true);
                  return;
                }
                navigate(`/proceedtopay`);
              }}
              className="w-full mt-6 flex items-center justify-center gap-2 py-3 rounded-xl text-white font-medium bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:opacity-90">
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>

      {/* ADDRESS POPUP */}
      {showAddressPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-card)] w-full max-w-lg p-6 rounded-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{isAddingAddress ? "Add New Address" : "Select Address"}</h3>
              <button onClick={() => setShowAddressPopup(false)}>
                <X />
              </button>
            </div>

            {isAddingAddress ? (
              <div className="space-y-4">
                <input type="text" placeholder="Full Name" className="w-full p-3 border rounded-lg focus:outline-[var(--color-primary)]" value={newAddress.fullName} onChange={e => setNewAddress({...newAddress, fullName: e.target.value})} />
                <input type="text" placeholder="Phone Number" className="w-full p-3 border rounded-lg focus:outline-[var(--color-primary)]" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} />
                <input type="text" placeholder="Region / City" className="w-full p-3 border rounded-lg focus:outline-[var(--color-primary)]" value={newAddress.region} onChange={e => setNewAddress({...newAddress, region: e.target.value})} />
                <textarea placeholder="Full Address Line" className="w-full p-3 border rounded-lg focus:outline-[var(--color-primary)] h-24" value={newAddress.addressLine} onChange={e => setNewAddress({...newAddress, addressLine: e.target.value})} />
                
                <div className="flex justify-end gap-3 mt-5">
                  <button onClick={() => setIsAddingAddress(false)} className="px-5 py-2 rounded-xl border-2">Cancel</button>
                  <button onClick={handleAddNewAddress} className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold">Save Address</button>
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {allAddresses.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No addresses saved yet.</p>
                  ) : (
                    allAddresses.map((addr) => (
                      <label
                        key={addr._id || addr.id}
                        className={`block p-4 rounded-xl border-2 cursor-pointer transition ${
                          selectedAddressId === (addr._id || addr.id)
                            ? "border-[var(--color-primary)] bg-orange-50"
                            : "border-[var(--border)]"
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="radio"
                            name="address"
                            className="mr-3 mt-1 cursor-pointer"
                            checked={selectedAddressId === (addr._id || addr.id)}
                            onChange={() => setSelectedAddressId(addr._id || addr.id)}
                          />
                          <div>
                            <span className="font-semibold text-[var(--text-primary)]">{addr.fullName}</span>
                            <p className="text-sm text-gray-600 mt-1">{addr.phone}</p>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">
                              {addr.addressLine}, {addr.region}
                            </p>
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>

                <div className="flex justify-between items-center mt-5">
                  <button onClick={() => setIsAddingAddress(true)} className="text-[var(--color-primary)] font-semibold text-sm hover:underline">
                    + Add New Address
                  </button>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAddressPopup(false)}
                      className="px-5 py-2 rounded-xl border-2"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveAddress}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
                    >
                      Use Selected
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
