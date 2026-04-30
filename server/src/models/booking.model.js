import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  // ADD THIS — needed for b.doctor?.name and b.doctor?.specialization
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor",
  },

  service: String,
  date: String,
  address: String,
  phone: String,
  price: Number,
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending",
  },

  // ADD THIS — needed for b.review?.rating and b.review?.comment
  review: {
    rating: Number,
    comment: String,
  },

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);