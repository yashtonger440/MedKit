import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  service: String,
  date: String,
  address: String,
  phone: String,
  price: Number,
  status: {
    type: String,
    default: "pending",
  },
}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);