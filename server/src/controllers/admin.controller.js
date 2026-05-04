import User from "../models/user.model.js";
import Booking from "../models/booking.model.js";

// Get Dashboard Stats
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

// Get All Users (ONLY role = user)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" }).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Get All Doctors
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

// Reject Doctor
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

// Booking Analytics (Last 7 Days)
export const getBookingStats = async (req, res) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking stats" });
  }
};

// Get All Bookings (for AdminBookings.jsx)
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")        // gives b.user?.name, b.user?.email
      // .populate("doctor", "name specialization") // gives b.doctor?.name, b.doctor?.specialization
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

// Update Booking Status (Complete / Cancel buttons)
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const updated = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status" });
  }
};