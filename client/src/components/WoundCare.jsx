import { Link } from "react-router-dom";
import { FaBandAid, FaUserNurse } from "react-icons/fa";

export default function WoundCare() {
  const services = [
    {
      title: "Minor Dressing",
      desc: "Clean wound care & bandaging for minor injuries.",
      price: "₹200",
    },
    {
      title: "Major Dressing",
      desc: "Professional wound care for deep or surgical wounds.",
      price: "₹400",
      highlight: true,
    },
    {
      title: "Burn Dressing",
      desc: "Specialized burn care with medicated dressing.",
      price: "₹300",
    },
    {
      title: "Plaster Application",
      desc: "Professional plaster/cast application at home.",
      price: "₹600",
    },
    {
      title: "Plaster Removal",
      desc: "Safe plaster removal by trained technicians.",
      price: "₹300",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-white to-blue-50">

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6">
        <span className="text-blue-700 font-bold tracking-widest text-xs uppercase">
          Wound Care
        </span>
        <h2 className="text-4xl font-bold text-gray-800">
          {/* 🩹  */}
          Dressing & Injury Management
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
            className="group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200"
          >
            {/* Icon + Price */}
            <div className="flex justify-between items-center">
              <div className="text-3xl text-blue-500 group-hover:scale-110 transition">
                <FaBandAid />
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
              state={{
                service: service.title,
                price: service.price
              }}
              className="mt-6 inline-block w-full text-center bg-linear-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-lg font-medium hover:scale-105 transition"
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