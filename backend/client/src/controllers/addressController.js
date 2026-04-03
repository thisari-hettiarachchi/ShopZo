import User from "../models/User.js";

export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.addresses || []);
  } catch (error) {
    console.error("Error fetching addresses:", error);
    res.status(500).json({ message: "Failed to fetch addresses" });
  }
};

export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAddress = {
      ...req.body,
      id: Date.now(),
      isDefaultShipping: !!req.body.isDefaultShipping,
      isDefaultBilling: !!req.body.isDefaultBilling,
    };
    user.addresses = user.addresses ? [...user.addresses, newAddress] : [newAddress];
    await user.save();
    res.json(newAddress);
  } catch (error) {
    console.error("Error adding address:", error);
    res.status(500).json({ message: "Failed to add address" });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const index = user.addresses.findIndex(addr => addr.id == req.params.id);
    if (index === -1) return res.status(404).json({ message: "Address not found" });
    user.addresses[index] = { ...user.addresses[index], ...req.body };
    await user.save();
    res.json(user.addresses[index]);
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ message: "Failed to update address" });
  }
};

export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const type = req.body.type; 
    user.addresses = user.addresses.map(addr => ({
      ...addr,
      isDefaultShipping: type === "shipping" ? addr.id == req.params.id : addr.isDefaultShipping,
      isDefaultBilling: type === "billing" ? addr.id == req.params.id : addr.isDefaultBilling
    }));
    await user.save();
    res.json({ message: "Default updated" });
  } catch (error) {
    console.error("Error setting default address:", error);
    res.status(500).json({ message: "Failed to set default address" });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const beforeCount = user.addresses.length;
    user.addresses = user.addresses.filter((addr) => addr.id != req.params.id);

    if (user.addresses.length === beforeCount) {
      return res.status(404).json({ message: "Address not found" });
    }

    await user.save();
    res.json({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Error deleting address:", error);
    res.status(500).json({ message: "Failed to delete address" });
  }
};
