import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  service: String,
  date: String,
  address: String,
  phone: String,
  price: Number,

  // ✅ NEW — user ne kya book kiya: Call, Video, Home Visit
  type: {
    type: String,
    enum: ["Call", "Video", "Home Visit"],
    default: "Call",
  },

  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
  },
  review: {
    rating: Number,
    comment: String,
  },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);
