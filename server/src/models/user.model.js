import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,

  role: {
    type: String,
    enum: ["user", "doctor", "admin"],
    default: "user",
  },

  // Doctor fields
  specialization: String,
  experience: Number,

  profileImage: String,
  certificate: String,

  status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
}
});

export default mongoose.model("User", userSchema);