import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";

import {
  FaSyringe,
  FaHeartbeat,
  FaUserNurse,
  FaStethoscope,
  FaVial,
  FaWalking,
} from "react-icons/fa";

export default function Services() {
  const { t } = useTranslation();

  const services = [
    {
      icon: <FaSyringe />,
      title: t("servicesPage.injection.title"),
      desc: t("servicesPage.injection.desc"),
    },
    {
      icon: <FaVial />,
      title: t("servicesPage.ivDrip.title"),
      desc: t("servicesPage.ivDrip.desc"),
    },
    {
      icon: <FaHeartbeat />,
      title: t("servicesPage.ecg.title"),
      desc: t("servicesPage.ecg.desc"),
    },
    {
      icon: <FaWalking />,
      title: t("servicesPage.physio.title"),
      desc: t("servicesPage.physio.desc"),
    },
    {
      icon: <FaUserNurse />,
      title: t("servicesPage.nurse.title"),
      desc: t("servicesPage.nurse.desc"),
    },
  ];

  return (
    <>
      <Navbar />
      <section className="py-20 bg-linear-to-b from-white to-blue-50">

        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-gray-800">
            {t("servicesPage.heading")}
          </h2>
          <p className="mt-4 text-slate-500">
            {t("servicesPage.subheading")}
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
                {t("common.bookNow")}
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
            {t("servicesPage.viewAll")}
          </Link>
        </div>

        {/* Bottom Trust Line */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold text-gray-800">✔ {t("servicesPage.trust1")}</span> •
            <span className="font-semibold text-gray-800"> {t("servicesPage.trust2")}</span> •
            <span className="font-semibold text-gray-800"> {t("servicesPage.trust3")}</span>
          </p>
        </div>
      </section>
    </>
  );
}