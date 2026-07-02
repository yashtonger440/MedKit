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
import { useTranslation } from "react-i18next";

const Services = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const services = [
    {
      key: "injection",
      name: "Injection at Home",
      icon: <FaSyringe />,
    },
    {
      key: "ivDrip",
      name: "IV Drip Administration",
      icon: <FaTint />,
    },
    {
      key: "ecg",
      name: "ECG Test at Home",
      icon: <FaHeartbeat />,
    },
    {
      key: "physio",
      name: "Physiotherapy",
      icon: <FaWalking />,
    },
    {
      key: "bpSugar",
      name: "BP & Sugar Check",
      icon: <FaStethoscope />,
    },
    {
      key: "bloodTest",
      name: "Blood Test at Home",
      icon: <FaFlask />,
    },
    {
      key: "nurseVisit",
      name: "Nurse Visit at Home",
      icon: <FaUserNurse />,
      tag: "Recommended",
    },
  ];

  const handleBooking = (service) => {
    navigate("/booking", {
      state: {
        service: service.name,
      },
    });
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        <div className="text-center max-w-2xl mx-auto mb-14 mt-5">
          <h1 className="text-4xl font-bold text-gray-800">
            {t("servicesPage2.heading")}
          </h1>
          <p className="mt-3 text-gray-600">
            {t("servicesPage2.subheading")}
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/70 backdrop-blur-lg rounded-2xl p-6 shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200"
            >

              {service.tag && (
                <span className="absolute top-4 right-4 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                  {t(`servicesPage2.${service.key}.tag`)}
                </span>
              )}

              <div className="text-3xl text-blue-500 mb-4 transition">
                {service.icon}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {t(`servicesPage2.${service.key}.name`)}
                </h2>
                <p className="text-gray-600 text-sm mt-2">
                  {t(`servicesPage2.${service.key}.desc`)}
                </p>
              </div>

              <div className="mt-5">

                <button
                  onClick={() => handleBooking(service)}
                  className="mt-3 w-full py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:scale-105 transition cursor-pointer"
                >
                  {t("servicesPage2.bookNow")}
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