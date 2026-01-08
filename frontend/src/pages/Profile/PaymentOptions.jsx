import React, { useState, useEffect } from "react";
import { CreditCard, Edit2, Plus, X } from "lucide-react";
import { getCards, addCard, setDefaultCardApi, updateCardApi } from "../../services/paymentService";

export default function PaymentOptions() {
  const [cards, setCards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCardId, setEditingCardId] = useState(null);
  const [formCard, setFormCard] = useState({
    cardHolder: "",
    cardNumber: "",
    expiry: "",
    isDefault: false,
  });

  // Fetch cards on mount
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await getCards();
        setCards(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load cards");
      }
    };
    fetchCards();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "expiry") {
      let val = value.replace(/\D/g, "");
      if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
      setFormCard((prev) => ({ ...prev, [name]: val }));
    } else {
      setFormCard((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

  // Open form to add new card
  const handleAddNew = () => {
    setFormCard({ cardHolder: "", cardNumber: "", expiry: "", isDefault: false });
    setEditingCardId(null);
    setShowForm(true);
  };

  // Open form to edit existing card
  const handleEditCard = (card) => {
    setFormCard({ ...card });
    setEditingCardId(card._id);
    setShowForm(true);
  };

  // Save card (add or edit)
  const handleSaveCard = async () => {
    const [month, year] = formCard.expiry.split("/");
    if (!month || !year || Number(month) < 1 || Number(month) > 12 || year.length !== 2) {
      return alert("Invalid expiry date");
    }

    try {
      let res;
      if (editingCardId) {
        // Update existing card
        res = await updateCardApi(editingCardId, formCard);
        setCards((prev) => prev.map((c) => (c._id === editingCardId ? res.data : c)));
      } else {
        // Add new card
        res = await addCard(formCard);
        setCards((prev) => [...prev, res.data]);
      }
      setFormCard({ cardHolder: "", cardNumber: "", expiry: "", isDefault: false });
      setEditingCardId(null);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert(editingCardId ? "Failed to update card" : "Failed to add card");
    }
  };

  // Set default card
  const handleSetDefault = async (id) => {
    try {
      await setDefaultCardApi(id);
      setCards((prev) => prev.map((card) => ({ ...card, isDefault: card._id === id })));
    } catch (err) {
      console.error(err);
      alert("Failed to set default card");
    }
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-2xl"
      style={{ backgroundColor: "var(--bg-card)", boxShadow: "0 10px 40px var(--shadow)" }}
    >
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Payment Options
      </h2>

      <div className="flex flex-col gap-6">
        {/* Existing Cards */}
        {cards.map((card) => (
          <div
            key={card._id}
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div className="flex items-center gap-4">
              <CreditCard size={32} style={{ color: "var(--color-primary)" }} />
              <div>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {card.cardHolder}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  {card.cardNumber}
                </p>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  Exp: {card.expiry}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={() => handleSetDefault(card._id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  card.isDefault
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                {card.isDefault ? "Default Card" : "Set as Default"}
              </button>

              <button
                onClick={() => handleEditCard(card)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-sm font-medium border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              >
                <Edit2 size={16} /> EDIT
              </button>
            </div>
          </div>
        ))}

        {/* Add/Edit Card Form */}
        {showForm && (
          <div
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col gap-3"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg" style={{ color: "var(--text-primary)" }}>
                {editingCardId ? "Edit Card" : "Add New Card"}
              </h3>
              <button onClick={() => setShowForm(false)}>
                <X size={20} />
              </button>
            </div>

            <input
              type="text"
              name="cardHolder"
              placeholder="Card Holder Name"
              value={formCard.cardHolder}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={formCard.cardNumber}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />
            <input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={formCard.expiry}
              onChange={handleInputChange}
              maxLength={5}
              className="w-full p-3 rounded-lg border-2 border-[var(--border)]"
            />

            <label className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                name="isDefault"
                checked={formCard.isDefault}
                onChange={handleInputChange}
              />
              Set as Default
            </label>

            <button
              onClick={handleSaveCard}
              className="mt-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white font-semibold"
            >
              {editingCardId ? "Update Card" : "Save Card"}
            </button>
          </div>
        )}

        {/* Add New Card Button */}
        {!showForm && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed text-[var(--color-primary)] font-semibold hover:bg-[var(--bg-hover)] transition-all duration-300 justify-center"
          >
            <Plus size={20} /> ADD NEW CARD
          </button>
        )}
      </div>
    </div>
  );
}
