import express from "express";
import Booking from "../models/booking.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

const router = express.Router();

// CREATE BOOKING
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);

    const { date, time, service, address, phone, price } = req.body;

    // Merge date + time
    const dateTime = new Date(`${date}T${time}`);

    const booking = await Booking.create({
      service,
      date: dateTime, // combined datetime
      address,
      phone,
      price,
      user: decoded.id,
    });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Booking failed" });
  }
});

// GET MY BOOKINGS
router.get("/my", async (req, res) => {
  try {
    const token = req.headers.authorization;

    const decoded = jwt.verify(token, JWT_SECRET);

    const bookings = await Booking.find({ user: decoded.id }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
});

export default router;
