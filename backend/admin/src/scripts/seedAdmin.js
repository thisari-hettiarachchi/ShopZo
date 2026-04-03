import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import connectDB from "../config/db.js";
import AdminUser from "../models/AdminUser.js";

dotenv.config();

const seedAdmin = async () => {
  const email = process.env.ADMIN_EMAIL || "admin@shopzo.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const name = process.env.ADMIN_NAME || "ShopZo Admin";

  try {
    await connectDB();

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await AdminUser.updateOne(
      { email },
      {
        $set: {
          name,
          email,
          password: hashedPassword,
          role: "admin",
        },
      },
      { upsert: true }
    );

    const created = Boolean(result.upsertedCount);
    console.log(
      created
        ? `Admin credentials created in admins collection: ${email}`
        : `Admin credentials updated in admins collection: ${email}`
    );

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin user", error.message);
    process.exit(1);
  }
};

seedAdmin();
