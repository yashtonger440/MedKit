import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CallScreen from "../components/CallScreen";
import useCall from "../hooks/useCall";
import {
  FaUserMd, FaHeartbeat, FaBone,
  FaBaby, FaFemale, FaEye,
  FaStar, FaTimes, FaMapMarkerAlt,
  FaVideo, FaPhoneAlt, FaCheckCircle,
  FaWhatsapp, FaArrowLeft, FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";

const services = [
  { key: "generalMedicine", price: 499,  icon: <FaUserMd />,    specialization: "General Medicine",  color: "bg-blue-50 text-blue-500 border-blue-100"    },
  { key: "gastroenterology",price: 699,  icon: <FaHeartbeat />, specialization: "Gastroenterology",  color: "bg-red-50 text-red-500 border-red-100"        },
  { key: "orthopaedic",     price: 799,  icon: <FaBone />,      specialization: "Orthopaedic",       color: "bg-orange-50 text-orange-500 border-orange-100"},
  { key: "cardiology",      price: 899,  icon: <FaHeartbeat />, specialization: "cardiology",        color: "bg-pink-50 text-pink-500 border-pink-100"      },
  { key: "physician",       price: 499,  icon: <FaUserMd />,    specialization: "Physician",         color: "bg-indigo-50 text-indigo-500 border-indigo-100"},
  { key: "dietitian",       price: 399,  icon: <FaUserMd />,    specialization: "Dietitian",         color: "bg-green-50 text-green-500 border-green-100"   },
  { key: "pediatrician",    price: 599,  icon: <FaBaby />,      specialization: "Pediatrician",      color: "bg-yellow-50 text-yellow-500 border-yellow-100"},
  { key: "dermatology",     price: 699,  icon: <FaEye />,       specialization: "Dermatology",       color: "bg-purple-50 text-purple-500 border-purple-100"},
  { key: "gynecologist",    price: 799,  icon: <FaFemale />,    specialization: "Gynecologist",      color: "bg-rose-50 text-rose-500 border-rose-100"      },
  { key: "ent",             price: 599,  icon: <FaUserMd />,    specialization: "ENT",               color: "bg-teal-50 text-teal-500 border-teal-100"      },
];

const TIME_SLOTS = [
  "09:00 AM","10:00 AM","11:00 AM","12:00 PM",
  "01:00 PM","02:00 PM","03:00 PM","04:00 PM",
  "05:00 PM","06:00 PM",
];

const CONSULT_TYPES = [
  { value: "Call",       emoji: "📞", labelKey: "audioCall",  descKey: "audioCallDesc",  needsAddress: false },
  { value: "Video",      emoji: "📹", labelKey: "videoCall",  descKey: "videoCallDesc",  needsAddress: false },
  { value: "Home Visit", emoji: "🏠", labelKey: "homeVisit",  descKey: "homeVisitDesc",  needsAddress: true  },
];

const Toast = ({ msg, type, onClose }) => (
  <div className={`fixed top-5 right-5 z-[100] px-5 py-3 rounded-2xl shadow-xl text-white text-sm flex items-center gap-3 transition-all
    ${type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"}`}>
    {type === "success" ? <FaCheckCircle /> : "⚠"}
    <span>{msg}</span>
    <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100"><FaTimes size={12}/></button>
  </div>
);

const DoctorBooking = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedService,    setSelectedService]    = useState(null);
  const [doctors,            setDoctors]            = useState([]);
  const [popupOpen,          setPopupOpen]          = useState(false);
  const [loadingDoctors,     setLoadingDoctors]     = useState(false);
  const [selectedDoctor,     setSelectedDoctor]     = useState(null);
  const [bookingOpen,        setBookingOpen]        = useState(false);
  const [confirmedBookings,  setConfirmedBookings]  = useState([]);
  const [reportFile,         setReportFile]         = useState(null);
  const [loading,            setLoading]            = useState(false);
  const [sortBy,             setSortBy]             = useState("default"); // "rating" | "fee_low" | "fee_high"
  const [toast,              setToast]              = useState(null);
  const [bookingStep,        setBookingStep]        = useState("form"); // "form" | "review" | "confirmed"
  const [lastBooking,        setLastBooking]        = useState(null);
  const [formErrors,         setFormErrors]         = useState({});

  const [form, setForm] = useState({
    date: "", time: "", phone: "", address: "", type: "Call",
  });

  const today = new Date().toISOString().split("T")[0];
  const token = localStorage.getItem("token");
  const userId = token
    ? JSON.parse(atob(token.split(".")[1] || "e30="))?.id
    : null;

  const { callState, myVideo, remoteVideo, initiateCall, endCall } = useCall(userId);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const checkLogin = () => {
    if (!token) {
      navigate("/auth", { state: { redirect: "/doctor-booking" } });
      return false;
    }
    return true;
  };

  const getConfirmedType = (doctorId) =>
    confirmedBookings.find((b) => b.doctorId === doctorId)?.type || null;

  const handleServiceClick = async (svc) => {
    if (!checkLogin()) return;
    setSelectedService(svc);
    setPopupOpen(true);
    setLoadingDoctors(true);
    setSortBy("default");
    try {
      const res = await API.get(`/bookings/doctors?specialization=${svc.specialization}`);
      setDoctors(res.data);
    } catch {
      showToast(t("doctorBooking.errLoadDoctors"), "error");
    } finally {
      setLoadingDoctors(false);
    }
  };

  const sortedDoctors = [...doctors].sort((a, b) => {
    if (sortBy === "rating")   return (b.rating || 4) - (a.rating || 4);
    if (sortBy === "fee_low")  return (a.fee || selectedService?.price || 0) - (b.fee || selectedService?.price || 0);
    if (sortBy === "fee_high") return (b.fee || selectedService?.price || 0) - (a.fee || selectedService?.price || 0);
    return 0;
  });

  const handleBookNow = (doctor) => {
    if (!checkLogin()) return;
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    setBookingStep("form");
    setForm({ date: "", time: "", phone: "", address: "", type: "Call" });
    setFormErrors({});
    setReportFile(null);
    setBookingOpen(true);
  };

  const handleVideoCall = (doctor) => {
    if (!checkLogin()) return;
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    initiateCall(doctor._id, doctor.name, "video");
  };

  const handleAudioCall = (doctor) => {
    if (!checkLogin()) return;
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    initiateCall(doctor._id, doctor.name, "audio");
  };

  const handleReportChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      showToast(t("doctorBooking.errFileType"), "error");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast(t("doctorBooking.errFileSize"), "error");
      e.target.value = "";
      return;
    }
    setReportFile(file);
  };

  const selectedConsultType = CONSULT_TYPES.find((c) => c.value === form.type);

  // Validate form
  const validate = () => {
    const e = {};
    if (!form.date)  e.date  = t("doctorBooking.errSelectDate");
    if (!form.time)  e.time  = t("doctorBooking.errSelectTime");
    if (!form.phone.trim()) e.phone = t("doctorBooking.errEnterPhone");
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim()))
      e.phone = t("doctorBooking.errInvalidPhone");
    if (selectedConsultType?.needsAddress && !form.address.trim())
      e.address = t("doctorBooking.errEnterAddress");
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToReview = () => {
    if (validate()) setBookingStep("review");
  };

  const handleSubmit = async () => {
    if (!selectedDoctor) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("service",  selectedService.specialization);
      formData.append("date",     form.date);
      formData.append("time",     form.time);
      formData.append("phone",    form.phone.trim());
      formData.append("address",  form.address);
      formData.append("type",     form.type);
      formData.append("price",    selectedDoctor.fee || selectedService.price);
      formData.append("doctorId", selectedDoctor._id);
      if (reportFile) formData.append("report", reportFile);

      await API.post("/bookings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setConfirmedBookings((prev) => [
        ...prev.filter((b) => b.doctorId !== selectedDoctor._id),
        { doctorId: selectedDoctor._id, type: form.type },
      ]);

      setLastBooking({
        doctor:  selectedDoctor,
        service: selectedService,
        form:    { ...form },
        price:   selectedDoctor.fee || selectedService.price,
      });
      setBookingStep("confirmed");
    } catch (err) {
      showToast(err.response?.data?.message || t("doctorBooking.errBookingFailed"), "error");
    } finally {
      setLoading(false);
    }
  };

  const inputCls = (field) =>
    `w-full p-3 rounded-xl bg-gray-50 outline-none focus:ring-2 transition text-sm ${
      formErrors[field] ? "ring-2 ring-red-300 border border-red-300" : "focus:ring-blue-300 border border-gray-200"
    }`;

  // ── Confirmed screen inside popup ──────────────────────────────────────────
  const renderConfirmed = () => {
    const waMsg = encodeURIComponent(
      `Hi MedKit! My doctor booking is confirmed.\nDoctor: ${lastBooking?.doctor?.name}\nService: ${t(`doctorBooking.services.${lastBooking?.service?.key}`)}\nDate: ${lastBooking?.form?.date} at ${lastBooking?.form?.time}\nType: ${lastBooking?.form?.type}\nPhone: ${lastBooking?.form?.phone}`
    );
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="text-green-500 text-3xl" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">{t("doctorBooking.confirmedTitle")}</h3>
        <p className="text-gray-500 text-sm mb-6">
           {t("doctorBooking.confirmedSubtitle", { doctor: lastBooking?.doctor?.name })}
        </p>

        <div className="bg-blue-50 rounded-2xl p-4 text-left mb-5 space-y-2">
          {[
            { label: t("doctorBooking.labelDoctor"),  value: lastBooking?.doctor?.name },
            { label: t("doctorBooking.labelService"), value: t(`doctorBooking.services.${lastBooking?.service?.key}`) },
            { label: t("doctorBooking.labelType"),    value: lastBooking?.form?.type },
            { label: t("doctorBooking.labelDate"),    value: lastBooking?.form?.date },
            { label: t("doctorBooking.labelTime"),    value: lastBooking?.form?.time },
            { label: t("doctorBooking.labelPhone"),   value: lastBooking?.form?.phone },
            lastBooking?.form?.address && { label: t("doctorBooking.labelAddress"), value: lastBooking?.form?.address },
          ].filter(Boolean).map((item) => (
            <div key={item.label} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className="font-medium text-gray-800 text-right max-w-[55%]">{item.value}</span>
            </div>
          ))}
          <div className="h-px bg-blue-200" />
          <div className="flex justify-between">
            <span className="font-bold text-gray-800">{t("doctorBooking.labelFee")}</span>
            <span className="font-bold text-blue-600">₹{lastBooking?.price}</span>
          </div>
        </div>

        <a
          href={`https://wa.me/919818185270?text=${waMsg}`}
          target="_blank" rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl font-semibold mb-3 transition text-sm"
        >
          <FaWhatsapp /> {t("doctorBooking.shareWhatsapp")}
        </a>
        <button
          onClick={() => navigate("/bookinghistory")}
          className="w-full py-2.5 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold text-sm mb-2 transition"
        >
          {t("doctorBooking.viewMyBookings")}
        </button>
        <button
          onClick={() => { setBookingOpen(false); setBookingStep("form"); }}
          className="w-full py-2 text-gray-400 hover:text-gray-600 text-sm transition"
        >
          {t("doctorBooking.close")}
        </button>
      </div>
    );
  };

  // ── Review screen inside popup ─────────────────────────────────────────────
  const renderReview = () => (
    <div className="p-6">
      <button
        onClick={() => setBookingStep("form")}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-5 transition"
      >
        <FaArrowLeft size={12} /> {t("doctorBooking.backToEdit")}
      </button>
      <h3 className="text-lg font-bold text-gray-800 mb-1">{t("doctorBooking.reviewAppointment")}</h3>
      <p className="text-gray-500 text-sm mb-5">{t("doctorBooking.reviewSubtitle")}</p>

      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl mb-5">
        <img
          src={selectedDoctor?.profileImage
            ? `${import.meta.env.VITE_API_URL}/uploads/${selectedDoctor.profileImage}`
            : `https://ui-avatars.com/api/?name=${selectedDoctor?.name}&background=3b82f6&color=fff`}
          alt={selectedDoctor?.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800 text-sm">{selectedDoctor?.name}</p>
          <p className="text-xs text-gray-500">{selectedDoctor?.specialization}</p>
        </div>
        <p className="font-bold text-blue-600">₹{selectedDoctor?.fee || selectedService?.price}</p>
      </div>

      <div className="space-y-2 mb-5">
        {[
          { label: t("doctorBooking.labelConsultation"), value: form.type },
          { label: t("doctorBooking.labelDate"),          value: form.date },
          { label: t("doctorBooking.labelTime"),          value: form.time },
          { label: t("doctorBooking.labelPhone"),         value: form.phone },
          form.address && { label: t("doctorBooking.labelAddress"), value: form.address },
          reportFile && { label: t("doctorBooking.labelReport"), value: reportFile.name },
        ].filter(Boolean).map((item) => (
          <div key={item.label} className="flex justify-between text-sm py-2 border-b border-gray-100">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-medium text-gray-800 text-right max-w-[60%] truncate">{item.value}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition disabled:opacity-60 flex items-center justify-center gap-2"
      >
        {loading
          ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> {t("doctorBooking.confirming")}</>
          : t("doctorBooking.confirmBooking", { price: selectedDoctor?.fee || selectedService?.price })}
      </button>
    </div>
  );

  // ── Booking form ───────────────────────────────────────────────────────────
  const renderForm = () => (
    <div className="p-6">
      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl mb-5">
        <img
          src={selectedDoctor?.profileImage
            ? `${import.meta.env.VITE_API_URL}/uploads/${selectedDoctor.profileImage}`
            : `https://ui-avatars.com/api/?name=${selectedDoctor?.name}&background=3b82f6&color=fff`}
          alt={selectedDoctor?.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="font-semibold text-gray-800">{selectedDoctor?.name}</p>
          <p className="text-sm text-gray-500">{selectedDoctor?.specialization}</p>
          {selectedDoctor?.experience && (
            <p className="text-xs text-blue-500 mt-0.5">{t("doctorBooking.yrsExperience", { years: selectedDoctor.experience })}</p>
          )}
        </div>
        <p className="font-bold text-blue-600 text-lg">₹{selectedDoctor?.fee || selectedService?.price}</p>
      </div>

      <div className="space-y-4">

        {/* Consultation Type */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{t("doctorBooking.consultationType")}</label>
          <div className="grid grid-cols-3 gap-2">
            {CONSULT_TYPES.map((ct) => (
              <button
                key={ct.value}
                type="button"
                onClick={() => { setForm({ ...form, type: ct.value, address: "" }); setFormErrors((p) => ({ ...p, address: "" })); }}
                className={`rounded-xl border px-2 py-2.5 text-center transition-all ${
                  form.type === ct.value
                    ? "bg-blue-50 border-blue-300 ring-2 ring-blue-200"
                    : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                }`}
              >
                <p className={`text-xs font-semibold ${form.type === ct.value ? "text-blue-600" : "text-gray-700"}`}>
                  {ct.emoji} {t(`doctorBooking.consultTypes.${ct.labelKey}`)}
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 leading-tight">{t(`doctorBooking.consultTypes.${ct.descKey}`)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("doctorBooking.date")} <span className="text-red-400">*</span></label>
            <input
              type="date"
              min={today}
              value={form.date}
              onChange={(e) => { setForm({ ...form, date: e.target.value }); setFormErrors((p) => ({ ...p, date: "" })); }}
              className={inputCls("date")}
            />
            {formErrors.date && <p className="text-xs text-red-500 mt-1">{formErrors.date}</p>}
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("doctorBooking.timeSlot")} <span className="text-red-400">*</span></label>
            <select
              value={form.time}
              onChange={(e) => { setForm({ ...form, time: e.target.value }); setFormErrors((p) => ({ ...p, time: "" })); }}
              className={inputCls("time")}
            >
              <option value="">{t("doctorBooking.selectDash")}</option>
              {TIME_SLOTS.map((t2) => <option key={t2} value={t2}>{t2}</option>)}
            </select>
            {formErrors.time && <p className="text-xs text-red-500 mt-1">{formErrors.time}</p>}
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("doctorBooking.phoneNumber")} <span className="text-red-400">*</span></label>
          <input
            type="tel"
            maxLength={10}
            value={form.phone}
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); setFormErrors((p) => ({ ...p, phone: "" })); }}
            placeholder={t("doctorBooking.phonePlaceholder")}
            className={inputCls("phone")}
          />
          {formErrors.phone && <p className="text-xs text-red-500 mt-1">{formErrors.phone}</p>}
        </div>

        {/* Address — only for Home Visit */}
        {selectedConsultType?.needsAddress && (
          <div>
            <label className="text-xs font-semibold text-gray-500 mb-1 block">{t("doctorBooking.homeAddress")} <span className="text-red-400">*</span></label>
            <textarea
              rows={2}
              value={form.address}
              onChange={(e) => { setForm({ ...form, address: e.target.value }); setFormErrors((p) => ({ ...p, address: "" })); }}
              placeholder={t("doctorBooking.addressPlaceholder")}
              className={inputCls("address") + " resize-none"}
            />
            {formErrors.address && <p className="text-xs text-red-500 mt-1">{formErrors.address}</p>}
          </div>
        )}

        {/* Report Upload */}
        <div>
          <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
            {t("doctorBooking.medicalReport")} <span className="text-gray-400 font-normal">{t("doctorBooking.optional")}</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-blue-200 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-all">
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleReportChange} className="hidden" />
            {reportFile ? (
              <div className="flex items-center gap-2 px-4 w-full">
                <span className="text-xl">{reportFile.type === "application/pdf" ? "📄" : "🖼️"}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">{reportFile.name}</p>
                  <p className="text-xs text-gray-400">{(reportFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button type="button" onClick={(e) => { e.preventDefault(); setReportFile(null); }}
                  className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center hover:bg-red-200 transition">
                  <FaTimes size={10} />
                </button>
              </div>
            ) : (
              <div className="text-center px-4">
                <p className="text-sm text-blue-500 font-medium">{t("doctorBooking.clickToUpload")}</p>
                <p className="text-xs text-gray-400 mt-0.5">{t("doctorBooking.fileTypesHint")}</p>
              </div>
            )}
          </label>
        </div>

        <button
          type="button"
          onClick={goToReview}
          className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition shadow-md"
        >
          {t("doctorBooking.reviewBookingBtn")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* Call Screen */}
      {(callState.isCalling || callState.callAccepted) && !callState.callEnded && (
        <CallScreen
          myVideo={myVideo}
          remoteVideo={remoteVideo}
          remoteStream={callState.remoteStream}
          myStream={callState.myStream}
          callerName={selectedDoctor?.name}
          callAccepted={callState.callAccepted}
          callType={callState.callType}
          onEndCall={() => endCall(selectedDoctor?._id)}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100 px-6 py-20 mt-5">

        {/* Login warning */}
        {!token && (
          <div className="max-w-6xl mx-auto mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl px-5 py-3 flex items-center justify-between gap-4">
              <p className="text-sm text-yellow-700 font-medium">⚠ {t("doctorBooking.loginRequired")}</p>
              <button
                onClick={() => navigate("/login", { state: { redirect: "/doctor-booking" } })}
                className="text-xs font-semibold text-white bg-yellow-500 hover:bg-yellow-600 px-4 py-1.5 rounded-lg transition shrink-0"
              >
                {t("doctorBooking.loginSignup")}
              </button>
            </div>
          </div>
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">{t("doctorBooking.pageTitle")} 👨‍⚕️</h1>
          <p className="text-gray-600 mt-2">{t("doctorBooking.pageSubtitle")}</p>
        </div>

        {/* Service Cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {services.map((svc, i) => (
            <div
              key={i}
              onClick={() => handleServiceClick(svc)}
              className="cursor-pointer p-5 rounded-2xl border bg-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center text-xl mb-3 ${svc.color}`}>
                {svc.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm">{t(`doctorBooking.services.${svc.key}`)}</h3>
              <p className="text-xs text-gray-400 mt-1">{t("doctorBooking.consultation")}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">{t("doctorBooking.fromPrice", { price: svc.price })}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Doctors Popup ───────────────────────────────────────────── */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">{t("doctorBooking.doctorsHeading", { service: t(`doctorBooking.services.${selectedService?.key}`) })}</h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-blue-500" /> {t("doctorBooking.availableDoctors")}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-300 cursor-pointer appearance-none pr-6"
                  >
                    <option value="default">{t("doctorBooking.sortBy")}</option>
                    <option value="rating">{t("doctorBooking.topRated")}</option>
                    <option value="fee_low">{t("doctorBooking.feeLowHigh")}</option>
                    <option value="fee_high">{t("doctorBooking.feeHighLow")}</option>
                  </select>
                  <FaSortAmountDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                <button
                  onClick={() => setPopupOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
                >
                  <FaTimes size={16} className="text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {loadingDoctors ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 mt-3">{t("doctorBooking.findingDoctors")}</p>
                </div>
              ) : sortedDoctors.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">{t("doctorBooking.noDoctors")}</p>
                  <p className="text-gray-400 text-sm mt-1">{t("doctorBooking.tryAnotherService")}</p>
                </div>
              ) : (
                sortedDoctors.map((doc) => {
                  const confirmedType = getConfirmedType(doc._id);
                  const hasCallBooked  = confirmedType === "Call";
                  const hasVideoBooked = confirmedType === "Video";

                  return (
                    <div key={doc._id}
                      className="flex items-start gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all">
                      <img
                        src={doc.profileImage
                          ? `${import.meta.env.VITE_API_URL}/uploads/${doc.profileImage}`
                          : `https://ui-avatars.com/api/?name=${doc.name}&background=3b82f6&color=fff`}
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                        {doc.experience && (
                          <p className="text-xs text-blue-500 mt-0.5">{t("doctorBooking.yrsExperience", { years: doc.experience })}</p>
                        )}
                        <div className="flex items-center gap-1 mt-1">
                          {[1,2,3,4,5].map((star) => (
                            <FaStar key={star} size={11}
                              className={star <= (doc.rating || 4) ? "text-yellow-400" : "text-gray-200"} />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">({doc.rating || 4}.0)</span>
                          <span className="text-xs text-green-500 ml-2 font-medium">● {t("doctorBooking.availableToday")}</span>
                        </div>
                        {confirmedType && (
                          <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                            <FaCheckCircle size={10} />
                            {confirmedType === "Call" && t("doctorBooking.audioCallBooked")}
                            {confirmedType === "Video" && t("doctorBooking.videoCallBooked")}
                            {confirmedType === "Home Visit" && t("doctorBooking.homeVisitBooked")}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="font-bold text-blue-600">₹{doc.fee || selectedService?.price}</p>

                        {!confirmedType && (
                          <button onClick={() => handleBookNow(doc)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition w-full text-center">
                            {t("doctorBooking.bookNowBtn")}
                          </button>
                        )}

                        <button
                          onClick={() => hasVideoBooked && handleVideoCall(doc)}
                          disabled={!hasVideoBooked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 w-full
                            ${hasVideoBooked ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                        >
                          <FaVideo size={10} />
                          {hasVideoBooked ? t("doctorBooking.videoCall") : t("doctorBooking.videoBookFirst")}
                        </button>

                        <button
                          onClick={() => hasCallBooked && handleAudioCall(doc)}
                          disabled={!hasCallBooked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 w-full
                            ${hasCallBooked ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                        >
                          <FaPhoneAlt size={10} />
                          {hasCallBooked ? t("doctorBooking.audioCall") : t("doctorBooking.audioBookFirst")}
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Booking Form / Review / Confirmed Popup ──────────────────── */}
      {bookingOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-800">
                {bookingStep === "form"      && t("doctorBooking.bookAppointment")}
                {bookingStep === "review"    && t("doctorBooking.reviewAppointment")}
                {bookingStep === "confirmed" && t("doctorBooking.bookingConfirmed")}
              </h2>
              {bookingStep !== "confirmed" && (
                <button
                  onClick={() => { setBookingOpen(false); setBookingStep("form"); setReportFile(null); }}
                  className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
                >
                  <FaTimes size={16} className="text-gray-600" />
                </button>
              )}
            </div>

            {bookingStep === "form"      && renderForm()}
            {bookingStep === "review"    && renderReview()}
            {bookingStep === "confirmed" && renderConfirmed()}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DoctorBooking;