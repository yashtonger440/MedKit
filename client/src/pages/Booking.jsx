import { useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUserMd, FaClock, FaShieldAlt, FaPhoneAlt,
  FaCheckCircle, FaCalendarAlt, FaArrowLeft, FaWhatsapp,
} from "react-icons/fa";

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

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "01:00 PM", "02:00 PM",
  "03:00 PM", "04:00 PM", "05:00 PM",
  "06:00 PM",
];

const services = [
  { name: "Injection at Home",      price: 120, desc: "Safe injection by certified nurse at your home" },
  { name: "IV Drip Administration", price: 300, desc: "IV fluid or medicine drip administered at home" },
  { name: "ECG Test at Home",       price: 400, desc: "12-lead ECG test done at your doorstep" },
  { name: "Nurse Visit at Home",    price: 699, desc: "Certified nurse visit for general care & monitoring" },
  { name: "Physiotherapy",          price: 500, desc: "Therapeutic exercises & physiotherapy session at home" },
  { name: "BP & Sugar Check",       price: 199, desc: "Blood pressure & blood sugar monitoring at home" },
  { name: "Blood Test at Home",     price: 499, desc: "Sample collection at home, report delivered digitally" },
  { name: "Minor Dressing",         price: 200, desc: "Wound cleaning & dressing for minor cuts/injuries" },
  { name: "Major Dressing",         price: 400, desc: "Dressing for large wounds, burns or post-surgical sites" },
  { name: "Burn Dressing",          price: 300, desc: "Specialized burn wound care & dressing" },
  { name: "Plaster Application",    price: 600, desc: "POP or fiber cast application at home" },
  { name: "Plaster Removal",        price: 300, desc: "Safe plaster/cast removal by trained technician" },
];

const STEPS = { FORM: 1, REVIEW: 2, CONFIRMED: 3 };

const Booking = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [step, setStep] = useState(STEPS.FORM);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [bookingId, setBookingId] = useState(null);

  const [form, setForm] = useState({
    service: location.state?.service || "Injection at Home",
    area:    "",
    address: "",
    phone:   "",
    notes:   "",
    date:    "",
    time:    "",
  });

  const today = new Date().toISOString().split("T")[0];

  // Check login
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const selectedService = services.find((s) => s.name === form.service);

  const priceInfo = useMemo(() => {
    if (!form.area) return null;
    const svc  = services.find((s) => s.name === form.service);
    const area = AREAS.find((a) => a.name === form.area);
    if (!svc || !area) return null;
    const base       = svc.price;
    const dist       = area.distance;
    const distCharge = dist * PRICE_PER_KM;
    const total      = base + distCharge + PLATFORM_FEE;
    return { base, dist, distCharge, total };
  }, [form.service, form.area]);

  // Validate form
  const validate = () => {
    const e = {};
    if (!form.area)    e.area    = "Please select your area.";
    if (!form.date)    e.date    = "Please select a date.";
    if (!form.time)    e.time    = "Please select a time slot.";
    if (!form.address.trim()) e.address = "Please enter your full address.";
    if (!form.phone.trim())   e.phone   = "Please enter your phone number.";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = "Enter a valid 10-digit Indian mobile number.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToReview = () => {
    if (!token) {
      navigate("/auth", { state: { redirect: "/booking", service: form.service } });
      return;
    }
    if (validate()) setStep(STEPS.REVIEW);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await API.post("/technician/book", {
        service: form.service,
        address: `${form.area}, ${form.address}`,
        phone:   form.phone.trim(),
        notes:   form.notes,
        price:   priceInfo?.total || selectedService?.price,
        date:    form.date,
        time:    form.time,
      });
      setBookingId(res.data?._id || "CONFIRMED");
      setStep(STEPS.CONFIRMED);
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 transition ${
      errors[field] ? "ring-2 ring-red-300 border border-red-300" : "focus:ring-blue-400"
    }`;

  // ─── STEP 3: Confirmed ───
  if (step === STEPS.CONFIRMED) {
    const waMsg = encodeURIComponent(
      `Hi MedKit! My booking is confirmed.\nService: ${form.service}\nDate: ${form.date} at ${form.time}\nArea: ${form.area}\nPhone: ${form.phone}\nTotal: ₹${priceInfo?.total}`
    );
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
              <FaCheckCircle className="text-green-500 text-4xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-500 text-sm mb-6">
              A technician will be assigned shortly and will contact you before arrival.
            </p>

            {/* Summary */}
            <div className="bg-blue-50 rounded-2xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service</span>
                <span className="font-medium text-gray-800">{form.service}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Date & Time</span>
                <span className="font-medium text-gray-800">{form.date} · {form.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Area</span>
                <span className="font-medium text-gray-800">{form.area}</span>
              </div>
              <div className="h-px bg-blue-200" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">Total</span>
                <span className="font-bold text-blue-600 text-lg">₹{priceInfo?.total}</span>
              </div>
              <p className="text-xs text-center text-gray-400">Pay after service · No upfront payment</p>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/919818185270?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold mb-3 transition"
            >
              <FaWhatsapp className="text-lg" /> Share on WhatsApp
            </a>

            <button
              onClick={() => navigate("/bookinghistory")}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition"
            >
              Track My Booking
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm transition"
            >
              Back to Home
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── STEP 2: Review Summary ──────────────────────────────────────────────
  if (step === STEPS.REVIEW) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center px-4 py-20">
          <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
            <button
              onClick={() => setStep(STEPS.FORM)}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition"
            >
              <FaArrowLeft /> Back to edit
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">Review your booking</h2>
            <p className="text-gray-500 text-sm mb-6">Please confirm the details before we assign a technician.</p>

            <div className="space-y-3 mb-6">
              {[
                { label: "Service",    value: form.service },
                { label: "Area",       value: form.area },
                { label: "Address",    value: form.address },
                { label: "Date",       value: form.date },
                { label: "Time",       value: form.time },
                { label: "Phone",      value: form.phone },
                form.notes && { label: "Notes", value: form.notes },
              ].filter(Boolean).map((item) => (
                <div key={item.label} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%]">{item.value}</span>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            {priceInfo && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Price Breakdown</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Base charge</span>
                    <span className="font-medium text-gray-800">₹{priceInfo.base}</span>
                  </div>
                  {priceInfo.dist > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Distance ({priceInfo.dist} km × ₹{PRICE_PER_KM})</span>
                      <span className="font-medium text-gray-800">₹{priceInfo.distCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Platform fee</span>
                    <span className="font-medium text-gray-800">₹{PLATFORM_FEE}</span>
                  </div>
                  <div className="h-px bg-blue-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">₹{priceInfo.total}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">💵 Pay after service — no upfront payment</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Confirming...</>
              ) : (
                `Confirm Booking — ₹${priceInfo?.total || selectedService?.price}`
              )}
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ─── STEP 1: Form ────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="min-h-screen mt-5 bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20">

        {/* Login warning */}
        {!token && (
          <div className="max-w-7xl mx-auto mb-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-yellow-700 font-medium">⚠ You need to be logged in to confirm a booking.</p>
              <button
                onClick={() => navigate("/login", { state: { redirect: "/booking" } })}
                className="text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 rounded-lg transition shrink-0"
              >
                Login / Sign up
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT PANEL */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-3xl font-bold text-gray-800">Book Healthcare Service</h2>
            <p className="text-gray-600 mt-3">Schedule a professional healthcare visit at your doorstep.</p>

            <img
              src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=870&auto=format&fit=crop"
              alt="Healthcare"
              className="mt-5 rounded-2xl h-48 w-full object-cover shadow-md"
            />

            <div className="mt-8 space-y-4">
              {[
                { icon: <FaCalendarAlt />, title: "Schedule at Your Convenience", desc: "Pick your preferred date & time slot" },
                { icon: <FaClock />,        title: "Flexible Timings",             desc: "Available 9 AM to 6 PM daily" },
                { icon: <FaUserMd />,       title: "Certified Professionals",      desc: "Trained & verified technicians" },
                { icon: <FaShieldAlt />,    title: "100% Safe & Hygienic",         desc: "Sterile equipment guaranteed" },
              ].map((item) => (
                <div key={item.title} className="flex gap-4 items-center">
                  <span className="text-blue-500 text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 p-6 rounded-xl">
              <p className="text-sm text-gray-700">⚡ Need urgent help? Call now:</p>
              <p className="text-lg font-bold text-blue-600 flex items-center gap-2 mt-1">
                <FaPhoneAlt /> 9818185270
              </p>
            </div>
          </div>

          {/* RIGHT FORM */}
          <div className="bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-white/40">
            <div className="space-y-5">

              {/* SERVICE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">Select Service</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                {/* Service description */}
                {selectedService && (
                  <p className="text-xs text-blue-500 mt-1.5 pl-1">ℹ {selectedService.desc}</p>
                )}
              </div>

              {/* AREA */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">📍 Your Area <span className="text-red-400">*</span></label>
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className={inputClass("area")}
                >
                  <option value="">— Select your area —</option>
                  {AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {a.name} {a.distance === 0 ? "(City Center)" : `(~${a.distance} km)`}
                    </option>
                  ))}
                </select>
                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
              </div>

              {/* LIVE PRICE */}
              {priceInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">💰 Price Breakdown</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Base charge</span>
                      <span className="font-medium text-gray-800">₹{priceInfo.base}</span>
                    </div>
                    {priceInfo.dist > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Distance ({priceInfo.dist} km × ₹{PRICE_PER_KM})</span>
                        <span className="font-medium text-gray-800">₹{priceInfo.distCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Platform fee</span>
                      <span className="font-medium text-gray-800">₹{PLATFORM_FEE}</span>
                    </div>
                    <div className="h-px bg-blue-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">Total Amount</span>
                      <span className="text-2xl font-bold text-blue-600">₹{priceInfo.total}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">💵 Pay after service — no upfront payment</p>
                </div>
              )}

              {/* DATE & TIME SLOTS */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">📅 Date <span className="text-red-400">*</span></label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={today}
                    className={inputClass("date")}
                  />
                  {errors.date && <p className="text-xs text-red-500 mt-1">{errors.date}</p>}
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">🕐 Time Slot <span className="text-red-400">*</span></label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={inputClass("time")}
                  >
                    <option value="">— Select slot —</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">🏠 Full Address <span className="text-red-400">*</span></label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Flat/House no, Street, Landmark..."
                  rows={2}
                  className={inputClass("address") + " resize-none"}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">📞 Phone Number <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">📝 Additional Notes <span className="text-gray-400">(Optional)</span></label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Special instructions, landmark details..."
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* NEXT: Review */}
              <button
                onClick={goToReview}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
              >
                {priceInfo ? `Review Booking — ₹${priceInfo.total}` : "Review Booking →"}
              </button>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Booking;