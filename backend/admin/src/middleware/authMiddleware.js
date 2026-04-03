import jwt from "jsonwebtoken";
import AdminUser from "../models/AdminUser.js";

export const protectAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const queryToken = req.query?.token;

  if ((!authHeader || !authHeader.startsWith("Bearer ")) && !queryToken) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = queryToken || authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await AdminUser.findById(decoded.id).select("-password");

    if (!user || user.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token invalid" });
  }
};
