import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FaUserMd,
  FaAmbulance,
  FaBolt,
  FaSyringe,
  FaTint,
  FaHeartbeat,
  FaWalking,
  FaStethoscope,
  FaFlask,
  FaUserNurse,
} from "react-icons/fa";
import Footer from "../components/Footer";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      name: "Doctor Consultation",
      price: 499,
      desc: "Consult certified doctors at home within 30 minutes.",
      icon: <FaUserMd />,
      tag: "Popular",
    },
    {
      name: "Ambulance Service",
      price: 1200,
      desc: "Emergency ambulance support with trained staff.",
      icon: <FaAmbulance />,
      tag: "Emergency",
    },
    {
      name: "Emergency Care",
      price: 999,
      desc: "Instant emergency healthcare at your doorstep.",
      icon: <FaBolt />,
      tag: "Fast",
    },
    {
      name: "Injection at Home",
      price: 120,
      desc: "Safe and hygienic injection service at home.",
      icon: <FaSyringe />,
    },
    {
      name: "IV Drip",
      price: 300,
      desc: "Fluid and vitamin drips administered by experts.",
      icon: <FaTint />,
    },
    {
      name: "ECG Test",
      price: 400,
      desc: "Heart checkup service with instant reports.",
      icon: <FaHeartbeat />,
    },
    {
      name: "Physiotherapy",
      price: 500,
      desc: "Professional therapy sessions at your home.",
      icon: <FaWalking />,
    },
    {
      name: "BP & Sugar Check",
      price: 199,
      desc: "Quick health check for BP and sugar levels.",
      icon: <FaStethoscope />,
    },
    {
      name: "Blood Test",
      price: 499,
      desc: "Lab sample collection from your home.",
      icon: <FaFlask />,
    },
    {
      name: "Nurse Visit at Home",
      price: 699,
      desc: "Professional nurse support for elderly & recovery care.",
      icon: <FaUserNurse />,
      tag: "Recommended",
    },
  ];

  const handleBooking = (service) => {
    navigate("/booking", { state: { service } });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        {/* HERO HEADING */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h1 className="text-4xl font-bold text-gray-800">
            Our Healthcare Services
          </h1>
          <p className="mt-3 text-gray-600">
            Book trusted healthcare services at home with certified professionals.
            Fast, safe and reliable care at your doorstep.
          </p>
        </div>

        {/* GRID */}
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {services.map((s, i) => (
            <div
              key={i}
              className="group bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200 flex flex-col justify-between relative overflow-hidden"
            >

              {/* TAG */}
              {s.tag && (
                <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {s.tag}
                </span>
              )}

              {/* ICON */}
              <div className="text-3xl text-blue-500 mb-4 group-hover:scale-110 transition">
                {s.icon}
              </div>

              {/* CONTENT */}
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {s.name}
                </h2>

                <p className="text-gray-600 text-sm mt-2">
                  {s.desc}
                </p>
              </div>

              {/* PRICE + BUTTON */}
              <div className="mt-5">
                <p className="text-lg font-bold text-blue-600">
                  ₹{s.price}
                </p>

                <button
                  onClick={() => handleBooking(s.name)}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:scale-105 transition"
                >
                  Book Now
                </button>
              </div>

              {/* HOVER GLOW */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-2xl"></div>

            </div>
          ))}

        </div>

      </div>
      <Footer />
    </>
  );
};

export default Services;