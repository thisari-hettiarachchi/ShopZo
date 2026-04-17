import User from "../models/User.js";
import Vendor from "../models/Vendor.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { storeName, email, password, documents = [] } = req.body;
    // Check if vendor already exists by email
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) return res.status(400).json({ message: "Email already exists" });
    const hashedPassword = await bcrypt.hash(password, 10);
    // Save vendor directly in Vendor collection
    const normalizedDocuments = Array.isArray(documents)
      ? documents
          .filter((item) => item && typeof item === "object")
          .map((item) => ({
            name: item.name || "",
            url: item.url || "",
            type: item.type || "",
            uploadedAt: item.uploadedAt || new Date(),
          }))
      : [];

    const vendor = new Vendor({
      storeName,
      email,
      password: hashedPassword,
      isApproved: false,
      accountStatus: "pending",
      approvalRequest: {
        status: "pending",
        requestedAt: new Date(),
        reviewedAt: null,
        message: "Vendor registered and awaiting approval",
      },
      verification: {
        email: {
          status: "pending",
          verifiedAt: null,
          note: "Email verification pending",
        },
        documents: {
          status: normalizedDocuments.length ? "pending" : "rejected",
          files: normalizedDocuments,
          reviewedAt: null,
          note: normalizedDocuments.length ? "Awaiting admin review" : "No verification documents uploaded",
        },
      },
    });
    await vendor.save();
    res.status(201).json({
      message: "Vendor registered successfully. Your account is pending admin approval.",
      workflow: {
        accountStatus: vendor.accountStatus,
        emailVerificationStatus: vendor.verification?.email?.status || "pending",
        documentVerificationStatus: vendor.verification?.documents?.status || "pending",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const vendor = await Vendor.findOne({ email });
    if (!vendor) return res.status(400).json({ message: "Invalid credentials" });
    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const accountStatus = vendor.accountStatus || (vendor.isApproved ? "approved" : "pending");

    const token = jwt.sign({ id: vendor._id, role: "vendor" }, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });
    res.json({ token, vendor: {
      id: vendor._id,
      storeName: vendor.storeName,
      email: vendor.email,
      phone: vendor.phone || '',
      address: vendor.address || '',
      description: vendor.description || '',
      profileImage: vendor.profileImage || '',
      isApproved: Boolean(vendor.isApproved),
      accountStatus,
      approvalRequest: {
        status: vendor.approvalRequest?.status || (accountStatus === "approved" ? "approved" : "pending"),
        requestedAt: vendor.approvalRequest?.requestedAt || null,
        reviewedAt: vendor.approvalRequest?.reviewedAt || null,
        message: vendor.approvalRequest?.message || "",
      },
      verification: {
        emailStatus: vendor.verification?.email?.status || "pending",
        documentStatus: vendor.verification?.documents?.status || "pending",
      },
      joined: vendor.createdAt,
    } });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
