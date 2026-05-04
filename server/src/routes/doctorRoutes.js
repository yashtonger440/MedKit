import express from "express";
import {
  getDoctorBookings,
  updateBookingStatus,
  getDoctorProfile,
  updateDoctorProfile,
  getDoctorStats,
} from "../controllers/doctorController.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Bookings
router.get("/bookings/doctor", protect, getDoctorBookings);
router.put("/bookings/:id/status", protect, updateBookingStatus);

// Profile
router.get("/doctor/profile", protect, getDoctorProfile);
router.put("/doctor/profile", protect, updateDoctorProfile);

// Stats
router.get("/doctor/stats", protect, getDoctorStats);

export default router;