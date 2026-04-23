import React from 'react';
import { ShieldAlert, Dog, Bug, Zap, PhoneCall } from 'lucide-react';

import {
  FaSyringe,
} from "react-icons/fa";

const EmergencyCare = () => {
  const emergencyServices = [
    {
      id: 1,
      title: "Dog Bite Injection",
      description: "Anti-rabies vaccination & wound care for dog bites.",
      price: "₹300",
      icon: <FaSyringe  className="w-6 h-6 text-cyan-500" />,
      buttonText: "Book Now",
      accent: "border-gray-100"
    },
    {
      id: 2,
      title: "Monkey Bite Injection",
      description: "Immediate injection & care for monkey bite injuries.",
      price: "₹300",
      icon: <FaSyringe  className="w-6 h-6 text-cyan-500" />,
      buttonText: "Book Now",
      accent: "border-gray-100"
    },
    {
      id: 3,
      title: "Snake Bite (Emergency)",
      description: "Emergency anti-venom & first-aid for snake bites.",
      price: "₹500",
      icon: <ShieldAlert className="w-6 h-6 text-red-500" />,
      buttonText: "Get Help",
      accent: "border-red-200 bg-red-50/30",
      isUrgent: true
    }
  ];

  return (
    <section className="py-16 px-6 max-w-7xl mx-auto font-sans">
      {/* Header Section */}
      <div className="text-center mb-12">
        <span className="text-red-500 font-bold tracking-widest text-xs uppercase">
          Emergency Care
        </span>
        <h2 className="flex items-center justify-center gap-3 text-3xl md:text-4xl font-bold text-slate-800 mt-4">
          <span className="text-4xl">🐍</span> Bite & Emergency <span className="text-red-500">Injection Care</span>
        </h2>
        <p className="text-slate-500 mt-4 max-w-2xl mx-auto leading-relaxed">
          Immediate professional response for animal bite emergencies. Don't wait — get help now.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {emergencyServices.map((service) => (
          <div 
            key={service.id} 
            className={`rounded-2xl border-2 p-8 transition-all hover:shadow-lg ${service.accent}`}
          >
            <div className="mb-6">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.isUrgent ? 'bg-red-100' : 'bg-cyan-100'}`}>
                {service.icon}
              </div>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {service.title}
            </h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              {service.description}
            </p>

            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                <span className="text-cyan-500 font-bold text-xl">
                  {service.price} <span className="text-slate-400 text-xs font-normal">onwards</span>
                </span>
              </div>
              <button 
                className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                  service.isUrgent 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-cyan-400 text-white hover:bg-cyan-500'
                }`}
              >
                {service.buttonText}
              </button>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};

export default EmergencyCare;