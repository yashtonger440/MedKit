import express from "express";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";
import { uploadReport } from "../middleware/upload.js";

const router = express.Router();

const getToken = (req) => {
  const auth = req.headers.authorization;
  return auth?.startsWith("Bearer ") ? auth.split(" ")[1] : auth;
};

router.post("/", uploadReport.single("report"), async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);

    // NOTE: req.body now comes from FormData (not JSON) because frontend
    // switched to multipart/form-data to support file upload
    const { date, time, service, address, phone, price, type, doctorId } = req.body;

    console.log("service received:", service);
    console.log("type received:", type);
    console.log("report file:", req.file?.filename || "No report uploaded");

    let doctor;

    if (doctorId) {
      doctor = await User.findById(doctorId);
    } else {
      doctor = await User.findOne({
        role: "doctor",
        status: "approved",
        specialization: { $regex: service, $options: "i" },
      });
    }

    console.log("Doctor found:", doctor);

    if (!doctor) {
      return res.status(404).json({ message: "No doctor available for this service" });
    }

    const dateTime = new Date(`${date}T${time}`);

    const booking = await Booking.create({
      service,
      date: dateTime,
      address,
      phone,
      price,
      type: type || "Call",
      user: decoded.id,
      doctor: doctor._id,
      status: "pending",

      // save report file path if user uploaded one, else null
      reportUrl: req.file ? `/uploads/reports/${req.file.filename}` : null,
    });

    res.json(booking);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

router.get("/my", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const bookings = await Booking.find({ user: decoded.id })
      .populate("doctor", "name specialization profileImage") // get doctor info
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.log("REAL ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// GET DOCTOR'S BOOKINGS — doctor sees requests sent to them
router.get("/doctor", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);

    const bookings = await Booking.find({ doctor: decoded.id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctor bookings" });
  }
});

// UPDATE STATUS — doctor accepts/rejects/completes
router.put("/:id/status", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);
    const { status } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

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

// GET ALL APPROVED DOCTORS 
router.get("/doctors", async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor", status: "approved" })
      .select("name specialization profileImage");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
});

// SAVE PRESCRIPTION — doctor writes notes + medicines
router.post("/:id/prescription", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);
    const { notes, medicines } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the assigned doctor can write prescription for this booking
    if (booking.doctor.toString() !== decoded.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Save prescription inside the booking document
    booking.prescription = {
      notes,
      medicines,
      createdAt: new Date(),
    };

    await booking.save();

    res.json({ message: "Prescription saved successfully", prescription: booking.prescription });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to save prescription" });
  }
});

// GET PRESCRIPTION — user reads doctor's prescription
router.get("/:id/prescription", async (req, res) => {
  try {
    const decoded = jwt.verify(getToken(req), JWT_SECRET);

    const booking = await Booking.findById(req.params.id)
      .populate("doctor", "name specialization profileImage");

    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only the booking's user or doctor can read the prescription
    const isUser = booking.user.toString() === decoded.id;
    const isDoctor = booking.doctor._id.toString() === decoded.id;

    if (!isUser && !isDoctor) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json({
      prescription: booking.prescription,
      doctor: booking.doctor, // so user knows which doctor wrote it
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch prescription" });
  }
});

export default router;