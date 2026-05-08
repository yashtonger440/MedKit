import express from "express"
import authRoutes from "./auth.routes.js"
import bookingRoutes from "./booking.routes.js"
import adminRoutes from "./admin.routes.js"

const router = express.Router();

router.use("/auth", authRoutes);
router.post("/bookings", (req, res, next) => {
  console.log("=== INDEX ROUTER HIT ===");
  console.log("body:", req.body);
  next();
});
router.use("/bookings", bookingRoutes);
router.use("/admin", adminRoutes);

export default router;