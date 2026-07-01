import { motion } from "framer-motion";
import { FaWhatsapp, FaUserMd, FaLeaf, FaPhoneAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function DietitianSection() {
  const { t } = useTranslation();
  const message = encodeURIComponent(t("dietitian.whatsappMessage"));

  return (
    <section className="py-20 bg-linear-to-br from-green-50 to-emerald-100 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <span className="inline-block bg-green-100 text-green-600 text-sm px-4 py-1 rounded-full font-medium">
            {t("dietitian.badge")}
          </span>

          {/* Heading */}
          <h2 className="mt-4 text-4xl font-bold text-gray-800 leading-tight">
            {t("dietitian.heading")}
          </h2>

          {/* Description */}
          <p className="mt-4 text-gray-600">
            {t("dietitian.description")}
          </p>

          {/* Features */}
          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
              <FaUserMd className="text-green-500 text-xl" />
              <span className="text-gray-700">{t("dietitian.feature1")}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaLeaf className="text-green-500 text-xl" />
              <span className="text-gray-700">{t("dietitian.feature2")}</span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-green-500 text-xl" />
              <span className="text-gray-700">
                {t("dietitian.feature3")}
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">
          
            <a
              href="tel:9818185270"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105 transition"
            >
              <FaPhoneAlt /> {t("dietitian.callNow")}
            </a>
          </div>

          {/* Trust Line */}
          <p className="mt-4 text-sm text-gray-500">
            ✅ {t("dietitian.trustLine")}
          </p>
        </motion.div>

        {/* RIGHT IMAGE + TEXT */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c"
            alt="Dietitian"
            className="rounded-3xl shadow-2xl w-full h-100 object-cover"
          />

          {/* Overlay Card */}
          <div className="absolute bottom-0 left-0 bg-gray-100 p-4 rounded-xl shadow-lg">
            <h3 className="font-semibold text-gray-800">
              {t("dietitian.overlayTitle")}
            </h3>
            <p className="text-sm text-gray-500">
              {t("dietitian.overlaySubtitle")}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}