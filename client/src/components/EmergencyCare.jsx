import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { FaSyringe } from "react-icons/fa";
import { useTranslation } from "react-i18next";

const EmergencyCare = () => {
  const { t } = useTranslation();

  const emergencyServices = [
    {
      id: 1,
      key: "dogBite",
      icon: <FaSyringe className="w-6 h-6 text-blue-500" />,
      isUrgent: false,
      timeColor: "text-amber-500",
      timeBg: "bg-amber-50",
      guidelineCount: 4,
    },
    {
      id: 2,
      key: "monkeyBite",
      icon: <FaSyringe className="w-6 h-6 text-blue-500" />,
      isUrgent: false,
      timeColor: "text-amber-500",
      timeBg: "bg-amber-50",
      guidelineCount: 4,
    },
    {
      id: 3,
      key: "snakeBite",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      isUrgent: true,
      timeColor: "text-red-600",
      timeBg: "bg-red-100",
      guidelineCount: 4,
    }
  ];

  return (
    <section className="py-20 px-10 bg-linear-to-b from-white to-blue-50">
      {/* Heading */}
      <div className="text-center mb-12 max-w-2xl mx-auto px-6">
        <span className="text-red-500 font-bold tracking-widest text-xs uppercase">
          {t("emergencyCare.badge")}
        </span>
        <h2 className="text-4xl font-bold text-gray-800 mt-4">
          {t("emergencyCare.heading")}
        </h2>
        <p className="text-slate-500 mt-4 leading-relaxed">
          {t("emergencyCare.subheading")}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="mt-14 grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
        {emergencyServices.map((service) => (
          <div
            key={service.id}
            className="group bg-white/70 backdrop-blur-lg p-6 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 hover:-translate-y-2 border border-transparent hover:border-blue-200 flex flex-col gap-5"
          >
            {/* Icon + Time Badge */}
            <div className="flex justify-between items-center">
              <div className={`text-3xl group-hover:scale-110 transition ${service.isUrgent ? 'text-red-500' : 'text-blue-500'}`}>
                {service.icon}
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${service.timeBg} ${service.timeColor}`}>
                <Clock className="w-3.5 h-3.5" />
                {t(`emergencyCare.${service.key}.timeWindow`)}
              </div>
            </div>

            {/* Title + Description */}
            <div>
              <h3 className="text-xl font-semibold text-gray-800">{t(`emergencyCare.${service.key}.title`)}</h3>
              <p className="mt-1 text-gray-600 text-sm">{t(`emergencyCare.${service.key}.description`)}</p>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Guidelines */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{t("emergencyCare.whatToDo")}</p>
              <ul className="flex flex-col gap-2">
                {Array.from({ length: service.guidelineCount }).map((_, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-snug">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {t(`emergencyCare.${service.key}.guidelines.${i}`)}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            <div className={`flex items-start gap-2 mt-auto px-3 py-2 rounded-lg ${service.isUrgent ? 'bg-red-100' : 'bg-amber-50'}`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${service.isUrgent ? 'text-red-500' : 'text-amber-500'}`} />
              <p className={`text-xs font-medium ${service.isUrgent ? 'text-red-600' : 'text-amber-700'}`}>
                {t(`emergencyCare.${service.key}.warning`)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-10 max-w-7xl mx-auto flex items-center justify-center gap-3 bg-slate-800 text-white rounded-2xl px-8 py-5">
        <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-sm text-slate-300">
          {t("emergencyCare.ctaPrefix")}{" "}
          <span className="text-white font-semibold">{t("emergencyCare.ctaBold")}</span>{" "}
          {t("emergencyCare.ctaSuffix")}
        </p>
      </div>
    </section>
  );
};

export default EmergencyCare;