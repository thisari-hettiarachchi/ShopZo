import React, { useState } from "react";
import { CreditCard, Edit2, Plus } from "lucide-react";

export default function PaymentOptions() {
  const [cards, setCards] = useState([
    {
      id: 1,
      cardHolder: "Thisari Hettiarachchi",
      cardNumber: "**** **** **** 1234",
      expiry: "12/26",
      isDefault: true,
    },
    {
      id: 2,
      cardHolder: "Thisari Hettiarachchi",
      cardNumber: "**** **** **** 5678",
      expiry: "08/25",
      isDefault: false,
    },
  ]);

  const setDefaultCard = (id) => {
    setCards((prev) =>
      prev.map((card) => ({ ...card, isDefault: card.id === id }))
    );
  };

  const editCard = (id) => {
    alert(`Edit Card ID: ${id}`);
  };

  const addNewCard = () => {
    alert("Add New Card");
  };

  return (
    <div
      className="p-6 rounded-2xl shadow-2xl"
      style={{
        backgroundColor: "var(--bg-card)",
        boxShadow: "0 10px 40px var(--shadow)",
      }}
    >
      <h2
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--text-primary)" }}
      >
        Payment Options
      </h2>

      <div className="flex flex-col gap-6">
        {cards.map((card) => (
          <div
            key={card.id}
            className="p-5 rounded-2xl border-2 border-[var(--border)] flex flex-col md:flex-row md:justify-between md:items-center gap-4"
            style={{ backgroundColor: "var(--bg-muted)" }}
          >
            <div className="flex items-center gap-4">
              <CreditCard size={32} style={{ color: "var(--color-primary)" }} />
              <div>
                <p
                  className="font-semibold text-sm"
                  style={{ color: "var(--text-primary)" }}
                >
                  {card.cardHolder}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {card.cardNumber}
                </p>
                <p
                  className="text-sm"
                  style={{ color: "var(--text-secondary)" }}
                >
                  Exp: {card.expiry}
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 mt-3 md:mt-0">
              <button
                onClick={() => setDefaultCard(card.id)}
                className={`px-3 py-1 rounded-lg text-sm font-medium border-2 transition-all duration-300 ${
                  card.isDefault
                    ? "bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white border-transparent"
                    : "border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                }`}
              >
                {card.isDefault ? "Default Card" : "Set as Default"}
              </button>

              <button
                onClick={() => editCard(card.id)}
                className="flex items-center gap-1 px-3 py-1 rounded-lg border-2 text-sm font-medium border-[var(--border)] text-[var(--text-primary)] hover:bg-[var(--bg-hover)] transition-all duration-300"
              >
                <Edit2 size={16} /> EDIT
              </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button
          onClick={addNewCard}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-dashed text-[var(--color-primary)] font-semibold hover:bg-[var(--bg-hover)] transition-all duration-300 justify-center"
        >
          <Plus size={20} /> ADD NEW CARD
        </button>
      </div>
    </div>
  );
}
