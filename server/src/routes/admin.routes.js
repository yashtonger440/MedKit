import express from "express";
import {
  getAdminStats,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
  getAllUsers,
  deleteUser
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

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

export default router;