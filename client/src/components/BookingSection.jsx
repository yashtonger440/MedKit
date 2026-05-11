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
        
      </div>
    </section>
  );
}