// hash.js
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ DB Connected");

    const hashed = await bcrypt.hash("admin123", 10);

    await User.findOneAndUpdate(
      { email: "admin@medkit.com" },         // find by email
      {
        name: "Admin",
        email: "admin@medkit.com",
        password: hashed,
        role: "admin",                        // ✅ critical field
      },
      { upsert: true, new: true }            // create if not exists
    );

    console.log("✅ Admin created successfully in DB");
    await mongoose.disconnect();
  } catch (err) {
    console.error("❌ Error:", err);
  }
};

createAdmin();