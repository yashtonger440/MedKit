import mongoose from "mongoose";

const technicianBookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null, // auto-assign hoga
  },
  service: {
    type: String,
     enum: [
    "Injection at Home",
    "IV Drip Administration",
    "ECG Test at Home",
    "Nurse Visit at Home",
    "Physiotherapy",
    "BP & Sugar Check",
    "Blood Test at Home",
    "Minor Dressing",
    "Major Dressing",
    "Burn Dressing",
    "Plaster Application",
    "Plaster Removal",
  ],
    required: true,
  },
  date: { type: String, required: true },
  time: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "completed", "cancelled"],
    default: "pending",
  },
  notes: { type: String },
  review: {
    rating: Number,
    comment: String,
  },
}, { timestamps: true });

export default mongoose.model("TechnicianBooking", technicianBookingSchema);