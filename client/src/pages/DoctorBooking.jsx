import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUserMd, FaHeartbeat, FaBone,
  FaBaby, FaFemale, FaEye,
} from "react-icons/fa";

const services = [
  { name: "General Medicine",  price: 499, icon: <FaUserMd />,    specialization: "General Medicine" },
  { name: "Gastroenterology",  price: 699, icon: <FaHeartbeat />, specialization: "Gastroenterology" },
  { name: "Orthopaedic",       price: 799, icon: <FaBone />,      specialization: "Orthopaedic" },
  { name: "Cardiology",        price: 899, icon: <FaHeartbeat />, specialization: "Cardiology" },
  { name: "Physician",         price: 499, icon: <FaUserMd />,    specialization: "Physician" },
  { name: "Dietitian",         price: 399, icon: <FaUserMd />,    specialization: "Dietitian" },
  { name: "Pediatrician",      price: 599, icon: <FaBaby />,      specialization: "Pediatrician" },
  { name: "Dermatology",       price: 699, icon: <FaEye />,       specialization: "Dermatology" },
  { name: "Gynecologist",      price: 799, icon: <FaFemale />,    specialization: "Gynecologist" },
  { name: "ENT",               price: 599, icon: <FaUserMd />,    specialization: "ENT" },
];

const DoctorBooking = () => {
  const [selectedService, setSelectedService] = useState(services[0]);
  const [form, setForm] = useState({
    date: "",
    time: "",
    phone: "",
    address: "",
    type: "Call",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await API.post("/bookings", {
        service: selectedService.specialization,
        ...form,
        price: selectedService.price,
        // doctorId nahi bhejenge — backend auto assign karega
      });

      alert("Booking successful! A doctor will be assigned shortly.");
    } catch (err) {
      // Backend se message aayega agar doctor nahi mila
      const msg = err.response?.data?.message || "Booking failed";
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 px-6 py-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Book a Doctor 👨‍⚕️</h1>
          <p className="text-gray-600 mt-2">
            Choose your service and get consultation at home or online
          </p>
        </div>

        {/* Service Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
          {services.map((svc, i) => (
            <div
              key={i}
              onClick={() => setSelectedService(svc)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 
              ${selectedService.name === svc.name
                ? "bg-blue-500 text-white shadow-xl scale-105"
                : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="text-3xl mb-3">{svc.icon}</div>
              <h3 className="font-semibold">{svc.name}</h3>
              <p className={`text-sm mt-1 ${selectedService.name === svc.name ? "text-white/80" : "text-gray-400"}`}>
                Consultation
              </p>
              <p className="text-sm font-bold mt-1">₹{svc.price}</p>
            </div>
          ))}
        </div>

        {/* FORM */}
        <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-xl p-6 md:p-7 rounded-3xl shadow-2xl border border-white/40">

          {/* Selected Service Info */}
          <div className="mb-5 p-4 bg-blue-50 rounded-2xl flex items-center gap-3">
            <div className="text-2xl text-blue-500">{selectedService.icon}</div>
            <div>
              <p className="font-semibold text-gray-800">{selectedService.name}</p>
              <p className="text-sm text-gray-500">Best available doctor will be assigned</p>
            </div>
            <p className="ml-auto font-bold text-blue-600 text-lg">
              ₹{selectedService.price}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* TYPE */}
            <div>
              <label className="text-xs font-semibold text-gray-500">
                Consultation Type
              </label>
              <select
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full mt-1 p-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
              >
                <option>Call</option>
                <option>Video</option>
                <option>Home Visit</option>
              </select>
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                required
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="p-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
              <input
                type="time"
                required
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                className="p-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>

            {/* PHONE */}
            <input
              type="text"
              placeholder="📞 Phone Number"
              required
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition"
            />

            {/* ADDRESS */}
            <textarea
              placeholder="📍 Enter Address"
              required
              rows={2}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full p-3 rounded-xl bg-gray-100 focus:bg-white focus:ring-2 focus:ring-blue-400 outline-none transition resize-none"
            />

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-[1.02] active:scale-[0.98] transition duration-300 shadow-md disabled:opacity-60"
            >
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default DoctorBooking;