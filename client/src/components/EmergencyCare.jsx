import React from 'react';
import { ShieldAlert, Clock, AlertTriangle, CheckCircle, Phone } from 'lucide-react';
import { FaSyringe } from "react-icons/fa";

const EmergencyCare = () => {
  const emergencyServices = [
    {
      id: 1,
      title: "Dog Bite Injection",
      description: "Anti-rabies vaccination & wound care for dog bites.",
      icon: <FaSyringe className="w-6 h-6 text-cyan-500" />,
      accent: "border-gray-100",
      timeWindow: "Within 24 hours",
      timeColor: "text-amber-500",
      timeBg: "bg-amber-50",
      guidelines: [
        "Wash the wound with soap and water for at least 10 minutes",
        "Visit immediately for anti-rabies injection (ARV)",
        "Follow-up doses required on Day 3, 7, 14 & 28",
        "Inform doctor if the animal had prior vaccination",
      ],
      warning: "Delaying treatment increases rabies risk significantly."
    },
    {
      id: 2,
      title: "Monkey Bite Injection",
      description: "Immediate injection & care for monkey bite injuries.",
      icon: <FaSyringe className="w-6 h-6 text-cyan-500" />,
      accent: "border-gray-100",
      timeWindow: "Within 24 hours",
      timeColor: "text-amber-500",
      timeBg: "bg-amber-50",
      guidelines: [
        "Clean the wound thoroughly under running water",
        "Anti-rabies vaccination required as a precaution",
        "Tetanus injection may also be administered",
        "Complete all scheduled follow-up doses",
      ],
      warning: "Monkey bites can transmit rabies — do not ignore."
    },
    {
      id: 3,
      title: "Snake Bite (Emergency)",
      description: "Emergency anti-venom & first-aid for snake bites.",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      accent: "border-red-200 bg-red-50/30",
      isUrgent: true,
      timeWindow: "IMMEDIATE — Call Now",
      timeColor: "text-red-600",
      timeBg: "bg-red-100",
      guidelines: [
        "Keep the patient calm and immobilize the affected limb",
        "Do NOT cut, suck, or apply tourniquet on the wound",
        "Remove rings/tight clothing near the bite area",
        "Rush to emergency for anti-venom administration",
      ],
      warning: "Snake venom acts fast — every minute matters."
    }
  ];

  return (
    <section className="py-20 px-10 bg-linear-to-b from-white to-blue-50">
      <div className="text-center mb-12">
        <span className="text-red-500 font-bold tracking-widest text-xs uppercase">
          Emergency Care
        </span>
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-slate-800 mt-4">
          {/* <span className="text-4xl">🐍</span>  */}
          Bite & Emergency Injection Care
          {/* Bite & Emergency <span className="text-red-500">Injection Care</span> */}
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Immediate professional response for animal bite emergencies. Follow these guidelines and seek help right away.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white">
        {emergencyServices.map((service) => (
          <div
            key={service.id}
            className={`rounded-2xl border-2 p-8 transition-all hover:shadow-lg flex flex-col gap-5 ${service.accent}`}
          >
            {/* Icon + Title */}
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${service.isUrgent ? 'bg-red-100' : 'bg-cyan-100'}`}>
                {service.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 leading-tight">{service.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{service.description}</p>
              </div>
            </div>

            {/* Time Window Badge */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${service.timeBg} w-fit`}>
              <Clock className={`w-4 h-4 ${service.timeColor}`} />
              <span className={`text-xs font-semibold ${service.timeColor}`}>{service.timeWindow}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Guidelines */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">What To Do</p>
              <ul className="flex flex-col gap-2">
                {service.guidelines.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 leading-snug">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Warning */}
            <div className={`flex items-start gap-2 mt-auto px-3 py-2 rounded-lg ${service.isUrgent ? 'bg-red-100' : 'bg-amber-50'}`}>
              <AlertTriangle className={`w-4 h-4 shrink-0 mt-0.5 ${service.isUrgent ? 'text-red-500' : 'text-amber-500'}`} />
              <p className={`text-xs font-medium ${service.isUrgent ? 'text-red-600' : 'text-amber-700'}`}>
                {service.warning}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Banner */}
      <div className="mt-10 flex items-center justify-center gap-3 bg-slate-800 text-white rounded-2xl px-8 py-5">
        <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
        <p className="text-sm text-slate-300">
          In case of emergency, <span className="text-white font-semibold">call our clinic immediately</span> — our team is available to assist you right away.
        </p>
      </div>
    </section>
  );
};

export default EmergencyCare;