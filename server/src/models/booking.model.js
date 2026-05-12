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

  // user ne kya book kiya: Call, Video, Home Visit
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

  // stores the uploaded report file path
  reportUrl: {
    type: String,
    default: null,
  },

  // stores doctor's prescription after consultation
  prescription: {
    notes: {
      type: String,
      default: "",
    },
    medicines: [
      {
        name:     { type: String },
        dose:     { type: String },
        duration: { type: String },
      }
    ],
    createdAt: {
      type: Date,
      default: null,
    },
  },

}, { timestamps: true });

export default mongoose.model("Booking", bookingSchema);