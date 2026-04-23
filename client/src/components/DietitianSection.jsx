import { motion } from "framer-motion";
import { FaWhatsapp, FaUserMd, FaLeaf, FaPhone } from "react-icons/fa";

export default function DietitianSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          {/* Badge */}
          <span className="inline-block bg-green-100 text-green-600 text-sm px-4 py-1 rounded-full font-medium">
            New Service
          </span>

          {/* Heading */}
          <h2 className="mt-4 text-4xl font-bold text-gray-800 leading-tight">
            Talk to a Dietitian 🥗
          </h2>

          {/* Description */}
          <p className="mt-4 text-gray-600">
            Get personalized diet and nutrition advice from certified experts.
            Whether it's weight management, diabetes care, or general wellness —
            our dietitians are here to guide you.
          </p>

          {/* Features */}
          <div className="mt-6 space-y-4">

            <div className="flex items-center gap-3">
              <FaUserMd className="text-green-500 text-xl" />
              <span className="text-gray-700">
                Certified nutrition experts
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaLeaf className="text-green-500 text-xl" />
              <span className="text-gray-700">
                Personalized diet plans
              </span>
            </div>

            <div className="flex items-center gap-3">
              <FaPhone className="text-green-500 text-xl" />
              <span className="text-gray-700">
                Phone or WhatsApp consultation
              </span>
            </div>

          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">

            <a
              href="https://wa.me/919818185270"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition"
            >
              <FaWhatsapp /> Consult on WhatsApp
            </a>

            <a
              href="tel:9818185270"
              className="flex items-center gap-2 px-6 py-3 border border-green-500 text-green-600 rounded-full font-semibold hover:bg-green-50 transition"
            >
              <FaPhone /> Call Now
            </a>

          </div>

          {/* Trust Line */}
          <p className="mt-4 text-sm text-gray-500">
            ✅ No payment required to connect
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
            className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
          />

          {/* Overlay Card */}
          <div className="absolute bottom-5 left-5 bg-white p-4 rounded-xl shadow-lg">
            <h3 className="font-semibold text-gray-800">
              Expert Nutrition Advice
            </h3>
            <p className="text-sm text-gray-500">
              Personalized guidance for a healthier you
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}