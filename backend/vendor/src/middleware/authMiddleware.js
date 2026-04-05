import jwt from "jsonwebtoken";
import Vendor from "../models/Vendor.js";

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    const vendor = await Vendor.findById(decoded.id).select("_id accountStatus isApproved");
    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    const accountStatus = vendor.accountStatus || (vendor.isApproved ? "approved" : "pending");

    req.user = { id: decoded.id, role: decoded.role, accountStatus };
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
