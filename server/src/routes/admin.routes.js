import express from "express";
import User from "../models/user.model.js"; // ← ADDED
import {
  getAdminStats,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  deleteUser,
  getBookings,
  updateBookingStatus,
  getBookingStats
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Dashboard
router.get("/stats", isAdmin, getAdminStats);

// Doctors
router.get("/doctors", isAdmin, getAllDoctors);
router.put("/doctor/:id/approve", isAdmin, approveDoctor);
router.put("/doctor/:id/reject", isAdmin, rejectDoctor);

// Users
router.get("/users", isAdmin, getAllUsers);
router.delete("/user/:id", isAdmin, deleteUser);

// Bookings
router.get("/booking-stats", isAdmin, getBookingStats);
router.get("/bookings", isAdmin, getBookings);
router.put("/booking/:id/status", isAdmin, updateBookingStatus); // ← FIXED (was GET + typo)

// Technicians
router.get("/technicians", isAdmin, async (req, res) => {
  try {
    const technicians = await User.find({ role: "technician" }).select("-password");
    res.json(technicians);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/technician/:id/approve", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "approved" });
    res.json({ message: "Technician approved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/technician/:id/reject", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { status: "rejected" });
    res.json({ message: "Technician rejected" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/technician/:id", isAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Technician deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;