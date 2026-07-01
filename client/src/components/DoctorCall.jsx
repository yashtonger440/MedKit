import { FaPhoneAlt, FaWhatsapp, FaUserMd } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function DoctorCall() {
  const { t } = useTranslation();
  const message = encodeURIComponent(t("doctorCall.whatsappMessage"));

  return (
    <section className="py-20 bg-linear-to-b from-blue-50 to-white">
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            {t("doctorCall.heading")}
          </h2>

          <p className="mt-4 text-gray-600">
            {t("doctorCall.subheading")}
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>✔ {t("doctorCall.feature1")}</li>
            <li>✔ {t("doctorCall.feature2")}</li>
            <li>✔ {t("doctorCall.feature3")}</li>
            <li>✔ {t("doctorCall.feature4")}</li>
          </ul>

          {/* Price */}
          <p className="mt-6 text-lg font-semibold text-blue-600">
            {t("doctorCall.price")}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">

             <Link
              to="/bookadoctor"
              className="bg-linear-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-md"
            >
              {t("doctorCall.bookNow")}
            </Link>

            <a
              href="tel:9818185270"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105 transition"
            >
              <FaPhoneAlt /> {t("doctorCall.callNow")}
            </a>

          </div>
        </div>

        {/* RIGHT IMAGE + CARD */}
        <div className="relative flex justify-center">
          
          {/* Glow Background */}
          <div className="absolute w-80 h-80 bg-blue-200/40 blur-3xl rounded-full"></div>

          {/* Image */}
          <img
            src="/images/doctorfromhome.jpg"
            alt="Doctor Consultation"
            className="relative z-10 w-112.5 md:w-155 rounded-2xl shadow-2xl"
          />

          <div className="absolute bottom-0 left-0 z-10 bg-gray-300 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
            <div>
              <p className="text-sm font-bold text-blue-600">{t("doctorCall.rating")}</p>
              <p className="text-sm font-semibold text-gray-700">{t("doctorCall.trustedBy")}</p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}