import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
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
      name: "Injection at Home",
      price: 120,
      desc: "Safe and hygienic injection service at home.",
      icon: <FaSyringe />,
    },
    {
      name: "IV Drip Administration",
      price: 300,
      desc: "Fluid and vitamin drips administered by experts.",
      icon: <FaTint />,
    },
    {
      name: "ECG Test at Home",
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
      name: "Blood Test at Home",
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
    navigate("/booking", {
      state: {
        service: service.name,
        price: service.price,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        <div className="text-center max-w-2xl mx-auto mb-14 mt-5">
          <h1 className="text-4xl font-bold text-gray-800">
            Our Healthcare Services
          </h1>
          <p className="mt-3 text-gray-600">
            Book trusted healthcare services at home with certified professionals.
            Fast, safe and reliable care at your doorstep.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200"
            >

              {service.tag && (
                <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {service.tag}
                </span>
              )}

              <div className="text-3xl text-blue-500 mb-4 transition">
                {service.icon}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {service.name}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {service.desc}
                </p>
              </div>

              <div className="mt-5">
                <p className="text-lg font-bold text-blue-600">
                  ₹{service.price}
                </p>

                <button
                  onClick={() => handleBooking(service)}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:scale-105 transition cursor-pointer"
                >
                  Book Now
                </button>
              </div>

              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-r from-blue-100/30 to-cyan-100/30 rounded-2xl pointer-events-none"></div>

            </div>
          ))}

        </div>

      </div>
      <Footer />
    </>
  );
};

export default Services;