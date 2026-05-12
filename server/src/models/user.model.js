import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  
  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },

  // Doctor specific fields
  specialization: String,
  experience: Number,
  fee: Number,
  profileImage: String,
  certificate: String,

  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("User", userSchema);