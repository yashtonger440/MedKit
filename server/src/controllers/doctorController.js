import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";

// ─── GET /api/bookings/doctor ───────────────────────────────
// Doctor ke saare bookings fetch karo
export const getDoctorBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ doctor: req.user._id })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/bookings/:id/status ──────────────────────────
// Doctor booking ka status update kare (accept/reject/complete)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = ["accepted", "cancelled", "completed"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, doctor: req.user._id }, // sirf apni booking update kare
      { status },
      { new: true }
    ).populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/doctor/profile ───────────────────────────────
// Doctor apni profile dekhe
export const getDoctorProfile = async (req, res) => {
  try {
    const doctor = await User.findById(req.user._id).select("-password");
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── PUT /api/doctor/profile ───────────────────────────────
// Doctor apni profile update kare
export const updateDoctorProfile = async (req, res) => {
  try {
    const { name, phone, specialization, experience, fee } = req.body;

    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, specialization, experience, fee },
      { new: true }
    ).select("-password");

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ─── GET /api/doctor/stats ─────────────────────────────────
// Dashboard stats — total, pending, accepted, completed
export const getDoctorStats = async (req, res) => {
  try {
    const bookings = await Booking.find({ doctor: req.user._id });

    const stats = {
      total:     bookings.length,
      pending:   bookings.filter((b) => b.status === "pending").length,
      accepted:  bookings.filter((b) => b.status === "accepted").length,
      completed: bookings.filter((b) => b.status === "completed").length,
      cancelled: bookings.filter((b) => b.status === "cancelled").length,
      earnings:  bookings
                   .filter((b) => b.status === "completed")
                   .reduce((sum, b) => sum + (b.price || 0), 0),
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};