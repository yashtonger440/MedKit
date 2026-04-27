import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import {
  FaSyringe,
  FaHeartbeat,
  FaUserNurse,
  FaStethoscope,
  FaVial,
  FaWalking ,
} from "react-icons/fa";

export default function Services() {
  const services = [
    {
      icon: <FaSyringe />,
      title: "Injection at Home",
      desc: "Safe & sterile injections by certified nurses.",
      price: "₹120+",
    },
    {
      icon: <FaVial />,
      title: "IV Drip Administration",
      desc: "IV therapy for hydration, vitamins & medications.",
      price: "₹300+",
    },
    {
      icon: <FaHeartbeat />,
      title: "ECG Test at Home",
      desc: "Complete ECG with instant reports.",
      price: "₹400+",
    },
    {
      icon: <FaWalking />,
          title: "Physiotherapy",
          desc: "Professional therapy sessions at your home.",
          price: "₹500+",
    },
    {
      icon: <FaUserNurse />,
      title: "Nurse Visit at Home",
      desc: "Professional nurse support for elderly & recovery care.",
      price: "₹699+",
    },
  ];

  return (
    <>
    <Navbar />
    <section className="py-20 bg-linear-to-b from-white to-blue-50">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Healthcare Services at Your Doorstep
        </h2>
        <p className="mt-4 text-slate-500">
          Certified professionals delivering quality healthcare at home.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        
        {services.map((service, index) => (
          <div
            key={index}
            className="group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200"
          >
            {/* Icon + Price */}
            <div className="flex justify-between items-center">
              <div className="text-3xl text-blue-500 group-hover:scale-110 transition">
                {service.icon}
              </div>

              <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {service.price}
              </span>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {service.title}
            </h3>

            {/* Description */}
            <p className="mt-3 text-gray-600 text-sm">
              {service.desc}
            </p>

            {/* CTA */}
            <Link
              to="/booking"
              className="mt-6 inline-block w-full text-center bg-linear-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-lg font-medium hover:scale-105 transition"
            >
              Book Now
            </Link>
          </div>
        ))}
      </div>

      {/* View All Services Button */}
<div className="mt-12 text-center">
  <Link
    to="/services"
    className="inline-block px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white font-semibold rounded-full shadow-md hover:scale-105 transition"
  >
    View All Services →
  </Link>
</div>

      {/* Bottom Trust Line */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-800">✔ Certified Nurses</span> • 
          <span className="font-semibold text-gray-800"> Quick Response</span> • 
          <span className="font-semibold text-gray-800"> 100% Safe & Hygienic</span>
        </p>
      </div>
    </section>
    </>
  );
}