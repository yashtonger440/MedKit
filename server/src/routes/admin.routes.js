import express from "express";
import {
  getAdminStats,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  deleteUser,
  getBookings,
  updateBookingStatus
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";
import { getBookingStats } from "../controllers/admin.controller.js";

const router = express.Router();

// Dashboard
router.get("/stats", isAdmin, getAdminStats);

// Doctors
router.get("/doctors", isAdmin, getAllDoctors);
router.put("/doctor/:id/approve", isAdmin, approveDoctor);
router.put("/doctor/:id/reject", isAdmin, rejectDoctor);

// User ROUTES
router.get("/users", isAdmin, getAllUsers);
router.delete("/user/:id", isAdmin, deleteUser);

router.get("/booking-stats", isAdmin, getBookingStats);

router.get("/bookings", isAdmin, getBookings);
router.get("/boking/:id/status", isAdmin, updateBookingStatus);

export default router;