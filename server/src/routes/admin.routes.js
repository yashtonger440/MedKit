import express from "express";
import {
  getAdminStats,
  getAllDoctors,
  approveDoctor,
  rejectDoctor,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middleware/auth.middleware.js";

const router = express.Router();

// Dashboard
router.get("/stats", isAdmin, getAdminStats);

// Doctors
router.get("/doctors", getAllDoctors);
router.put("/doctor/:id/approve", isAdmin, approveDoctor);
router.put("/doctor/:id/reject", isAdmin, rejectDoctor);

export default router;