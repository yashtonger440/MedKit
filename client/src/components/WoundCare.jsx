import { Link } from "react-router-dom";
import { FaBandAid, FaUserNurse } from "react-icons/fa";

export default function WoundCare() {
  const services = [
    {
      title: "Minor Dressing",
      desc: "Clean wound care & bandaging for minor injuries.",
      price: "₹200+",
    },
    {
      title: "Major Dressing",
      desc: "Professional wound care for deep or surgical wounds.",
      price: "₹400+",
      highlight: true,
    },
    {
      title: "Burn Dressing",
      desc: "Specialized burn care with medicated dressing.",
      price: "₹300+",
    },
    {
      title: "Plaster Application",
      desc: "Professional plaster/cast application at home.",
      price: "₹600+",
    },
    {
      title: "Plaster Removal",
      desc: "Safe plaster removal by trained technicians.",
      price: "₹300+",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-white to-blue-50">

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800">
          🩹 Dressing & Injury Management
        </h2>
        <p className="mt-4 text-slate-500">
          Professional wound care, burn treatment, and plaster services at your doorstep.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        
        {services.map((service, index) => (
          <div
            key={index}
            className={`group relative bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-2 border ${
              service.highlight
                ? "border-blue-500 scale-105"
                : "border-gray-100"
            }`}
          >
            
            {/* Popular Tag */}
            {service.highlight && (
              <span className="absolute top-3 right-3 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">
                Most Booked
              </span>
            )}

            {/* Icon */}
            <div className="text-3xl text-blue-500 group-hover:scale-110 transition">
              <FaBandAid />
            </div>

            {/* Title */}
            <h3 className="mt-4 text-xl font-semibold text-gray-800">
              {service.title}
            </h3>

            {/* Desc */}
            <p className="mt-3 text-gray-600 text-sm">
              {service.desc}
            </p>

            {/* Price */}
            <p className="mt-4 text-lg font-bold text-blue-600">
              {service.price}
            </p>

            {/* CTA */}
            <Link
              to="/booking"
              className="mt-5 inline-block w-full text-center bg-linear-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-lg font-medium hover:scale-105 transition"
            >
              Book Now
            </Link>
          </div>
        ))}

      </div>

      {/* Bottom Trust Line */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-800">✔ Certified Nurses</span> • 
          <span className="font-semibold text-gray-800"> Sterile Equipment</span> • 
          <span className="font-semibold text-gray-800"> Safe Home Treatment</span>
        </p>
      </div>
    </section>
  );
}