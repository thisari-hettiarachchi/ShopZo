import User from "../models/User.js";

// For simplicity, assume addresses are stored in the User model:
// user.addresses = [{ id, fullName, addressLine, region, phone, isDefaultShipping, isDefaultBilling }]
// You can adjust based on your actual schema

export const getAddresses = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.addresses || []);
};

export const addAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const newAddress = { ...req.body, id: Date.now() }; // simple ID
  user.addresses = user.addresses ? [...user.addresses, newAddress] : [newAddress];
  await user.save();
  res.json(newAddress);
};

export const updateAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const index = user.addresses.findIndex(addr => addr.id == req.params.id);
  if (index === -1) return res.status(404).json({ message: "Address not found" });
  user.addresses[index] = { ...user.addresses[index], ...req.body };
  await user.save();
  res.json(user.addresses[index]);
};

export const setDefaultAddress = async (req, res) => {
  const user = await User.findById(req.user._id);
  const type = req.body.type; // 'shipping' or 'billing'
  user.addresses = user.addresses.map(addr => ({
    ...addr,
    isDefaultShipping: type === "shipping" ? addr.id == req.params.id : addr.isDefaultShipping,
    isDefaultBilling: type === "billing" ? addr.id == req.params.id : addr.isDefaultBilling
  }));
  await user.save();
  res.json({ message: "Default updated" });
};
