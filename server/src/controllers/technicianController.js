import TechnicianBooking from "../models/technicianBooking.model.js";
import User from "../models/user.model.js";

// Technician ke saare bookings
export const getTechnicianBookings = async (req, res) => {
  try {
    const bookings = await TechnicianBooking.find({ 
      $or: [
        { technician: null, status: "pending"},
        { technician: req.user._id },
      ]
    })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Booking status update
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["accepted", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    if (status === "accepted") {
      const booking = await TechnicianBooking.findOne({
        _id: req.params.id,
        technician: null,
        status: "pending",
      });

      if (!booking) {
        return res.status(400).json({
          message: "This booking has already been accepted by another technician"
        });
      }

      booking.technician = req.user._id;
      booking.status = "accepted";
      await booking.save();

      return res.json(booking);
    }

    // Complete ya cancel — sirf apni booking pe
    const booking = await TechnicianBooking.findOneAndUpdate(
      { _id: req.params.id, technician: req.user._id },
      { status },
      { new: true }
    ).populate("user", "name email phone");

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Technician profile
export const getTechnicianProfile = async (req, res) => {
  try {
    const technician = await User.findById(req.user._id).select("-password");
    res.json(technician);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Profile update
export const updateTechnicianProfile = async (req, res) => {
  try {
    const { name, phone, experience } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, experience },
      { new: true }
    ).select("-password");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Stats
export const getTechnicianStats = async (req, res) => {
  try {
    const bookings = await TechnicianBooking.find({ technician: req.user._id });
    const stats = {
      total:     bookings.length,
      pending:   bookings.filter(b => b.status === "pending").length,
      accepted:  bookings.filter(b => b.status === "accepted").length,
      completed: bookings.filter(b => b.status === "completed").length,
      cancelled: bookings.filter(b => b.status === "cancelled").length,
      earnings:  bookings
        .filter(b => b.status === "completed")
        .reduce((sum, b) => sum + (b.price || 0), 0),
    };
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User technician booking create
export const createTechnicianBooking = async (req, res) => {
  try {
    const { service, address, phone, notes, price, date, time } = req.body;

    const booking = await TechnicianBooking.create({
      user: req.user._id,
      technician: null,
      service,
      date,
      time,
      address,
      phone,
      notes,
      price,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// User ki bookings
export const getUserTechnicianBookings = async (req, res) => {
  try {
    const bookings = await TechnicianBooking.find({ user: req.user._id })
      .populate("technician", "name phone")
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
