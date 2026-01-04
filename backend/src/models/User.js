const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["user","vendor","admin"], default: "user" },

  cart: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      qty: { type: Number, default: 1 },
    }
  ],
  wishlist: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }
    }
  ]
}, { timestamps: true });
