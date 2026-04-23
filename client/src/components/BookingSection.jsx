import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaCheckCircle,
  FaUser,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaCalculator,
} from "react-icons/fa";
import { useState } from "react";

export default function BookingSection() {
  const [form, setForm] = useState({
    service: "Doctor Consultation",
    date: "",
    time: "",
    area: "",
  });

  const [price, setPrice] = useState(null);

  const services = [
    { name: "Doctor Consultation", price: 499 },
    { name: "Ambulance Service", price: 1200 },
    { name: "Emergency Care", price: 999 },
  ];

  const calculatePrice = () => {
    const selected = services.find((s) => s.name === form.service);
    let finalPrice = selected.price;

    if (form.area.toLowerCase().includes("far")) {
      finalPrice += 100; // area charge
    }

    setPrice(finalPrice);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-100 px-6">

      <h2 className="text-4xl font-bold text-center mb-12">
        Book & Calculate
      </h2>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* WHY CHOOSE US */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
          <img
            src="https://images.unsplash.com/photo-1584515933487-779824d29309"
            className="h-48 w-full object-cover"
          />

          <div className="p-6">
            <h3 className="text-xl font-semibold mb-4">
              Why Choose Us
            </h3>

            <ul className="space-y-3 text-sm text-gray-600">
              {[
                "Certified Healthcare Professionals",
                "Transparent Pricing",
                "Same Day Service",
                "Home Comfort & Safety",
                "Trusted by Families",
                "Instant WhatsApp Booking",
              ].map((item, i) => (
                <li key={i} className="flex gap-2 items-center">
                  <FaCheckCircle className="text-green-500" />
                  {item}
                </li>
              ))}
            </ul>

            <p className="mt-4 text-sm text-gray-500">
              ⭐ 4.8 Rated | 100+ Happy Patients
            </p>
          </div>
        </motion.div>

        {/* BOOKING FORM */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-3xl shadow-xl"
        >
          <h3 className="text-xl font-semibold mb-4">
            Quick Booking
          </h3>

          <div className="space-y-4">

            <div className="flex items-center border p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FaUser className="mr-2 text-gray-400" />
              <input placeholder="Your Name" className="w-full outline-none" />
            </div>

            <div className="flex items-center border p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FaPhone className="mr-2 text-gray-400" />
              <input placeholder="Phone Number" className="w-full outline-none" />
            </div>

            <div className="flex items-center border p-3 rounded-lg focus-within:ring-2 focus-within:ring-blue-400">
              <FaMapMarkerAlt className="mr-2 text-gray-400" />
              <input
                placeholder="Area"
                value={form.area}
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
                className="w-full outline-none"
              />
            </div>

            {/* DATE */}
            <div className="flex items-center border p-3 rounded-lg">
              <FaCalendarAlt className="mr-2 text-gray-400" />
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
                className="w-full outline-none"
              />
            </div>

            {/* TIME */}
            <div className="flex items-center border p-3 rounded-lg">
              <FaClock className="mr-2 text-gray-400" />
              <input
                type="time"
                value={form.time}
                onChange={(e) =>
                  setForm({ ...form, time: e.target.value })
                }
                className="w-full outline-none"
              />
            </div>

            <select
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >
              {services.map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>

            <button className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold hover:scale-105 transition">
              Book Now
            </button>

            <a
              href="https://wa.me/919818185270"
              className="flex items-center justify-center gap-2 py-2 bg-green-500 text-white rounded-lg hover:scale-105 transition"
            >
              <FaWhatsapp /> WhatsApp Booking
            </a>
          </div>
        </motion.div>

        {/* PRICE CALCULATOR */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white p-8 rounded-3xl shadow-xl flex flex-col justify-between"
        >
          {/* HEADER */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-2">
              <div className="bg-blue-100 p-4 rounded-full shadow-inner">
                <FaCalculator className="text-blue-500 text-2xl" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-800">
              Price Calculator
            </h3>

            <p className="text-sm text-gray-500 mt-1">
              Transparent pricing • No surprises
            </p>
          </div>

          {/* FORM */}
          <div className="space-y-4">

            <select
              className="w-full p-3 border rounded-lg"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >
              {services.map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>

            <input
              placeholder="Enter Area (e.g. near/far)"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, area: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />

            <button
              onClick={calculatePrice}
              className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:scale-105 transition"
            >
              Calculate Price
            </button>
          </div>

          {/* RESULT */}
          {price && (
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-gradient-to-r from-blue-50 to-cyan-50 p-5 rounded-xl text-center shadow-inner border"
            >
              <p className="text-gray-600">Estimated Price</p>

              <h3 className="text-4xl font-bold text-blue-600 mt-1">
                ₹{price}
              </h3>

              <p className="text-xs text-gray-500 mt-2">
                Final price may vary based on location & urgency
              </p>
            </motion.div>
          )}

          {/* TRUST */}
          <ul className="mt-5 text-sm text-gray-500 space-y-2">
            <li>✔ No hidden charges</li>
            <li>✔ Pay after service</li>
            <li>✔ Quick response team</li>
          </ul>
        </motion.div>

      </div>
    </section>
  );
}