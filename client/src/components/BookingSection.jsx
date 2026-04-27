import { motion } from "framer-motion";
import {
  FaWhatsapp,
  FaCheckCircle,
  FaUser,
  FaPhoneAlt,
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
      finalPrice += 100;
    }

    setPrice(finalPrice);
  };

  return (
    <section className="py-20 bg-linear-to-br from-blue-50 to-cyan-100 px-6">

      <h2 className="text-xl font-semibold text-cyan-500 text-center mb-5">
        Book & Calculate
      </h2>
      <p className="text-5xl font-semibold text-center mb-12">
        Quick Booking & 
        <span className="text-cyan-500"> Transparent Pricing </span>
      </p>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-8">

        {/* WHY CHOOSE US */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden"
        >
        
          <div className="p-6">
            <h3 className="text-2xl font-semibold mb-4">Why Choose Us</h3>

            <img src="/images/whychooseus.jpg" 
          className="h-40 mt-3 w-full object-cover rounded-2xl" />

            <ul className="space-y-3 mt-2 text-sm text-gray-600">
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

            <p className="mt-6 text-sm text-gray-500">
              ⭐ 4.8 Rated | 100+ Happy Patients
            </p>

            <button className="w-full py-2 mt-4 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold hover:scale-105 transition">
              Talk to Expert
            </button>
          </div>
        </motion.div>

        {/* BOOKING FORM */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/50"
        >
          <h3 className="text-2xl font-semibold mb-2">Book Service</h3>
          <p className="mb-4 text-gray-600 text-sm">
            ⚡ Need quick service? Book instantly on WhatsApp
          </p>

          <div className="space-y-4">

            {/* INPUT STYLE */}
            {[
              { icon: <FaUser />, placeholder: "Your Name" },
              { icon: <FaPhoneAlt />, placeholder: "Phone Number" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center bg-white/80 shadow-sm px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400 transition"
              >
                <span className="text-gray-400 mr-2">{item.icon}</span>
                <input
                  placeholder={item.placeholder}
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            ))}

            {/* AREA */}
            <div className="flex items-center bg-white/80 shadow-sm px-4 py-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
              <FaMapMarkerAlt className="text-gray-400 mr-2" />
              <input
                placeholder="Area"
                value={form.area}
                onChange={(e) =>
                  setForm({ ...form, area: e.target.value })
                }
                className="w-full bg-transparent outline-none text-sm"
              />
            </div>

            {/* DATE + TIME */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center bg-white/80 shadow-sm px-4 py-3 rounded-xl">
                <FaCalendarAlt className="text-gray-400 mr-2" />
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm({ ...form, date: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>

              <div className="flex items-center bg-white/80 shadow-sm px-4 py-3 rounded-xl">
                <FaClock className="text-gray-400 mr-2" />
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) =>
                    setForm({ ...form, time: e.target.value })
                  }
                  className="w-full bg-transparent outline-none text-sm"
                />
              </div>
            </div>

            {/* SERVICE */}
            <select
              className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none text-sm focus:ring-2 focus:ring-blue-400"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >
              {services.map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>

            {/* BUTTON */}
            <button className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-105 transition shadow-md">
              Book Now
            </button>

            {/* WHATSAPP */}
            <a
              href="https://wa.me/919818185270"
              className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-xl hover:scale-105 transition shadow-md"
            >
              <FaWhatsapp /> WhatsApp Booking
            </a>
          </div>
        </motion.div>

        {/* PRICE CALCULATOR */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl shadow-xl"
        >
          <div className="text-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full inline-block">
              <FaCalculator className="text-blue-500 text-2xl" />
            </div>

            <h3 className="text-2xl font-semibold mt-2">Price Calculator</h3>
            <p className="text-sm text-gray-500">
              Transparent pricing • No surprises
            </p>

            <img
              src="/images/pricecalculator.jpg"
              className="h-40 mt-3 w-full object-cover rounded-2xl"
            />
          </div>

          <div className="space-y-4">
            <select
              className="w-full p-3 rounded-xl bg-white shadow-sm outline-none"
              onChange={(e) =>
                setForm({ ...form, service: e.target.value })
              }
            >
              {services.map((s, i) => (
                <option key={i}>{s.name}</option>
              ))}
            </select>

            <input
              placeholder="Enter Area"
              value={form.area}
              onChange={(e) =>
                setForm({ ...form, area: e.target.value })
              }
              className="w-full p-3 rounded-xl bg-white shadow-sm outline-none"
            />

            <button
              onClick={calculatePrice}
              className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:scale-105 transition"
            >
              Calculate Price
            </button>
          </div>

          {price && (
            <div className="mt-6 bg-blue-50 p-5 rounded-xl text-center">
              <p className="text-gray-600">Estimated Price</p>
              <h3 className="text-3xl font-bold text-blue-600">₹{price}</h3>
            </div>
          )}
        </motion.div>

      </div>
    </section>
  );
}