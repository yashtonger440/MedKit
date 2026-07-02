import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

const SERVICES = [
  { key: "injection",       basePrice: 299 },
  { key: "ivDrip",          basePrice: 499 },
  { key: "ecg",             basePrice: 599 },
  { key: "physio",          basePrice: 799 },
  { key: "bpSugar",         basePrice: 299 },
  { key: "bloodTest",       basePrice: 249 },
  { key: "nurseVisit",      basePrice: 399 },
  { key: "minorDressing",   basePrice: 399 },
  { key: "majorDressing",   basePrice: 499 },
];

const VISIT_TYPES = [
  {
    key: "normal",
    multiplier: 1.0,
    activeCard: "bg-green-50 border-2 border-green-300",
    labelColor: "text-green-700",
    surchargeColor: "text-green-600",
  },
  {
    key: "sameDay",
    multiplier: 1.3,
    activeCard: "bg-yellow-50 border-2 border-yellow-300",
    labelColor: "text-yellow-700",
    surchargeColor: "text-yellow-600",
  },
  {
    key: "emergency",
    multiplier: 1.7,
    activeCard: "bg-red-50 border-2 border-red-300",
    labelColor: "text-red-700",
    surchargeColor: "text-red-600",
  },
];

const CITIES = [
  {
    key: "dehradun",
    areas: [
      { key: "clockTower",   distance: 0  },
      { key: "karanpur",     distance: 2  },
      { key: "patelNagar",   distance: 3  },
      { key: "dalanwala",    distance: 3  },
      { key: "rajpurRoad",   distance: 4  },
      { key: "ballupur",     distance: 5  },
      { key: "haridwarRoad", distance: 5  },
      { key: "gmsRoad",      distance: 7  },
      { key: "clementTown",  distance: 8  },
      { key: "premnagar",    distance: 9  },
      { key: "mussoorieRoad",distance: 10 },
      { key: "selaqui",      distance: 15 },
    ],
  },
  {
    key: "haridwar",
    areas: [
      { key: "harKiPauri",    distance: 0  },
      { key: "bhupatwala",    distance: 2  },
      { key: "kankhal",       distance: 2  },
      { key: "jwalapur",      distance: 3  },
      { key: "ranipur",       distance: 3  },
      { key: "jagjeetpur",    distance: 4  },
      { key: "sidcul",        distance: 6  },
      { key: "shivalikNagar", distance: 5  },
      { key: "bahadrabad",    distance: 9  },
      { key: "roorkeeRoad",   distance: 12 },
    ],
  },
  {
    key: "haldwani",
    areas: [
      { key: "nainitalRoad",  distance: 0  },
      { key: "kusumkhera",    distance: 2  },
      { key: "bhotiaParao",   distance: 2  },
      { key: "bariMukhani",   distance: 3  },
      { key: "rampurRoad",    distance: 3  },
      { key: "kaladhungiRoad",distance: 4  },
      { key: "gaulapar",      distance: 5  },
      { key: "kathgodamTown", distance: 10 },
      { key: "lalkuan",       distance: 12 },
    ],
  },
  {
    key: "kathgodam",
    areas: [
      { key: "kathgodamStation", distance: 0  },
      { key: "haldwaniTown",     distance: 4  },
      { key: "jeolikot",         distance: 12 },
      { key: "bhowali",          distance: 15 },
      { key: "bhimtal",          distance: 19 },
      { key: "sattal",           distance: 19 },
    ],
  },
  {
    key: "rudrapur",
    areas: [
      { key: "nehruNagar",     distance: 0  },
      { key: "preetVihar",     distance: 3  },
      { key: "transportNagar", distance: 3  },
      { key: "awasVikas",      distance: 4  },
      { key: "vikasNagar",     distance: 5  },
      { key: "kichhaRoad",     distance: 8  },
      { key: "gadarpur",       distance: 15 },
    ],
  },
];

const PLATFORM_FEE = 30;
const DISTANCE_CHARGE = 50;

const WHY_KEYS = ["why1", "why2", "why3", "why4", "why5"];
const HOW_KEYS = ["how1", "how2", "how3", "how4", "how5"];
const STAT_ITEMS = [
  { num: "500+", key: "stat1" },
  { num: "4.9★", key: "stat2" },
  { num: "24/7", key: "stat3" },
  { num: "15+",  key: "stat4" },
];

export default function PriceCalculator() {
  const { t } = useTranslation();

  const [service,   setService]   = useState("");
  const [visitType, setVisitType] = useState("normal");
  const [city,      setCity]      = useState("");
  const [area,      setArea]      = useState("");
  const [result,    setResult]    = useState(null);
  const [error,     setError]     = useState("");

  const selectedVisit = VISIT_TYPES.find((v) => v.key === visitType);
  const selectedCity  = CITIES.find((c) => c.key === city);

  const calculate = () => {
    if (!service)   { setError(t("priceCalc.errorService")); return; }
    if (!city)      { setError(t("priceCalc.errorCity")); return; }
    if (area === "") { setError(t("priceCalc.errorArea")); return; }
    setError("");

    const svc        = SERVICES.find((s) => s.key === service);
    const distCharge = DISTANCE_CHARGE;
    const baseVisit  = Math.round(svc.basePrice * selectedVisit.multiplier);
    const surcharge  = baseVisit - svc.basePrice;
    const total      = baseVisit + distCharge + PLATFORM_FEE;

    setResult({ base: svc.basePrice, surcharge, distCharge, total });
  };

  return (
    <section
      id="price-calculator"
      className="py-20 bg-gradient-to-br from-blue-50 to-cyan-100 px-6 scroll-mt-20"
    >

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-14"
      >
         <h2 className="text-xl font-bold text-blue-500 mb-3">
          {t("priceCalc.badge")}
        </h2>
        <h2 className="text-4xl font-bold text-gray-800 mb-3">
          {t("priceCalc.heading")}
        </h2>
        <p className="text-gray-500 text-lg">
          {t("priceCalc.subheading")}
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

          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("priceCalc.whyChoose")}</h3>
          <div className="h-px bg-blue-100 mb-4" />

          {/* why items */}
          <div className="space-y-3 mb-5">
            {WHY_KEYS.map((key) => (
              <div key={key} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{t(`priceCalc.${key}.title`)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(`priceCalc.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-blue-100 mb-4" />

          {/* stats */}
          <div className="grid grid-cols-2 gap-3">
            {STAT_ITEMS.map((s) => (
              <div key={s.key} className="bg-blue-50 border border-blue-100 rounded-2xl p-3 text-center">
                <p className="text-xl font-bold text-blue-600">{s.num}</p>
                <p className="text-xs text-gray-500 mt-1">{t(`priceCalc.${s.key}`)}</p>
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

          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("priceCalc.howItWorks")}</h3>
          <div className="h-px bg-blue-100 mb-4" />

          <div className="space-y-3 mb-5">
            {HOW_KEYS.map((key) => (
              <div
                key={key}
                className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-2xl p-3"
              >
                <div>
                  <p className="text-sm font-semibold text-gray-800 leading-tight">{t(`priceCalc.${key}.title`)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t(`priceCalc.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="h-px bg-blue-100 mb-4" />

          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center">
            <p className="text-sm font-semibold text-gray-800 mt-2">{t("priceCalc.needHelp")}</p>
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

          <h3 className="text-lg font-semibold text-gray-800 mb-3">{t("priceCalc.checkPrice")}</h3>
          <div className="h-px bg-blue-100 mb-4" />

          {/* Service select */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              {t("priceCalc.serviceLabel")}
            </label>
            <div className="relative">
              <select
                value={service}
                onChange={(e) => { setService(e.target.value); setResult(null); setError(""); }}
                className="w-full appearance-none bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-8 cursor-pointer"
              >
                <option value="">{t("priceCalc.selectService")}</option>
                {SERVICES.map((s) => (
                  <option key={s.key} value={s.key}>{t(`priceCalc.services.${s.key}`)}</option>
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
              {t("priceCalc.visitTypeLabel")}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {VISIT_TYPES.map((v) => (
                <button
                  key={v.key}
                  onClick={() => { setVisitType(v.key); setResult(null); }}
                  className={`rounded-2xl border px-2 py-2 text-center transition-all ${
                    visitType === v.key
                      ? v.activeCard
                      : "bg-blue-50 border-blue-100 text-gray-500 hover:bg-blue-100"
                  }`}
                >
                  <p className={`text-xs font-semibold ${visitType === v.key ? v.labelColor : "text-gray-700"}`}>
                    {t(`priceCalc.visitTypes.${v.key}.label`)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{t(`priceCalc.visitTypes.${v.key}.desc`)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* City select */}
          <div className="mb-3">
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              {t("priceCalc.cityLabel")}
            </label>
            <div className="relative">
              <select
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  setArea("");
                  setResult(null);
                  setError("");
                }}
                className="w-full appearance-none bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-8 cursor-pointer"
              >
                <option value="">{t("priceCalc.selectCity")}</option>
                {CITIES.map((c) => (
                  <option key={c.key} value={c.key}>{t(`priceCalc.cities.${c.key}`)}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 5l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>

          {/* Area select (depends on selected city) */}
          {city && (
            <div className="mb-3">
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
                {t("priceCalc.areaLabel")}
              </label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => { setArea(e.target.value); setResult(null); setError(""); }}
                  className="w-full appearance-none bg-blue-50 border border-blue-100 rounded-2xl px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 pr-8 cursor-pointer"
                >
                  <option value="">{t("priceCalc.selectArea")}</option>
                  {selectedCity?.areas.map((a) => (
                    <option key={a.key} value={a.key}>
                      {t(`priceCalc.areas.${a.key}`)}
                    </option>
                  ))}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M3 5l4 4 4-4" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}

          {/* Error */}
          {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

          {/* Calculate button */}
          <button
            onClick={calculate}
            className="w-full py-3 rounded-full text-sm font-semibold text-white transition hover:scale-105 shadow-lg"
            style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
          >
            {t("priceCalc.calculateBtn")}
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
                {t("priceCalc.priceBreakdown")}
              </p>

              <div className="space-y-2">
                {/* Base */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("priceCalc.basePrice")}</span>
                  <span className="font-semibold text-gray-800">₹{result.base}</span>
                </div>

                {/* Surcharge */}
                {result.surcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className={selectedVisit.surchargeColor}>
                      {t("priceCalc.surcharge", { visit: t(`priceCalc.visitTypes.${selectedVisit.key}.label`) })}
                    </span>
                    <span className={`font-semibold ${selectedVisit.surchargeColor}`}>
                      +₹{result.surcharge}
                    </span>
                  </div>
                )}

                {/* Distance / Visit Charge */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("priceCalc.visitCharge")}</span>
                  <span className="font-semibold text-gray-800">₹{result.distCharge}</span>
                </div>

                {/* Platform fee */}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("priceCalc.platformFee")}</span>
                  <span className="font-semibold text-gray-800">₹{PLATFORM_FEE}</span>
                </div>

                <div className="h-px bg-blue-200" />

                {/* Total */}
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800 text-base">{t("priceCalc.total")}</span>
                  <span className="text-2xl font-bold text-blue-600">₹{result.total}</span>
                </div>
              </div>

              {/* Pay after service pill */}
              <button
                className="mt-4 w-full py-3 rounded-full text-xs font-semibold text-white flex items-center justify-center gap-2 transition hover:scale-105 shadow-lg"
                style={{ background: "linear-gradient(90deg, #0ea5e9, #06b6d4)" }}
              >
                🛡️ {t("priceCalc.payAfterService")}
              </button>
            </motion.div>
          )}
        </motion.div>

      </div>
    </section>
  );
}