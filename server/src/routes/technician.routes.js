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
import { protect } from "../middleware/auth.middleware.js";
import { isTechnician } from "../middleware/auth.middleware.js";

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

export default router;