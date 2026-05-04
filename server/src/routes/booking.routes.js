import express from "express";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const router = express.Router();

const getToken = (req) => {
  const auth = req.headers.authorization;
  return auth?.startsWith("Bearer ") ? auth.split(" ")[1] : auth;
};

// CREATE BOOKING (user sends request to a doctor)
router.post("/", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);
    const { date, time, service, address, phone, price, notes, doctorId } = req.body;

    const dateTime = new Date(`${date}T${time}`);

    const booking = await Booking.create({
      service,
      date: dateTime,
      address,
      phone,
      price,
      notes,
      user: decoded.id,
      doctor: doctorId || null, // attach doctor
      status: "pending",
    });

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

// GET MY BOOKINGS (user sees their bookings with doctor info + status)
router.get("/my", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const bookings = await Booking.find({ user: decoded.id })
      .populate("doctor", "name specialization profileImage")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (err) {
    console.log("🔥 REAL ERROR:", err);   // <-- MUST print
    res.status(500).json({ error: err.message });  // <-- change message
  }
});

// GET DOCTOR'S BOOKINGS (doctor sees requests sent to them)
router.get("/doctor", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);

    const bookings = await Booking.find({ doctor: decoded.id })
      .populate("user", "name email phone") // show patient info
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor bookings" });
  }
});

// UPDATE STATUS (doctor accepts/rejects/completes)
router.put("/:id/status", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the assigned doctor can update
    if (booking.doctor.toString() !== decoded.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = status;
    await booking.save();

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Error updating status" });
  }
});

// GET ALL APPROVED DOCTORS (for booking form dropdown)
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" })
      .select("name specialization profileImage");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

export default router;