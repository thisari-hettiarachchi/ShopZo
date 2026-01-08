import Card from "../models/Card.js";

// GET /api/users/cards
export const getCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user._id });
    res.json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// POST /api/users/cards
export const addCard = async (req, res) => {
  try {
    const { cardHolder, cardNumber, expiry, isDefault } = req.body;

    if (isDefault) {
      // remove default from existing cards
      await Card.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const card = new Card({ user: req.user._id, cardHolder, cardNumber, expiry, isDefault });
    const savedCard = await card.save();
    res.status(201).json(savedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// PATCH /api/users/cards/:id/default
export const setDefaultCard = async (req, res) => {
  try {
    const { id } = req.params;

    // reset default for all cards
    await Card.updateMany({ user: req.user._id }, { isDefault: false });

    const card = await Card.findByIdAndUpdate(id, { isDefault: true }, { new: true });
    if (!card) return res.status(404).json({ message: "Card not found" });

    res.json(card);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { cardHolder, cardNumber, expiry, isDefault } = req.body;

    if (isDefault) {
      await Card.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const updatedCard = await Card.findByIdAndUpdate(
      id,
      { cardHolder, cardNumber, expiry, isDefault },
      { new: true }
    );

    if (!updatedCard) return res.status(404).json({ message: "Card not found" });

    res.json(updatedCard);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};