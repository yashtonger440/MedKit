import { useState } from "react";
import { motion } from "framer-motion";

const SERVICES = [
  { name: "Injection at Home",      basePrice: 120, icon: "💉" },
  { name: "IV Drip Administration", basePrice: 300, icon: "🩸" },
  { name: "ECG Test at Home",       basePrice: 400, icon: "🫀" },
  { name: "Physiotherapy",          basePrice: 500, icon: "🦴" },
  { name: "BP & Sugar Check",       basePrice: 199, icon: "🩺" },
  { name: "Blood Test at Home",     basePrice: 499, icon: "🧪" },
  { name: "Nurse Visit at Home",    basePrice: 699, icon: "👩‍⚕️" },
  { name: "Minor Dressing",         basePrice: 200, icon: "🩹" },
  { name: "Major Dressing",         basePrice: 400, icon: "🏥" },
];

const VISIT_TYPES = [
  {
    label: "Normal",
    multiplier: 1.0,
    desc: "Within 24 hrs",
    activeCard: "bg-green-50 border-2 border-green-300",
    labelColor: "text-green-700",
    surchargeColor: "text-green-600",
  },
  {
    label: "Same Day",
    multiplier: 1.3,
    desc: "Today itself",
    activeCard: "bg-yellow-50 border-2 border-yellow-300",
    labelColor: "text-yellow-700",
    surchargeColor: "text-yellow-600",
  },
  {
    label: "Emergency",
    multiplier: 1.7,
    desc: "Within 1–2 hrs",
    activeCard: "bg-red-50 border-2 border-red-300",
    labelColor: "text-red-700",
    surchargeColor: "text-red-600",
  },
];

const AREAS = [
  { name: "Clock Tower / Paltan Bazaar", distance: 0  },
  { name: "Karanpur",                    distance: 2  },
  { name: "Patel Nagar",                 distance: 3  },
  { name: "Dalanwala",                   distance: 3  },
  { name: "ISBT / Rishikesh Road",       distance: 3  },
  { name: "Rajpur Road",                 distance: 4  },
  { name: "Dharampur",                   distance: 4  },
  { name: "Rispana",                     distance: 4  },
  { name: "Ballupur",                    distance: 5  },
  { name: "Jogiwala",                    distance: 5  },
  { name: "Haridwar Road",               distance: 5  },
  { name: "Raipur Road",                 distance: 6  },
  { name: "Niranjanpur",                 distance: 6  },
  { name: "Majra",                       distance: 6  },
  { name: "GMS Road",                    distance: 7  },
  { name: "Sewla Kalan",                 distance: 7  },
  { name: "Clement Town",                distance: 8  },
  { name: "Dehrakhas",                   distance: 8  },
  { name: "Sahastradhara Road",          distance: 9  },
  { name: "Premnagar",                   distance: 9  },
  { name: "Mussoorie Road",              distance: 10 },
  { name: "Nathanpur",                   distance: 12 },
  { name: "Selaqui",                     distance: 15 },
  { name: "Doiwala",                     distance: 18 },
  { name: "Vikasnagar",                  distance: 22 },
];

const PLATFORM_FEE = 30;
const PRICE_PER_KM = 10;

const WHY_ITEMS = [
  { title: "Certified professionals",  desc: "All technicians verified & trained" },
  { title: "Pay after service",        desc: "No upfront payment required"        },
  { title: "Emergency response",       desc: "Available within 1–2 hours"         },
  { title: "Transparent pricing",      desc: "Know the cost before booking"       },
  { title: "Doorstep service",         desc: "We come to you, anywhere in Dehradun" },
];

const HOW_ITEMS = [
  { icon: "📱", title: "Book online or call",  desc: "Select your service and time slot"        },
  { icon: "📍", title: "Share your location",  desc: "Add your address in Dehradun"             },
  { icon: "✅", title: "Technician arrives",   desc: "Verified professional at your door"       },
  { icon: "❤️", title: "Service delivered",    desc: "Professional care at home"                },
  { icon: "💵", title: "Pay after service",    desc: "Cash or UPI — only after you're satisfied" },
];

const STATS = [
  { num: "500+", lbl: "Patients served" },
  { num: "4.9★", lbl: "Average rating"  },
  { num: "24/7", lbl: "Available"       },
  { num: "15+",  lbl: "Services"        },
];

export default function PriceCalculator() {
  const [service,   setService]   = useState("");
  const [visitType, setVisitType] = useState("Normal");
  const [area,      setArea]      = useState("");
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState("");

  const selectedVisit = VISIT_TYPES.find((v) => v.label === visitType);

  const calculate = () => {
    if (!service)   { setError("Please select a service."); return; }
    if (area === "") { setError("Please select your area."); return; }
    setError("");

    const svc        = SERVICES.find((s) => s.name === service);
    const dist       = AREAS.find((a) => a.name === area)?.distance ?? 0;
    const distCharge = dist * PRICE_PER_KM;
    const baseVisit  = Math.round(svc.basePrice * selectedVisit.multiplier);
    const surcharge  = baseVisit - svc.basePrice;
    const total      = baseVisit + distCharge + PLATFORM_FEE;

    setResult({ base: svc.basePrice, surcharge, dist, distCharge, total });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-cyan-100 px-6">

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
         <h2 className="text-xl font-bold text-blue-500 mb-3">
          PRICE CALCULATOR
        </h2>
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          Know your price before booking 🧮
        </h2>
        <p className="text-gray-500 text-lg">
          Professional care at your doorstep — transparent pricing, no hidden fees.
        </p>
      </motion.div>

      {/* ── 3-column grid ── */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-start">

        {/* ────── LEFT — Why Choose Us ────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 h-full"
        >
          {/* icon badge */}
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-xl">🛡️</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Why choose MedKit?</h3>
          <div className="h-px bg-blue-100 mb-4" />

          {/* why items */}
          <div className="space-y-3 mb-5">
            {WHY_ITEMS.map((item) => (
              <div key={item.title} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-blue-100 mb-4" />

          {/* stats */}
          <div className="grid grid-cols-2 gap-3">
            {STATS.map((s) => (
              <div key={s.lbl} className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{s.num}</p>
                <p className="text-xs text-gray-500 mt-1">{s.lbl}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ────── MIDDLE — How it Works ────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 h-full"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-xl">📋</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">How it works</h3>
          <div className="h-px bg-blue-100 mb-4" />

          <div className="space-y-3 mb-5">
            {HOW_ITEMS.map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3"
              >
                <span className="text-xl shrink-0">{item.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-blue-100 mb-4" />

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <span className="text-2xl">📞</span>
            <p className="text-sm font-semibold text-gray-800 mt-2">Need help? Call us</p>
            <p className="text-base font-bold text-blue-600 mt-1">+91 981818XXXX</p>
          </div>
        </motion.div>

        {/* ────── RIGHT — Price Calculator ────── */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.03 }}
          className="bg-white rounded-3xl p-8 shadow-lg border border-gray-200 h-full"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
            <span className="text-xl">🧮</span>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Check price for your area</h3>
          <div className="h-px bg-blue-100 mb-4" />

          {/* Service select */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Service
            </label>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => { setService(e.target.value); setResult(null); setError(""); }}
                className="w-full appearance-none bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-8 cursor-pointer"
              >
                <option value="">— Select service —</option>
                {SERVICES.map((s) => (
                  <option key={s.name} value={s.name}>{s.icon}  {s.name}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Visit type */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Visit Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {VISIT_TYPES.map((v) => (
                <button
                  key={v.label}
                  onClick={() => { setVisitType(v.label); setResult(null); }}
                  className={`rounded-2xl border px-2 py-2 text-center transition-all ${
                    visitType === v.label
                      ? v.activeCard
                      : "bg-blue-50 border-blue-100 text-gray-500 hover:bg-blue-100"
                  }`}
                >
                  <p className={`text-xs font-semibold ${visitType === v.label ? v.labelColor : "text-gray-700"}`}>
                    {v.label}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{v.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Area select */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Your Area
            </label>
            <div className="relative">
              <select
                value={area}
                onChange={(e) => { setArea(e.target.value); setResult(null); setError(""); }}
                className="w-full appearance-none bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-8 cursor-pointer"
              >
                <option value="">— Select area —</option>
                {AREAS.map((a) => (
                  <option key={a.name} value={a.name}>
                    {a.name} {a.distance === 0 ? "(City Center)" : `(~${a.distance} km)`}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          {/* ⚡ Limited slots notice */}
          <p className="text-center text-xs text-orange-500 mb-3">
            ⚡ Limited slots available today
          </p>

          {/* Calculate button */}
          <button
            onClick={calculate}
            className="w-full py-3 rounded-full text-sm font-semibold text-white transition hover:scale-105 shadow-lg"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
          >
            Calculate Price
          </button>

          {/* Result breakdown */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="mt-4 bg-blue-50 border border-blue-100 rounded-2xl p-4"
            >
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Price Breakdown
              </p>

              <div className="space-y-2">
                {/* Base */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base price</span>
                  <span className="font-semibold text-gray-800">₹{result.base}</span>
                </div>

                {/* Surcharge */}
                {result.surcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={selectedVisit.surchargeColor}>{visitType} surcharge</span>
                    <span className={`font-semibold ${selectedVisit.surchargeColor}`}>
                      +₹{result.surcharge}
                    </span>
                  </div>
                )}

                {/* Distance */}
                {result.dist > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Distance ({result.dist} km × ₹10)</span>
                    <span className="font-semibold text-gray-800">₹{result.distCharge}</span>
                  </div>
                )}

                {/* Platform fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Platform fee</span>
                  <span className="font-semibold text-gray-800">₹{PLATFORM_FEE}</span>
                </div>

                <div className="h-px bg-blue-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">Total</span>
                  <span className="text-2xl font-bold text-blue-600">₹{result.total}</span>
                </div>
              </div>

              {/* Pay after service pill */}
              <button
                className="mt-4 w-full py-3 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 transition hover:scale-105 shadow-lg"
                style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
              >
                🛡️ Pay after service · No upfront payment
              </button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}