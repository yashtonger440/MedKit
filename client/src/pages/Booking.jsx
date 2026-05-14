import { useState } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUserMd, FaClock, FaShieldAlt, FaPhoneAlt,
  FaCheckCircle, FaCalendarAlt,
} from "react-icons/fa";


const Booking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    service: location.state?.service || "Injection at Home",
    address: "",
    phone: "",
    notes: "",
    date: "",
    time: "",
  });

  const [loading, setLoading] = useState(false);
  const [booked, setBooked] = useState(false);

  const services = [
    { name: "Injection at Home",      price: 120 },
    { name: "IV Drip Administration", price: 300 },
    { name: "ECG Test at Home",       price: 400 },
    { name: "Nurse Visit at Home",    price: 699 },
    { name: "Physiotherapy",          price: 500 },
    { name: "BP & Sugar Check",       price: 199 },
    { name: "Blood Test at Home",     price: 499 },
    { name: "Minor Dressing",         price: 200 },
    { name: "Major Dressing",         price: 400 },
    { name: "Burn Dressing",          price: 300 },
    { name: "Plaster Application",    price: 600 },
    { name: "Plaster Removal",        price: 300 },
  ];

  const selectedService = services.find((s) => s.name === form.service);
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.post("/technician/book", {
        service: form.service,
        address: form.address,
        phone: form.phone,
        notes: form.notes,
        price: selectedService.price,
        date: form.date,
        time: form.time,
      });
      setBooked(true);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <>
      <Navbar />

      <div className="min-h-screen mt-5 bg-linear-to-br from-blue-50 to-cyan-100 px-6 py-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT PANEL */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40">

            <h2 className="text-3xl font-bold text-gray-800">
              Book Healthcare Service
            </h2>

            <p className="text-gray-600 mt-3">
              Schedule a professional healthcare visit at your doorstep.
            </p>

            <img
              src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare"
              className="mt-5 rounded-2xl h-48 w-full object-cover shadow-md"
            />

            <div className="mt-8 space-y-4">
              <div className="flex gap-4 items-center">
                <FaCalendarAlt className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-800">Schedule at Your Convenience</p>
                  <p className="text-sm text-gray-500">Pick your preferred date & time</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <FaClock className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-800">Flexible Timings</p>
                  <p className="text-sm text-gray-500">Available morning to evening</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <FaUserMd className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-800">Certified Professionals</p>
                  <p className="text-sm text-gray-500">Trained & verified technicians</p>
                </div>
              </div>
              <div className="flex gap-4 items-center">
                <FaShieldAlt className="text-blue-500 text-xl" />
                <div>
                  <p className="font-medium text-gray-800">100% Safe & Hygienic</p>
                  <p className="text-sm text-gray-500">Sterile equipment guaranteed</p>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-6 rounded-xl">
              <p className="text-sm text-gray-700">⚡ Need urgent help? Call now:</p>
              <p className="text-lg font-bold text-blue-600 flex items-center gap-2 mt-1">
                <FaPhoneAlt /> 9818185270
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* SERVICE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Select Service
                </label>
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
              </div>

              {/* DATE & TIME */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">📅 Date</label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    required
                    className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">🕐 Time</label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    required
                    className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 text-gray-700"
                  />
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  📍 Your Address
                </label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Enter your full address"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                  required
                />
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  📞 Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  📝 Additional Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="E.g. Flat no, landmark, special instructions..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* PRICE BOX */}
              <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl shadow-inner">
                <div>
                  <p className="text-xs text-gray-500">Service Charge</p>
                  <p className="font-medium text-gray-700">{form.service}</p>
                  {form.date && form.time && (
                    <p className="text-xs text-blue-500 mt-0.5">
                      📅 {form.date} at {form.time}
                    </p>
                  )}
                </div>
                <span className="text-xl font-bold text-blue-600">
                  ₹{selectedService?.price}
                </span>
              </div>

              {/* SUCCESS MESSAGE */}
              {booked && (
                <div className="flex items-center gap-3 bg-green-50 border border-green-200 p-4 rounded-xl">
                  <FaCheckCircle className="text-green-500 text-xl shrink-0" />
                  <p className="text-sm font-medium text-green-700">
                    Booking successful! A technician will be assigned shortly.
                  </p>
                </div>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading || booked}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Booking...
                  </>
                ) : booked ? (
                  <>
                    <FaCheckCircle />
                    You already booked this service
                  </>
                ) : (
                  <>
                   Confirm Booking
                  </>
                )}
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
