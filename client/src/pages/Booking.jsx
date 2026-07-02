import { useState, useMemo } from "react";
import API from "../services/api";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import {
  FaUserMd, FaClock, FaShieldAlt, FaPhoneAlt,
  FaCheckCircle, FaCalendarAlt, FaArrowLeft, FaWhatsapp,
  FaFileMedical, FaTimes, FaPills, FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

const AREAS = [
  { key: "clockTower",        name: "Clock Tower / Paltan Bazaar", distance: 0  },
  { key: "karanpur",          name: "Karanpur",                    distance: 2  },
  { key: "patelNagar",        name: "Patel Nagar",                 distance: 3  },
  { key: "dalanwala",         name: "Dalanwala",                   distance: 3  },
  { key: "isbt",              name: "ISBT / Rishikesh Road",       distance: 3  },
  { key: "rajpurRoad",        name: "Rajpur Road",                 distance: 4  },
  { key: "dharampur",         name: "Dharampur",                   distance: 4  },
  { key: "rispana",           name: "Rispana",                     distance: 4  },
  { key: "ballupur",          name: "Ballupur",                    distance: 5  },
  { key: "jogiwala",          name: "Jogiwala",                    distance: 5  },
  { key: "haridwarRoad",      name: "Haridwar Road",               distance: 5  },
  { key: "raipurRoad",        name: "Raipur Road",                 distance: 6  },
  { key: "niranjanpur",       name: "Niranjanpur",                 distance: 6  },
  { key: "majra",             name: "Majra",                       distance: 6  },
  { key: "gmsRoad",           name: "GMS Road",                    distance: 7  },
  { key: "sewlaKalan",        name: "Sewla Kalan",                 distance: 7  },
  { key: "clementTown",       name: "Clement Town",                distance: 8  },
  { key: "dehrakhas",         name: "Dehrakhas",                   distance: 8  },
  { key: "sahastradharaRoad", name: "Sahastradhara Road",          distance: 9  },
  { key: "premnagar",         name: "Premnagar",                   distance: 9  },
  { key: "mussoorieRoad",     name: "Mussoorie Road",              distance: 10 },
  { key: "nathanpur",         name: "Nathanpur",                   distance: 12 },
  { key: "selaqui",           name: "Selaqui",                     distance: 15 },
  { key: "doiwala",           name: "Doiwala",                     distance: 18 },
  { key: "vikasnagar",        name: "Vikasnagar",                  distance: 22 },
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
  { key: "injection",     name: "Injection at Home",      price: 120 },
  { key: "ivDrip",        name: "IV Drip Administration", price: 300 },
  { key: "ecg",           name: "ECG Test at Home",       price: 400 },
  { key: "nurseVisit",    name: "Nurse Visit at Home",    price: 699 },
  { key: "physio",        name: "Physiotherapy",          price: 500 },
  { key: "bpSugar",       name: "BP & Sugar Check",       price: 199 },
  { key: "bloodTest",     name: "Blood Test at Home",     price: 499 },
  { key: "minorDressing", name: "Minor Dressing",         price: 200 },
  { key: "majorDressing", name: "Major Dressing",         price: 400 },
  { key: "burnDressing",  name: "Burn Dressing",          price: 300 },
  { key: "plasterApply",  name: "Plaster Application",    price: 600 },
  { key: "plasterRemove", name: "Plaster Removal",        price: 300 },
];

// ✅ Sirf prescription upload chahiye
const PRESCRIPTION_REQUIRED_KEYS = ["injection", "ivDrip", "plasterApply"];

// ✅ Medicine name/dosage/source — sirf inhi ke liye
const MEDICINE_DETAILS_REQUIRED_KEYS = ["injection", "ivDrip"];

const STEPS = { FORM: 1, REVIEW: 2, CONFIRMED: 3 };

const Booking = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t } = useTranslation();
  const [step, setStep] = useState(STEPS.FORM);
  const [loading, setLoading] = useState(false);
  const [errors,  setErrors]  = useState({});
  const [bookingId, setBookingId] = useState(null);

  const [prescriptionFile, setPrescriptionFile] = useState(null);

  const [medicine, setMedicine] = useState({
    name: "",
    dosage: "",
    source: "has_it", // "has_it" | "arrange_it"
  });

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
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    if (e.target.name === "service") {
      const newSvc = services.find((s) => s.name === e.target.value);
      if (!PRESCRIPTION_REQUIRED_KEYS.includes(newSvc?.key)) {
        setPrescriptionFile(null);
      }
      if (!MEDICINE_DETAILS_REQUIRED_KEYS.includes(newSvc?.key)) {
        setMedicine({ name: "", dosage: "", source: "has_it" });
      }
    }
  };

  const handleMedicineChange = (e) => {
    setMedicine({ ...medicine, [e.target.name]: e.target.value });
    setErrors((prev) => ({ ...prev, medicineName: "" }));
  };

  const selectedService = services.find((s) => s.name === form.service);
  const selectedArea = AREAS.find((a) => a.name === form.area);

  const needsPrescription = PRESCRIPTION_REQUIRED_KEYS.includes(selectedService?.key);
  const needsMedicineDetails = MEDICINE_DETAILS_REQUIRED_KEYS.includes(selectedService?.key);

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

  const handlePrescriptionChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      setErrors((prev) => ({ ...prev, prescription: t("bookingPage.errors.prescriptionType") }));
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, prescription: t("bookingPage.errors.prescriptionSize") }));
      e.target.value = "";
      return;
    }
    setErrors((prev) => ({ ...prev, prescription: "" }));
    setPrescriptionFile(file);
  };

  const validate = () => {
    const e = {};
    if (!form.area)    e.area    = t("bookingPage.errors.area");
    if (!form.date)    e.date    = t("bookingPage.errors.date");
    if (!form.time)    e.time    = t("bookingPage.errors.time");
    if (!form.address.trim()) e.address = t("bookingPage.errors.address");
    if (!form.phone.trim())   e.phone   = t("bookingPage.errors.phoneRequired");
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = t("bookingPage.errors.phoneInvalid");
    if (needsPrescription && !prescriptionFile)
      e.prescription = t("bookingPage.errors.prescriptionRequired");
    if (needsMedicineDetails && !medicine.name.trim())
      e.medicineName = t("bookingPage.errors.medicineNameRequired");
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

      const formData = new FormData();
      formData.append("service", form.service);
      formData.append("address", `${form.area}, ${form.address}`);
      formData.append("phone",   form.phone.trim());
      formData.append("notes",  form.notes);
      formData.append("price",  priceInfo?.total || selectedService?.price);
      formData.append("date",   form.date);
      formData.append("time",   form.time);

      if (needsPrescription && prescriptionFile) {
        formData.append("prescription", prescriptionFile);
      }
      if (needsMedicineDetails) {
        formData.append("medicineName",   medicine.name.trim());
        formData.append("medicineDosage", medicine.dosage.trim());
        formData.append("medicineSource", medicine.source);
      }

      const res = await API.post("/technician/book", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setBookingId(res.data?._id || "CONFIRMED");
      setStep(STEPS.CONFIRMED);
    } catch (err) {
      alert(err.response?.data?.message || t("bookingPage.errors.bookingFailed"));
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
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{t("bookingPage.confirmed.heading")}</h2>
            <p className="text-gray-500 text-sm mb-6">
              {t("bookingPage.confirmed.subtext")}
            </p>

            <div className="bg-blue-50 rounded-2xl p-4 text-left mb-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("bookingPage.confirmed.service")}</span>
                <span className="font-medium text-gray-800">
                  {selectedService ? t(`bookingPage.services.${selectedService.key}.name`) : form.service}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("bookingPage.confirmed.dateTime")}</span>
                <span className="font-medium text-gray-800">{form.date} · {form.time}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{t("bookingPage.confirmed.area")}</span>
                <span className="font-medium text-gray-800">
                  {selectedArea ? t(`bookingPage.areas.${selectedArea.key}`) : form.area}
                </span>
              </div>
              {needsPrescription && prescriptionFile && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("bookingPage.confirmed.prescription")}</span>
                  <span className="font-medium text-gray-800 flex items-center gap-1">
                    <FaCheckCircle className="text-green-500" size={12} /> {t("bookingPage.confirmed.prescriptionUploaded")}
                  </span>
                </div>
              )}
              {needsMedicineDetails && medicine.name && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t("bookingPage.confirmed.medicine")}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[55%]">{medicine.name}</span>
                </div>
              )}
              <div className="h-px bg-blue-200" />
              <div className="flex justify-between">
                <span className="font-bold text-gray-800">{t("bookingPage.confirmed.total")}</span>
                <span className="font-bold text-blue-600 text-lg">₹{priceInfo?.total}</span>
              </div>
              <p className="text-xs text-center text-gray-400">{t("bookingPage.confirmed.payNote")}</p>

              {needsMedicineDetails && medicine.source === "arrange_it" && (
                <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                  <FaPills className="text-amber-600 mt-0.5 shrink-0" size={12} />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    {t("bookingPage.confirmed.medicineArrangeNote")}
                  </p>
                </div>
              )}
            </div>

            <a
              href={`https://wa.me/919818185270?text=${waMsg}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold mb-3 transition"
            >
              <FaWhatsapp className="text-lg" /> {t("bookingPage.confirmed.shareWhatsapp")}
            </a>

            <button
              onClick={() => navigate("/bookinghistory")}
              className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition"
            >
              {t("bookingPage.confirmed.trackBooking")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full mt-3 py-3 text-gray-500 hover:text-gray-700 text-sm transition"
            >
              {t("bookingPage.confirmed.backHome")}
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
              <FaArrowLeft /> {t("bookingPage.review.backToEdit")}
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-1">{t("bookingPage.review.heading")}</h2>
            <p className="text-gray-500 text-sm mb-6">{t("bookingPage.review.subheading")}</p>

            <div className="space-y-3 mb-6">
              {[
                { label: t("bookingPage.review.service"), value: selectedService ? t(`bookingPage.services.${selectedService.key}.name`) : form.service },
                { label: t("bookingPage.review.area"),     value: selectedArea ? t(`bookingPage.areas.${selectedArea.key}`) : form.area },
                { label: t("bookingPage.review.address"),  value: form.address },
                { label: t("bookingPage.review.date"),     value: form.date },
                { label: t("bookingPage.review.time"),     value: form.time },
                { label: t("bookingPage.review.phone"),    value: form.phone },
                form.notes && { label: t("bookingPage.review.notes"), value: form.notes },
                needsPrescription && prescriptionFile && { label: t("bookingPage.review.prescription"), value: prescriptionFile.name },
                needsMedicineDetails && medicine.name && { label: t("bookingPage.review.medicine"), value: medicine.name },
                needsMedicineDetails && medicine.dosage && { label: t("bookingPage.review.dosage"), value: medicine.dosage },
                needsMedicineDetails && {
                  label: t("bookingPage.review.medicineSource"),
                  value: medicine.source === "has_it"
                    ? t("bookingPage.form.medicineHasIt")
                    : t("bookingPage.form.medicineArrangeIt"),
                },
              ].filter(Boolean).map((item) => (
                <div key={item.label} className="flex justify-between text-sm py-2 border-b border-gray-100">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{item.value}</span>
                </div>
              ))}
            </div>

            {needsMedicineDetails && medicine.source === "arrange_it" && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                <FaPills className="text-amber-600 mt-0.5 shrink-0" size={12} />
                <p className="text-xs text-amber-700 leading-relaxed">
                  {t("bookingPage.review.medicineArrangeNote")}
                </p>
              </div>
            )}

            {priceInfo && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100 mb-6">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("bookingPage.priceBreakdown.title")}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("bookingPage.priceBreakdown.base")}</span>
                    <span className="font-medium text-gray-800">₹{priceInfo.base}</span>
                  </div>
                  {priceInfo.dist > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t("bookingPage.priceBreakdown.distance", { dist: priceInfo.dist, rate: PRICE_PER_KM })}</span>
                      <span className="font-medium text-gray-800">₹{priceInfo.distCharge}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">{t("bookingPage.priceBreakdown.platformFee")}</span>
                    <span className="font-medium text-gray-800">₹{PLATFORM_FEE}</span>
                  </div>
                  <div className="h-px bg-blue-200" />
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-800">{t("bookingPage.priceBreakdown.totalAmount")}</span>
                    <span className="text-2xl font-bold text-blue-600">₹{priceInfo.total}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2 text-center">{t("bookingPage.priceBreakdown.payNote")}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t("bookingPage.review.confirming")}</>
              ) : (
                t("bookingPage.review.confirmBooking", { amount: priceInfo?.total || selectedService?.price })
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

        {!token && (
          <div className="max-w-7xl mx-auto mb-5">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-yellow-700 font-medium flex items-center gap-2">
                <FaExclamationTriangle size={12} /> {t("bookingPage.loginWarning.text")}
              </p>
              <button
                onClick={() => navigate("/login", { state: { redirect: "/booking" } })}
                className="text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 rounded-lg transition shrink-0"
              >
                {t("bookingPage.loginWarning.button")}
              </button>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 items-start">

          {/* LEFT PANEL */}
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-white/40">
            <h2 className="text-3xl font-bold text-gray-800">{t("bookingPage.left.heading")}</h2>
            <p className="text-gray-600 mt-3">{t("bookingPage.left.subheading")}</p>

            <img
              src="https://plus.unsplash.com/premium_photo-1673953509975-576678fa6710?q=80&w=870&auto=format&fit=crop"
              alt="Healthcare"
              className="mt-5 rounded-2xl h-48 w-full object-cover shadow-md"
            />

            <div className="mt-8 space-y-4">
              {[
                { icon: <FaCalendarAlt />, key: "schedule" },
                { icon: <FaClock />,        key: "flexible" },
                { icon: <FaUserMd />,       key: "certified" },
                { icon: <FaShieldAlt />,    key: "hygienic" },
              ].map((item) => (
                <div key={item.key} className="flex gap-4 items-center">
                  <span className="text-blue-500 text-xl shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{t(`bookingPage.left.features.${item.key}.title`)}</p>
                    <p className="text-sm text-gray-500">{t(`bookingPage.left.features.${item.key}.desc`)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-blue-50 p-6 rounded-xl">
              <p className="text-sm text-gray-700"> {t("bookingPage.left.urgentHelp")}</p>
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
                <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("bookingPage.form.selectService")}</label>
                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {services.map((s) => (
                    <option key={s.name} value={s.name}>{t(`bookingPage.services.${s.key}.name`)}</option>
                  ))}
                </select>
                {selectedService && (
                  <p className="text-xs text-blue-500 mt-1.5 pl-1 flex items-center gap-1.5">
                    <FaInfoCircle size={11} /> {t(`bookingPage.services.${selectedService.key}.desc`)}
                  </p>
                )}
              </div>

              {/* PRESCRIPTION + (conditionally) MEDICINE DETAILS */}
              {needsPrescription && (
                <div className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 space-y-4">

                  {/* Prescription Upload — Injection, IV Drip, Plaster Application */}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                      {t("bookingPage.form.prescriptionLabel")} <span className="text-red-400">*</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-white hover:bg-blue-50 transition-all">
                      <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.pdf"
                        onChange={handlePrescriptionChange}
                        className="hidden"
                      />
                      {prescriptionFile ? (
                        <div className="flex items-center gap-2 px-4 w-full">
                          <FaFileMedical className="text-blue-500 text-xl shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{prescriptionFile.name}</p>
                            <p className="text-xs text-gray-400">{(prescriptionFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => { e.preventDefault(); setPrescriptionFile(null); }}
                            className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition"
                          >
                            <FaTimes size={10} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-center px-4">
                          <p className="text-sm text-blue-500 font-medium">{t("bookingPage.form.prescriptionUploadHint")}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{t("bookingPage.form.prescriptionFileTypes")}</p>
                        </div>
                      )}
                    </label>
                    {errors.prescription && <p className="text-xs text-red-500 mt-1">{errors.prescription}</p>}
                  </div>

                  {/* Medicine Name + Dosage + Source — SIRF Injection / IV Drip ke liye */}
                  {needsMedicineDetails && (
                    <>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            {t("bookingPage.form.medicineName")} <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={medicine.name}
                            onChange={handleMedicineChange}
                            placeholder={t("bookingPage.form.medicineNamePlaceholder")}
                            className={`w-full p-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 transition text-sm ${
                              errors.medicineName ? "ring-2 ring-red-300 border border-red-300" : "focus:ring-blue-400 border border-gray-200"
                            }`}
                          />
                          {errors.medicineName && <p className="text-xs text-red-500 mt-1">{errors.medicineName}</p>}
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 mb-1 block">
                            {t("bookingPage.form.dosage")} <span className="text-gray-400">({t("bookingPage.form.optional")})</span>
                          </label>
                          <input
                            type="text"
                            name="dosage"
                            value={medicine.dosage}
                            onChange={handleMedicineChange}
                            placeholder={t("bookingPage.form.dosagePlaceholder")}
                            className="w-full p-3 rounded-xl bg-white shadow-sm outline-none focus:ring-2 focus:ring-blue-400 border border-gray-200 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                          {t("bookingPage.form.medicineSourceLabel")}
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setMedicine({ ...medicine, source: "has_it" })}
                            className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                              medicine.source === "has_it"
                                ? "bg-green-50 border-green-300 ring-2 ring-green-200"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <p className={`text-xs font-semibold flex items-center gap-1.5 ${medicine.source === "has_it" ? "text-green-700" : "text-gray-700"}`}>
                              <FaCheckCircle size={11} /> {t("bookingPage.form.medicineHasIt")}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{t("bookingPage.form.medicineHasItDesc")}</p>
                          </button>
                          <button
                            type="button"
                            onClick={() => setMedicine({ ...medicine, source: "arrange_it" })}
                            className={`rounded-xl border px-3 py-2.5 text-left transition-all ${
                              medicine.source === "arrange_it"
                                ? "bg-amber-50 border-amber-300 ring-2 ring-amber-200"
                                : "bg-white border-gray-200 hover:bg-gray-50"
                            }`}
                          >
                            <p className={`text-xs font-semibold flex items-center gap-1.5 ${medicine.source === "arrange_it" ? "text-amber-700" : "text-gray-700"}`}>
                              <FaPills size={11} /> {t("bookingPage.form.medicineArrangeIt")}
                            </p>
                            <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{t("bookingPage.form.medicineArrangeItDesc")}</p>
                          </button>
                        </div>

                        {medicine.source === "arrange_it" && (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
                            <FaPills className="text-amber-600 mt-0.5 shrink-0" size={12} />
                            <p className="text-xs text-amber-700 leading-relaxed">
                              {t("bookingPage.form.medicineArrangeNote")}
                            </p>
                          </div>
                        )}
                      </div>
                    </>
                  )}

                  <p className="text-xs text-amber-600 pl-1 flex items-start gap-1.5">
                    <FaExclamationTriangle size={11} className="mt-0.5 shrink-0" /> {t("bookingPage.form.prescriptionNote")}
                  </p>
                </div>
              )}

              {/* AREA */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.yourArea")} <span className="text-red-400">*</span></label>
                <select
                  name="area"
                  value={form.area}
                  onChange={handleChange}
                  className={inputClass("area")}
                >
                  <option value="">{t("bookingPage.form.selectAreaPlaceholder")}</option>
                  {AREAS.map((a) => (
                    <option key={a.name} value={a.name}>
                      {t(`bookingPage.areas.${a.key}`)} {a.distance === 0 ? `(${t("bookingPage.form.cityCenter")})` : `(~${a.distance} km)`}
                    </option>
                  ))}
                </select>
                {errors.area && <p className="text-xs text-red-500 mt-1">{errors.area}</p>}
              </div>

              {/* LIVE PRICE */}
              {priceInfo && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3"> {t("bookingPage.priceBreakdown.title")}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t("bookingPage.priceBreakdown.base")}</span>
                      <span className="font-medium text-gray-800">₹{priceInfo.base}</span>
                    </div>
                    {priceInfo.dist > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{t("bookingPage.priceBreakdown.distance", { dist: priceInfo.dist, rate: PRICE_PER_KM })}</span>
                        <span className="font-medium text-gray-800">₹{priceInfo.distCharge}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">{t("bookingPage.priceBreakdown.platformFee")}</span>
                      <span className="font-medium text-gray-800">₹{PLATFORM_FEE}</span>
                    </div>
                    <div className="h-px bg-blue-200" />
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{t("bookingPage.priceBreakdown.totalAmount")}</span>
                      <span className="text-2xl font-bold text-blue-600">₹{priceInfo.total}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2 text-center">{t("bookingPage.priceBreakdown.payNote")}</p>
                  {needsMedicineDetails && medicine.source === "arrange_it" && (
                    <p className="text-[10px] text-amber-600 mt-1.5 text-center flex items-center justify-center gap-1">
                      <FaPills size={10} /> {t("bookingPage.priceBreakdown.medicineExtraNote")}
                    </p>
                  )}
                </div>
              )}

              {/* DATE & TIME SLOTS */}
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.date")} <span className="text-red-400">*</span></label>
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
                  <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.timeSlot")} <span className="text-red-400">*</span></label>
                  <select
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className={inputClass("time")}
                  >
                    <option value="">{t("bookingPage.form.selectSlotPlaceholder")}</option>
                    {TIME_SLOTS.map((tSlot) => (
                      <option key={tSlot} value={tSlot}>{tSlot}</option>
                    ))}
                  </select>
                  {errors.time && <p className="text-xs text-red-500 mt-1">{errors.time}</p>}
                </div>
              </div>

              {/* ADDRESS */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.fullAddress")} <span className="text-red-400">*</span></label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder={t("bookingPage.form.addressPlaceholder")}
                  rows={2}
                  className={inputClass("address") + " resize-none"}
                />
                {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
              </div>

              {/* PHONE */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.phoneNumber")} <span className="text-red-400">*</span></label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder={t("bookingPage.form.phonePlaceholder")}
                  maxLength={10}
                  className={inputClass("phone")}
                />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* NOTES */}
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block"> {t("bookingPage.form.additionalNotes")} <span className="text-gray-400">({t("bookingPage.form.optional")})</span></label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder={t("bookingPage.form.notesPlaceholder")}
                  rows={2}
                  className="w-full p-3 rounded-xl bg-white/80 shadow-sm outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              {/* NEXT: Review */}
              <button
                onClick={goToReview}
                className="w-full py-3.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-lg flex items-center justify-center gap-2"
              >
                {priceInfo ? t("bookingPage.form.reviewBookingWithPrice", { amount: priceInfo.total }) : t("bookingPage.form.reviewBooking")}
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