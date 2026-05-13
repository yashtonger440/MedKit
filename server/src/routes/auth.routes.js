import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import User from "../models/user.model.js"
import { JWT_SECRET } from "../config/env.js"
import upload from "../middleware/upload.js"

const router = express.Router();

// User Signup
router.post("/signup", async (req, res) => {
  const { name, email, password, phone } = req.body;

  const exists = await User.findOne({ email });
  if (exists) return res.json({ message: "User exists" });

  const hashed = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hashed, phone, role: "user", status: "approved" });

  res.json({ message: "Signup success" });
});

// User Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Email or password is incorrect" });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(200).json({ token, user });
});

// Doctor Signup
router.post("/doctor-signup",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, specialization, experience } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "Doctor already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const doctor = new User({
        name, email,
        password: hashed,
        role: "doctor",
        specialization,
        experience,
        status: "pending",
        profileImage: req.files?.profileImage?.[0]?.filename || "",
        certificate: req.files?.certificate?.[0]?.filename || "",
      });

      await doctor.save();
      res.json({ message: "Doctor registration successfully" });
    } catch (err) {
      res.status(500).json({ message: "Error in doctor signup" });
    }
  }
);

// Doctor Login
router.post("/doctor-login", async (req, res) => {
  const { email, password } = req.body;

  const doctor = await User.findOne({ email, role: "doctor" });
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });

  const isMatch = await bcrypt.compare(password, doctor.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  if (doctor.status !== "approved") {
    return res.status(403).json({ message: "Wait for admin approval" });
  }

  const token = jwt.sign(
    { id: doctor._id, role: doctor.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, user: doctor });
});

// Technician Signup
router.post("/technician-signup",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "certificate", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { name, email, password, experience } = req.body;

      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: "Technician already exists" });

      const hashed = await bcrypt.hash(password, 10);

      const technician = new User({
        name, email,
        password: hashed,
        role: "technician",
        experience,
        status: "pending",
        profileImage: req.files?.profileImage?.[0]?.filename || "",
        certificate: req.files?.certificate?.[0]?.filename || "",
      });

      await technician.save();
      res.json({ message: "Technician registration successful" });
    } catch (err) {
      res.status(500).json({ message: "Error in technician signup" });
    }
  }
);

// Technician Login
router.post("/technician-login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const technician = await User.findOne({ email, role: "technician" });
    if (!technician) return res.status(404).json({ message: "Technician not found" });

    const isMatch = await bcrypt.compare(password, technician.password);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    if (technician.status === "pending") {
      return res.status(403).json({ message: "Your account is pending admin approval" });
    }

    if (technician.status === "rejected") {
      return res.status(403).json({ message: "Your account has been rejected by admin" });
    }

    const token = jwt.sign(
      { id: technician._id, role: technician.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token, user: technician });
  } catch (err) {
    res.status(500).json({ message: "Error in technician login" });
  }
});

export default router;