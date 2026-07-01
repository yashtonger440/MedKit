import { Link } from "react-router-dom";
import { FaBandAid, FaUserNurse } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function WoundCare() {
  const { t } = useTranslation();

  const services = [
    {
      title: t("woundCare.minorDressing.title"),
      desc: t("woundCare.minorDressing.desc"),
    },
    {
      title: t("woundCare.majorDressing.title"),
      desc: t("woundCare.majorDressing.desc"),
      highlight: true,
    },
    {
      title: t("woundCare.burnDressing.title"),
      desc: t("woundCare.burnDressing.desc"),
    },
    {
      title: t("woundCare.plasterApplication.title"),
      desc: t("woundCare.plasterApplication.desc"),
    },
    {
      title: t("woundCare.plasterRemoval.title"),
      desc: t("woundCare.plasterRemoval.desc"),
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-white to-blue-50">

      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6">
        <span className="text-blue-700 font-bold tracking-widest text-xs uppercase">
          {t("woundCare.badge")}
        </span>
        <h2 className="text-4xl font-bold text-gray-800">
          {/* 🩹  */}
          {t("woundCare.heading")}
        </h2>
        <p className="mt-4 text-slate-500">
          {t("woundCare.subheading")}
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

      {/* Bottom Trust Line */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-800">✔ {t("woundCare.trust1")}</span> •
          <span className="font-semibold text-gray-800"> {t("woundCare.trust2")}</span> •
          <span className="font-semibold text-gray-800"> {t("woundCare.trust3")}</span>
        </p>
      </div>
    </section>
  );
}