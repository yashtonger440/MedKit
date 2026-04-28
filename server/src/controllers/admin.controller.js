import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

// 📊 Get Dashboard Stats
export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalBookings = await Booking.countDocuments();

    res.json({
      totalUsers,
      totalDoctors,
      totalBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
};

// 🩺 Get All Doctors
export const getAllDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: "doctor" });
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Error fetching doctors" });
  }
};

// Approve Doctor
export const approveDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, {
      status: "approved",
    });

    res.json({ message: "Doctor approved" });
  } catch (error) {
    res.status(500).json({ message: "Error approving doctor" });
  }
};

// ❌ Reject Doctor
export const rejectDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, {
      status: "rejected",
    });

    res.json({ message: "Doctor rejected" });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting doctor" });
  }
};