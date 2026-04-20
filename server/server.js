const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/healthcare");

// Schema
const bookingSchema = new mongoose.Schema({
  name: String,
  phone: String,
  address: String,
  date: String,
  time: String,
  serviceName: String,
  price: Number,
});

const Booking = mongoose.model("Booking", bookingSchema);

// API
app.post("/api/bookings", async (req, res) => {
  const booking = new Booking(req.body);
  await booking.save();
  res.json({ message: "Booking saved" });
});

app.get("/api/bookings", async (req, res) => {
  const data = await Booking.find();
  res.json(data);
});

app.listen(5000, () => console.log("Server running on port 5000"));