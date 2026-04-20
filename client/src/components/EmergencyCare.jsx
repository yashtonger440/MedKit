import { Link } from "react-router-dom";
import { FaSyringe, FaExclamationTriangle } from "react-icons/fa";

export default function EmergencyCare() {
  const services = [
    {
      title: "Dog Bite Injection",
      desc: "Anti-rabies vaccination & wound care.",
      price: "₹300+",
      btn: "Book Now",
    },
    {
      title: "Monkey Bite Injection",
      desc: "Immediate injection & care for injuries.",
      price: "₹300+",
      btn: "Book Now",
    },
    {
      title: "Snake Bite Emergency",
      desc: "Urgent anti-venom & first-aid treatment.",
      price: "₹500+",
      btn: "Get Help",
      highlight: true,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-red-500 via-pink-500 to-red-600 text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl bottom-0 right-0"></div>

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6 relative z-10">
        <h2 className="text-4xl font-bold flex items-center justify-center gap-2">
          🚨 Emergency Care
        </h2>
        <p className="mt-4 text-white/90">
          Immediate professional response for animal bite emergencies. 
          <span className="font-semibold text-yellow-300"> Don’t wait — get help now.</span>
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid md:grid-cols-3 gap-8 px-6 max-w-6xl mx-auto relative z-10">
        
        {services.map((service, index) => (
          <div
            key={index}
            className={`p-6 rounded-2xl backdrop-blur-lg shadow-lg transition duration-300 hover:scale-105 ${
              service.highlight
                ? "bg-white text-red-600 scale-105 border-2 border-yellow-300"
                : "bg-white/20"
            }`}
          >
            {/* Icon */}
            <div className="text-3xl mb-3">
              {service.highlight ? "⚠️" : <FaSyringe />}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold">
              {service.title}
            </h3>

            {/* Desc */}
            <p className="mt-2 text-sm">
              {service.desc}
            </p>

            {/* Price */}
            <p className="mt-4 font-bold text-lg">
              {service.price}
            </p>

            {/* CTA */}
            <Link
              to="/booking"
              className={`block mt-4 text-center py-2 rounded-lg font-medium transition ${
                service.highlight
                  ? "bg-red-600 text-white hover:bg-red-700 animate-pulse"
                  : "bg-white text-red-600 hover:bg-gray-100"
              }`}
            >
              {service.btn}
            </Link>
          </div>
        ))}

      </div>

      {/* Bottom Alert */}
      <div className="mt-12 text-center relative z-10">
        <p className="text-sm text-white/90 flex justify-center items-center gap-2">
          <FaExclamationTriangle className="text-yellow-300" />
          Available 24/7 • Fast Response • Certified Professionals
        </p>
      </div>
    </section>
  );
}