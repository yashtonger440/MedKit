import { FaPhoneAlt, FaWhatsapp, FaAmbulance } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Ambulance() {
  const { t } = useTranslation();
  const message = encodeURIComponent(t("ambulancePage.whatsappMessage"));

  return (
    <section className="py-20 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center relative">

          <img
            src="/images/ambulance.jpg"
            alt="Ambulance Service"
            className="relative z-10 w-100 md:w-150 rounded-2xl shadow-2xl"
          />

          <div className="absolute bottom-0 left-108 z-10 bg-gray-300 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
            <div>
              <p className="text-sm font-bold text-blue-600"> {t("ambulancePage.emergency247")}</p>
              <p className="text-sm font-semibold text-gray-700">{t("ambulancePage.responseInMinutes")}</p>
            </div>
          </div>

        </div>

        {/* RIGHT CONTENT */}
        <div>
          
          <h2 className="text-4xl font-bold leading-tight">
            {t("ambulancePage.headingLine1")} <br />
            <span className="text-yellow-300">{t("ambulancePage.headingLine2")}</span>
          </h2>

          <p className="mt-5 text-white/90">
            {t("ambulancePage.subheading")}
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3">
            <li>✔ {t("ambulancePage.feature1")}</li>
            <li>✔ {t("ambulancePage.feature2")}</li>
            <li>✔ {t("ambulancePage.feature3")}</li>
            <li>✔ {t("ambulancePage.feature4")}</li>
          </ul>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            
            <a
              href="tel:9818185270"
              className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition animate-pulse"
            >
              <FaPhoneAlt /> {t("ambulancePage.callAmbulance")}
            </a>

            <a
              href={`https://wa.me/919818185270?text=${message}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              <FaWhatsapp /> {t("ambulancePage.whatsappSOS")}
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}