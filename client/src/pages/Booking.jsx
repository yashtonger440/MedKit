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

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10">

          {/* LEFT INFO PANEL */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">

            <h2 className="text-3xl font-bold text-gray-800">
              Book Healthcare Service
            </h2>

            <p className="text-gray-600 mt-3">
              Get professional healthcare services at your home quickly and safely.
            </p>

            <div className="mt-8 space-y-5">

              <div className="flex gap-4 items-center">
                <FaUserMd className="text-blue-500 text-xl" />
                <p className="text-gray-700">Certified healthcare professionals</p>
              </div>

              <div className="flex gap-4 items-center">
                <FaClock className="text-blue-500 text-xl" />
                <p className="text-gray-700">Fast response within 30 minutes</p>
              </div>

              <div className="flex gap-4 items-center">
                <FaShieldAlt className="text-blue-500 text-xl" />
                <p className="text-gray-700">100% safe & hygienic service</p>
              </div>

              <div className="flex gap-4 items-center">
                <FaMapMarkerAlt className="text-blue-500 text-xl" />
                <p className="text-gray-700">Available in your local area</p>
              </div>

            </div>

            <div className="mt-10 bg-blue-50 p-4 rounded-xl">
              <p className="text-sm text-gray-700">
                ⚡ Need urgent help? Call now:
              </p>
              <p className="text-lg font-bold text-blue-600 flex items-center gap-2 mt-1">
                <FaPhoneAlt /> 9818185270
              </p>
            </div>

          </div>

          {/* RIGHT FORM */}
          <div className="bg-white shadow-xl rounded-2xl p-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Service */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Select Service
                </label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400"
                >
                  {services.map((s, i) => (
                    <option key={i} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                  required
                />

                <input
                  type="time"
                  name="time"
                  value={form.time}
                  onChange={handleChange}
                  className="p-3 border rounded-lg"
                  required
                />
              </div>

              {/* Address */}
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full p-3 border rounded-lg"
                required
              />

              {/* Phone */}
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone number"
                className="w-full p-3 border rounded-lg"
                required
              />

              {/* Notes */}
              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="Additional notes (optional)"
                className="w-full p-3 border rounded-lg"
              />

              {/* Price */}
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border">
                <span className="font-medium text-gray-700">
                  Total Price
                </span>
                <span className="text-xl font-bold text-blue-600">
                  ₹{selectedService.price}
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold hover:scale-105 transition"
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