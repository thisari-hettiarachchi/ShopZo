import React, { useState, useEffect } from "react";
import { CreditCard, Wallet, Truck, Plus, X } from "lucide-react";
import {
  getCards,
  addCard,
  setDefaultCardApi,
} from "../services/paymentService";
import { createOrder } from "../services/orderService";
import { useNavigate } from "react-router-dom";


export default function ProceedToPay() {
  const [method, setMethod] = useState("card");

  const [cards, setCards] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);

  const [showAddCard, setShowAddCard] = useState(false);
  const [newCard, setNewCard] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    isDefault: false,
  });

  const [cartItems, setCartItems] = useState([]);

  const navigate = useNavigate();

  // Load saved cards
  useEffect(() => {
    const loadCards = async () => {
      try {
        const res = await getCards();
        const savedCards = res.data || [];

        const defaultCard =
          savedCards.find((c) => c.isDefault) || savedCards[0] || null;

        setCards(savedCards);
        setSelectedCardId(defaultCard?._id || null);
      } catch (err) {
        console.error(err);
      }
    };

    loadCards();
  }, []);

  // Load cart from localStorage
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(savedCart);
  }, []);

  // Handle card input
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "expiry") {
      let val = value.replace(/\D/g, "");
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
      setNewCard((prev) => ({ ...prev, [name]: val }));
    } else {
      setNewCard((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Save new card
  const handleSaveCard = async () => {
    try {
      const res = await addCard(newCard);

      let updatedCards = [...cards, res.data];

      if (newCard.isDefault) {
        await setDefaultCardApi(res.data._id);
        updatedCards = updatedCards.map((c) => ({
          ...c,
          isDefault: c._id === res.data._id,
        }));
      }

      setCards(updatedCards);
      setSelectedCardId(res.data._id);
      setShowAddCard(false);
      setNewCard({ cardHolder: "", cardNumber: "", expiry: "", isDefault: false });
    } catch (err) {
      console.error(err);
      alert("Failed to add card");
    }
  };

  // Place Order
  const handlePlaceOrder = async () => {
    if (!cartItems.length) {
      alert("Your cart is empty!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const items = cartItems.map((item) => ({
        product: item.product._id,
        vendor: item.product.vendor || null,
        qty: item.quantity || 1,
        price: item.price,
      }));

      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.qty,
        0
      );

      const orderData = {
        items,
        totalAmount,
        paymentMethod: method,
        cardId: selectedCardId || null,
      };

      const response = await createOrder(orderData, token);
      console.log("Order placed:", response);

      alert("Order placed successfully!");

      // Clear cart
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("cartUpdated"));

      navigate("/"); 
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }

  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] px-4 py-8">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-6">

        {/* LEFT – PAYMENT METHODS */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl font-semibold">Select Payment Method</h1>

          {/* CREDIT / DEBIT CARD */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={method === "card"}
                onChange={() => setMethod("card")}
              />
              <CreditCard className="text-[var(--color-primary)]" />
              <span className="font-medium">Credit / Debit Card</span>
            </label>

            {method === "card" && (
              <div className="mt-5 space-y-4">
                {/* SAVED CARDS */}
                {cards.map((card) => (
                  <label
                    key={card._id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer ${
                      selectedCardId === card._id
                        ? "border-[var(--color-primary)]"
                        : "border-[var(--border)]"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={selectedCardId === card._id}
                      onChange={() => setSelectedCardId(card._id)}
                    />
                    <div>
                      <p className="font-semibold">{card.cardHolder}</p>
                      <p className="text-sm">
                        {card.cardNumber} • Exp {card.expiry}
                      </p>
                      {card.isDefault && (
                        <span className="text-xs text-green-600">
                          Default Card
                        </span>
                      )}
                    </div>
                  </label>
                ))}

                {/* ADD NEW CARD */}
                <button
                  onClick={() => setShowAddCard(true)}
                  className="flex items-center gap-2 text-[var(--color-primary)] font-medium"
                >
                  <Plus size={18} /> Add New Card
                </button>
              </div>
            )}
          </div>

          {/* POINTS */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={method === "points"}
                onChange={() => setMethod("points")}
              />
              <Wallet className="text-[var(--color-primary)]" />
              <span className="font-medium">Points</span>
            </label>
          </div>

          {/* PAYLATER */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={method === "paylater"}
                onChange={() => setMethod("paylater")}
              />
              <span className="font-medium">
                Daraz PayLater by Koko |{" "}
                <span className="text-green-600">0% Interest</span>
              </span>
            </label>
          </div>

          {/* CASH ON DELIVERY */}
          <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                checked={method === "cod"}
                onChange={() => setMethod("cod")}
              />
              <Truck className="text-[var(--color-primary)]" />
              <span className="font-medium">Cash on Delivery</span>
            </label>
          </div>
        </div>

        {/* RIGHT – ORDER SUMMARY */}
        <div className="bg-[var(--bg-card)] border-2 border-[var(--border)] rounded-xl p-6 h-fit sticky top-4">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total Amount</span>
            <span className="text-[var(--color-primary)]">
              Rs. {cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </span>
          </div>

          <button 
            onClick={handlePlaceOrder}
            className="w-full mt-6 py-4 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold text-lg">
            Confirm Order
          </button>
        </div>
      </div>

      {/* ADD CARD POPUP */}
      {showAddCard && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[var(--bg-card)] w-full max-w-md p-6 rounded-2xl">
            <div className="flex justify-between mb-4">
              <h3 className="text-xl font-bold">Add Card</h3>
              <button onClick={() => setShowAddCard(false)}>
                <X />
              </button>
            </div>

            <input
              className="input"
              placeholder="Card Holder"
              name="cardHolder"
              value={newCard.cardHolder}
              onChange={handleInputChange}
            />
            <input
              className="input mt-2"
              placeholder="Card Number"
              name="cardNumber"
              value={newCard.cardNumber}
              onChange={handleInputChange}
            />
            <input
              className="input mt-2"
              placeholder="MM/YY"
              name="expiry"
              value={newCard.expiry}
              onChange={handleInputChange}
            />

            <label className="flex items-center gap-2 mt-3">
              <input
                type="checkbox"
                name="isDefault"
                checked={newCard.isDefault}
                onChange={handleInputChange}
              />
              Set as Default
            </label>

            <button
              onClick={handleSaveCard}
              className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
            >
              Save Card
            </button>
          </div>
        </div>
      )}

      {/* INPUT STYLE */}
      <style>{`
        .input {
          width: 100%;
          padding: 12px;
          border-radius: 10px;
          border: 2px solid var(--border);
          background: var(--bg-main);
        }
      `}</style>
    </div>
  );
}
