import { motion } from "framer-motion";
import { FaPhoneAlt } from "react-icons/fa";

export default function ElderlyCarePlans() {
  const plans = [
    {
      name: "Basic Care",
      price: "₹2,999",
      features: [
        "Weekly nurse visit",
        "BP & sugar monitoring",
        "Emergency support",
        "Basic health tracking",
      ],
      popular: false,
    },
    {
      name: "Advanced Care",
      price: "₹4,999",
      features: [
        "2 nurse visits per week",
        "Medicine assistance",
        "Priority booking",
        "Health monitoring",
      ],
      popular: true,
    },
    {
      name: "Premium Care",
      price: "₹7,999",
      features: [
        "Daily monitoring",
        "Dedicated caregiver support",
        "Full assistance",
        "Emergency priority response",
      ],
      popular: false,
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-100 px-6">

      {/* TOP CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto"
      >
        <h2 className="text-xl font-bold text-blue-500">
          Elderly Care Plans
        </h2>

        <p className="mt-4 text-5xl text-gray-800 font-bold">
          Care for Your Parents at Home ❤️
        </p>

        <p className="mt-4 text-gray-500 text-xl">
          Affordable monthly care plans designed for elderly safety,
          comfort, and regular health monitoring.
        </p>

        <p className="mt-3 text-gray-900 text-medium font-bold">
          👉 Ensure your parents are cared for even when you're not around.
        </p>
      </motion.div>

      {/* IMAGE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto mb-12"
      >
        <img
          src="https://images.unsplash.com/photo-1584515933487-779824d29309"
          alt="Elderly Care"
          className="w-full mt-3 h-[550px] object-cover rounded-3xl shadow-2xl"
        />
      </motion.div>

      {/* CARDS */}
      <div className="mt-14 grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

        {plans.map((plan, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
            whileHover={{ scale: 1.06 }}
            className={`relative bg-white rounded-3xl p-8 shadow-lg border transition-all ${
              plan.popular
                ? "border-blue-500 shadow-2xl"
                : "border-gray-200"
            }`}
          >

            {/* POPULAR TAG */}
            {plan.popular && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs px-4 py-1 rounded-full shadow">
                Most Popular
              </span>
            )}

            {/* TITLE */}
            <h3 className="text-xl font-semibold text-center">
              {plan.name}
            </h3>

            {/* PRICE */}
            <div className="text-center mt-4">
              <span className="text-3xl font-bold text-blue-600">
                {plan.price}
              </span>
              <p className="text-gray-500 text-sm">/month</p>
            </div>

            {/* ALERT */}
            <p className="text-center text-xs text-orange-500 mt-2">
              ⚡ Limited slots available this week
            </p>

            {/* FEATURES */}
            <ul className="mt-6 space-y-3 text-gray-600 text-sm">
              {plan.features.map((f, index) => (
                <li key={index} className="flex items-center gap-2">
                  ✔ {f}
                </li>
              ))}
            </ul>

            {/* BUTTON */}
            <button
              className={`mt-8 w-full py-3 rounded-full font-semibold transition ${
                plan.popular
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow-lg hover:scale-105"
                  : "border border-blue-500 text-blue-600 hover:bg-blue-50"
              }`}
            >
              Choose Plan
            </button>

          </motion.div>
        ))}

      </div>

      {/* BOTTOM CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mt-16 text-center"
      >
        <p className="text-gray-700 font-medium">
          💬 Talk to Expert & Get Plan
        </p>

        <a
          href="tel:9818185270"
          className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition"
        >
          <FaPhoneAlt /> Call: 9818185270
        </a>

        <p className="mt-4 text-sm text-gray-500">
          Trusted by families in Haldwani & Kathgodam
        </p>
      </motion.div>

    </section>
  );
}