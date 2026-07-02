import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FaCalculator } from "react-icons/fa";

export default function Hero() {
  const [location, setLocation] = useState("");
  const [calcTooltip, setCalcTooltip] = useState(false);
  const { t } = useTranslation();

  return (
    <section className="py-6 relative min-h-screen flex items-center bg-[#0b2c3a] overflow-hidden">

      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center py-20">

        {/* LEFT CONTENT */}
        <div className="text-white">

          {/* Live availability badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            {t("hero.badge")}
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            {t("hero.titleLine1")} <br />{t("hero.titleLine2")} <br />
            <span className="text-yellow-300">{t("hero.titleHighlight")}</span>
          </h1>

          {/* Star rating */}
          <div className="mt-4 flex items-center gap-2">
            <div className="flex text-yellow-300 text-lg">★★★★★</div>
            <span className="text-white/90 text-sm font-medium">{t("hero.rating")}</span>
          </div>

          <p className="mt-4 text-lg text-white/90">
            {t("hero.subtitle")}
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            <Link
              to="/bookadoctor"
              className="bg-linear-to-r from-blue-500 to-cyan-400 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-md"
            >
              {t("hero.bookDoctorNow")}
            </Link>
            <Link
              to="/elderlycare"
              className="bg-red-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition shadow-md"
            >
              {t("hero.elderlyCare")}
            </Link>
            <Link
              to="/services"
              className="border border-white/70 px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition text-white"
            >
              {t("hero.exploreServices")}
            </Link>

            {/* Calculate Price icon button */}
            <div className="relative flex items-center">
              {calcTooltip && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                  Calculate Price
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
                </div>
              )}
              <button
                onClick={() =>
                  document
                    .getElementById("price-calculator")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                onMouseEnter={() => setCalcTooltip(true)}
                onMouseLeave={() => setCalcTooltip(false)}
                aria-label={t("hero.calculatePrice")}
                className="w-12 h-12 rounded-full bg-gray-200 text-blue-900 flex items-center justify-center shadow-md hover:scale-110 transition"
              >
                <FaCalculator size={18} />
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="text-green-300 font-bold">✔</span> {t("hero.statsUsers")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-300 font-bold">✔</span> {t("hero.statsDoctors")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-green-300 font-bold">✔</span> {t("hero.statsService")}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-yellow-300 font-bold">⚡</span> {t("hero.statsResponse")}
            </span>
          </div>

          {/* Trust badge */}
          <div className="mt-6 inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-xs text-white/80">
            🛡️ {t("hero.trustBadge")}
          </div>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center relative">

          <img
            src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?"
            alt="Medical team of trusted doctors"
            className="relative z-10 w-112.5 md:w-167.5 rounded-3xl shadow-2xl animate-float"
            style={{ maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)" }}
          />

          {/* Floating info card */}
          <div className="absolute bottom-6 left-0 z-10 bg-cyan-300 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 animate-float-delayed">
            <div>
              <p className="text-2xl font-bold text-blue-600">500 +</p>
              <p className="text-sm font-semibold text-gray-700">{t("hero.statsDoctors")}</p>
            </div>
          </div>
        </div>

      </div>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation-delay: 1s;
        }
      `}</style>
    </section>
  );
}