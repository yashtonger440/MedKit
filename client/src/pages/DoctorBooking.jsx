import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUserMd,
  FaHeartbeat,
  FaBone,
  FaBaby,
  FaFemale,
  FaEye,
} from "react-icons/fa";

const DoctorBooking = () => {
  const [selectedDoctor, setSelectedDoctor] = useState("General Medicine");

  const [form, setForm] = useState({
    date: "",
    time: "",
    phone: "",
    address: "",
    type: "Call",
  });

  const [loading, setLoading] = useState(false);

  const doctors = [
    { name: "General Medicine", price: 499, icon: <FaUserMd /> },
    { name: "Gastroenterology", price: 699, icon: <FaHeartbeat /> },
    { name: "Orthopadic", price: 799, icon: <FaBone /> },
    { name: "Cardiology", price: 899, icon: <FaHeartbeat /> },
    { name: "Physician", price: 499, icon: <FaUserMd /> },
    { name: "Pediatrician", price: 599, icon: <FaBaby /> },
    { name: "Dermatology", price: 699, icon: <FaEye /> },
    { name: "Gastrology", price: 699, icon: <FaHeartbeat /> },
    { name: "Gynecologist", price: 799, icon: <FaFemale /> },
    { name: "ENT", price: 599, icon: <FaUserMd /> },
    { name: "Dietitian", price: 399, icon: <FaUserMd /> },
  ];

  const selected = doctors.find((d) => d.name === selectedDoctor);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await API.post("/bookings", {
        service: selectedDoctor,
        ...form,
        price: selected.price,
      });

      alert("Doctor booked successfully");
    } catch (err) {
      alert("Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        {/* Heading */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            Book a Doctor 👨‍⚕️
          </h1>
          <p className="text-gray-600 mt-2">
            Choose your specialist and get consultation at home or online
          </p>
        </div>

        {/* Doctor Selection */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-10">

          {doctors.map((doc, i) => (
            <div
              key={i}
              onClick={() => setSelectedDoctor(doc.name)}
              className={`cursor-pointer p-5 rounded-2xl border transition-all duration-300 
              ${
                selectedDoctor === doc.name
                  ? "bg-blue-500 text-white shadow-xl scale-105"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="text-3xl mb-3">{doc.icon}</div>
              <h3 className="font-semibold">{doc.name}</h3>
              <p className="text-sm mt-1">₹{doc.price}</p>
            </div>
          ))}

        </div>

        {/* FORM */}
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Consultation Type */}
            <div>
              <label className="block mb-1 font-medium">
                Consultation Type
              </label>
              <select
                name="type"
                onChange={(e) =>
                  setForm({ ...form, type: e.target.value })
                }
                className="w-full p-3 border rounded-lg"
              >
                <option>Call</option>
                <option>Video</option>
                <option>Home Visit</option>
              </select>
            </div>

            {/* Date & Time */}
            <div className="grid grid-cols-2 gap-4">
              <input
                type="date"
                required
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="p-3 border rounded-lg"
              />
              <input
                type="time"
                required
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
                className="p-3 border rounded-lg"
              />
            </div>

            {/* Phone */}
            <input
              type="text"
              placeholder="Phone Number"
              required
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />

            {/* Address */}
            <textarea
              placeholder="Enter Address"
              required
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />

            {/* PRICE BOX */}
            <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
              <span className="font-medium">Consultation Fee</span>
              <span className="text-blue-600 font-bold text-lg">
                ₹{selected.price}
              </span>
            </div>

            {/* BUTTON */}
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

      <Footer />
    </>
  );
};

export default DoctorBooking;