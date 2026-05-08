import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUserMd,
  FaClock,
  FaShieldAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
} from "react-icons/fa";

const Booking = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    service: "Doctor Consultation",
    date: "",
    time: "",
    address: "",
    phone: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const services = [
    { name: "Doctor Consultation", price: 499 },
    { name: "Ambulance Service", price: 1200 },
    { name: "Emergency Care", price: 999 },
    { name: "Injection at Home", price: 120 },
    { name: "IV Drip Administration", price: 300 },
    { name: "ECG Test at Home", price: 400 },
    { name: "Physiotherapy", price: 500 },
    { name: "BP & Sugar Check", price: 199 },
    { name: "Blood Test at Home", price: 499 },
    { name: "Dog Bite injection", price: 300 },
    { name: "Snake Bite", price: 500 },
    { name: "Minor Dressing", price: 200 },
    { name: "Major Dressing", price: 400 },
    { name: "Burn dressing", price: 300 },
    { name: "Plaster Application", price: 600 },
    { name: "Plaster Removal", price: 300 },
  ];

  const selectedService = services.find((s) => s.name === form.service);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bookings", {
        ...form,
        price: selectedService.price,
      });

      alert("Booking successful");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen mt-4 bg-linear-to-br from-blue-50 to-cyan-100 px-6 py-20">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT PANEL */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40">

            <h2 className="text-3xl font-bold text-gray-800">
              Book Healthcare Service
            </h2>

            <p className="text-gray-600 mt-3">
              Get professional healthcare services at your home quickly and safely.
            </p>

            {/* IMAGE ADDED */}
            <img
              src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare"
              className="mt-5 rounded-2xl h-48 w-full object-cover shadow-md"
            />

            <div className="mt-8 space-y-5">

              <div className="flex gap-4 items-center">
                <FaUserMd className="text-blue-500 text-xl" />
                <p className="text-gray-700">Certified professionals</p>
              </div>

              <div className="flex gap-4 items-center">
                <FaClock className="text-blue-500 text-xl" />
                <p className="text-gray-700">Response within 30 minutes</p>
              </div>

              <div className="flex gap-4 items-center">
                <FaShieldAlt className="text-blue-500 text-xl" />
                <p className="text-gray-700">100% safe & hygienic</p>
              </div>

            </div>

            <div className="mt-4 bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">
                ⚡ Need urgent help? Call now:
              </p>
              <p className="text-lg font-bold text-blue-600 flex items-center gap-2 mt-1">
                <FaPhoneAlt /> 9818185270
              </p>
            </div>

          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* SERVICE */}
              <select
                name="service"
                value={form.service}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                {services.map((s, i) => (
                  <option key={i} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>

              {/* DATE & TIME */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* ADDRESS */}
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* PHONE */}
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                required
              />

              {/* NOTES */}
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
                className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* PRICE */}
              <div className="flex justify-between items-center bg-linear-to-r from-blue-50 to-cyan-50 p-4 rounded-xl shadow-inner">
                <span className="font-medium text-gray-700">
                  Total Price
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{selectedService.price}
                </span>
              </div>

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-105 transition shadow-lg"
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </button>

            </form>
          </div>

        </div>

      </div>

      <Footer />
    </>
  );
};

export default Booking;