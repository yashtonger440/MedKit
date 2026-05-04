import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String, // ← ADD: missing tha, dashboard mein use ho raha hai

  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },

  // Doctor specific fields
  specialization: String,
  experience: Number,
  fee: Number,           // ← ADD: booking mein price chahiye hoga
  profileImage: String,
  certificate: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true }); // ← ADD: createdAt/updatedAt useful hoga

export default mongoose.model("User", userSchema);