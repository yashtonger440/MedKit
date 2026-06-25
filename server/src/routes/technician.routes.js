import express from "express";
import {
  getTechnicianBookings,
  updateBookingStatus,
  getTechnicianProfile,
  updateTechnicianProfile,
  getTechnicianStats,
  createTechnicianBooking,
  getUserTechnicianBookings,
} from "../controllers/technicianController.js";
import { protect, isTechnician } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";
import User from "../models/user.model.js";

const router = express.Router();

// User routes
router.post("/book", protect, createTechnicianBooking);
router.get("/my-bookings", protect, getUserTechnicianBookings);

// Technician routes
router.get("/bookings", protect, isTechnician, getTechnicianBookings);
router.put("/bookings/:id/status", protect, isTechnician, updateBookingStatus);
router.get("/profile", protect, isTechnician, getTechnicianProfile);
router.put("/profile", protect, isTechnician, updateTechnicianProfile);
router.get("/stats", protect, isTechnician, getTechnicianStats);

// Profile image upload — Cloudinary
router.post("/profile/upload-image", protect, isTechnician, upload.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path;
    await User.findByIdAndUpdate(req.user._id, { profileImage: imageUrl });
    res.json({ imageUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;