import { useState } from "react";
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
} from "react-icons/fa";

const services = [
  { name: "General Medicine",  price: 499,  icon: <FaUserMd />,    specialization: "General Medicine" },
  { name: "Gastroenterology",  price: 699,  icon: <FaHeartbeat />, specialization: "Gastroenterology" },
  { name: "Orthopaedic",       price: 799,  icon: <FaBone />,      specialization: "Orthopaedic" },
  { name: "Cardiology",        price: 899,  icon: <FaHeartbeat />, specialization: "cardiology" },
  { name: "Physician",         price: 499,  icon: <FaUserMd />,    specialization: "Physician" },
  { name: "Dietitian",         price: 399,  icon: <FaUserMd />,    specialization: "Dietitian" },
  { name: "Pediatrician",      price: 599,  icon: <FaBaby />,      specialization: "Pediatrician" },
  { name: "Dermatology",       price: 699,  icon: <FaEye />,       specialization: "Dermatology" },
  { name: "Gynecologist",      price: 799,  icon: <FaFemale />,    specialization: "Gynecologist" },
  { name: "ENT",               price: 599,  icon: <FaUserMd />,    specialization: "ENT" },
];

const DoctorBooking = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [loadingDoctors, setLoadingDoctors] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [form, setForm] = useState({
    date: "", time: "", phone: "", address: "", type: "Call",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Booking confirm hone ke baad doctor ID + type save karo
  // { doctorId, type: "Call" | "Video" | "Home Visit" }
  const [confirmedBookings, setConfirmedBookings] = useState([]);

  const userId = JSON.parse(
    atob(localStorage.getItem("token")?.split(".")[1] || "e30=")
  )?.id;

  const { callState, myVideo, remoteVideo, initiateCall, endCall } = useCall(userId);

  // ✅ Check karo kya is doctor ke liye call/video booking confirmed hai
  const getConfirmedType = (doctorId) => {
    const booking = confirmedBookings.find((b) => b.doctorId === doctorId);
    return booking?.type || null;
  };

  const handleServiceClick = async (svc) => {
    setSelectedService(svc);
    setPopupOpen(true);
    setLoadingDoctors(true);
    try {
      const res = await API.get(`/bookings/doctors?specialization=${svc.specialization}`);
      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleBookNow = (doctor) => {
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    setBookingOpen(true);
  };

  const handleVideoCall = (doctor) => {
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    initiateCall(doctor._id, doctor.name, "video");
  };

  const handleAudioCall = (doctor) => {
    setSelectedDoctor(doctor);
    setPopupOpen(false);
    initiateCall(doctor._id, doctor.name, "audio");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor) return;
    try {
      setLoading(true);
      await API.post("/bookings", {
        service: selectedService.specialization,
        ...form,
        price: selectedDoctor.fee || selectedService.price,
        doctorId: selectedDoctor._id,
      });

      // ✅ Booking confirm — is doctor ka type save karo
      setConfirmedBookings((prev) => [
        ...prev.filter((b) => b.doctorId !== selectedDoctor._id), // duplicate avoid
        { doctorId: selectedDoctor._id, type: form.type },
      ]);

      alert("Booking successful!");
      setBookingOpen(false);

      // ✅ Agar Call ya Video book kiya toh doctor list wापस kholo
      if (form.type === "Call" || form.type === "Video") {
        setPopupOpen(true);
      }

      setForm({ date: "", time: "", phone: "", address: "", type: "Call" });
    } catch (err) {
      alert(err.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ── Call Screen ── */}
      {(callState.isCalling || callState.callAccepted) && !callState.callEnded && (
        <CallScreen
          myVideo={myVideo}
          remoteVideo={remoteVideo}
          remoteStream={callState.remoteStream}
          callerName={selectedDoctor?.name}
          callAccepted={callState.callAccepted}
          callType={callState.callType}
          onEndCall={() => endCall(selectedDoctor?._id)}
        />
      )}

      <div className="min-h-screen bg-linear-to-br from-blue-50 to-cyan-100 px-6 py-20">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Book a Doctor 👨‍⚕️</h1>
          <p className="text-gray-600 mt-2">
            Choose your service and we'll find the best doctor for you
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6 mb-10">
          {services.map((svc, i) => (
            <div
              key={i}
              onClick={() => handleServiceClick(svc)}
              className="cursor-pointer p-5 rounded-2xl border bg-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="text-3xl mb-3 text-blue-500">{svc.icon}</div>
              <h3 className="font-semibold text-gray-800">{svc.name}</h3>
              <p className="text-sm text-gray-400 mt-1">Consultation</p>
              <p className="text-sm font-bold text-blue-600 mt-1">Starting ₹{svc.price}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Doctors Popup ── */}
      {popupOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedService?.name} Doctors
                </h2>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <FaMapMarkerAlt className="text-blue-500" />
                  Nearby available doctors
                </p>
              </div>
              <button
                onClick={() => setPopupOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {loadingDoctors ? (
                <div className="text-center py-10">
                  <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-gray-500 mt-3">Finding doctors...</p>
                </div>
              ) : doctors.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500 text-lg">No doctors available</p>
                  <p className="text-gray-400 text-sm mt-1">Please try another service</p>
                </div>
              ) : (
                doctors.map((doc) => {
                  const confirmedType = getConfirmedType(doc._id);
                  const hasCallBooked = confirmedType === "Call";
                  const hasVideoBooked = confirmedType === "Video";

                  return (
                    <div
                      key={doc._id}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                    >
                      <img
                        src={
                          doc.profileImage
                            ? `${import.meta.env.VITE_API_URL}/uploads/${doc.profileImage}`
                            : `https://ui-avatars.com/api/?name=${doc.name}&background=3b82f6&color=fff`
                        }
                        alt={doc.name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-blue-100 shrink-0"
                      />

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800">{doc.name}</p>
                        <p className="text-sm text-gray-500">{doc.specialization}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <FaStar
                              key={star}
                              size={11}
                              className={star <= (doc.rating || 4) ? "text-yellow-400" : "text-gray-200"}
                            />
                          ))}
                          <span className="text-xs text-gray-400 ml-1">({doc.rating || 4}.0)</span>
                        </div>

                        {/* ✅ Confirmed booking badge */}
                        {confirmedType && (
                          <div className="mt-1.5 inline-flex items-center gap-1 text-xs text-green-600 font-medium">
                            <FaCheckCircle size={10} />
                            {confirmedType === "Call" && "Audio Call Booked"}
                            {confirmedType === "Video" && "Video Call Booked"}
                            {confirmedType === "Home Visit" && "Home Visit Booked"}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <p className="font-bold text-blue-600">₹{doc.fee || selectedService?.price}</p>

                        {/* Book Now — sirf tab hide karo jab already booked ho */}
                        {!confirmedType && (
                          <button
                            onClick={() => handleBookNow(doc)}
                            className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-medium transition w-full text-center"
                          >
                            Book Now
                          </button>
                        )}

                        {/* ✅ Video Call — sirf tab enable hoga jab "Video" book kiya ho */}
                        <button
                          onClick={() => hasVideoBooked && handleVideoCall(doc)}
                          disabled={!hasVideoBooked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 w-full
                            ${hasVideoBooked
                              ? "bg-green-500 hover:bg-green-600 text-white cursor-pointer"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <FaVideo size={10} />
                          {hasVideoBooked ? "Video Call" : "Video Call (Book First)"}
                        </button>

                        {/* ✅ Audio Call — sirf tab enable hoga jab "Call" book kiya ho */}
                        <button
                          onClick={() => hasCallBooked && handleAudioCall(doc)}
                          disabled={!hasCallBooked}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition flex items-center justify-center gap-1 w-full
                            ${hasCallBooked
                              ? "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer"
                              : "bg-gray-100 text-gray-400 cursor-not-allowed"
                            }`}
                        >
                          <FaPhoneAlt size={10} />
                          {hasCallBooked ? "Audio Call" : "Audio Call (Book First)"}
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

      {/* ── Booking Form Popup ── */}
      {bookingOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">Book Appointment</h2>
              <button
                onClick={() => setBookingOpen(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200"
              >
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl mb-5">
                <img
                  src={
                    selectedDoctor.profileImage
                      ? `${import.meta.env.VITE_API_URL}/uploads/${selectedDoctor.profileImage}`
                      : `https://ui-avatars.com/api/?name=${selectedDoctor.name}&background=3b82f6&color=fff`
                  }
                  alt={selectedDoctor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{selectedDoctor.name}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor.specialization}</p>
                </div>
                <p className="ml-auto font-bold text-blue-600 text-lg">
                  ₹{selectedDoctor.fee || selectedService?.price}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500">Consultation Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl bg-gray-100 outline-none"
                  >
                    <option value="Call">📞 Audio Call</option>
                    <option value="Video">📹 Video Call</option>
                    <option value="Home Visit">🏠 Home Visit</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <input type="date" required
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="p-3 rounded-xl bg-gray-100 outline-none"
                  />
                  <input type="time" required
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="p-3 rounded-xl bg-gray-100 outline-none"
                  />
                </div>

                <input type="text" placeholder="📞 Phone Number" required
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-100 outline-none"
                />

                <textarea placeholder="📍 Enter Address" required rows={2}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full p-3 rounded-xl bg-gray-100 outline-none resize-none"
                />

                <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl">
                  <span className="text-sm text-gray-600">Consultation Fee</span>
                  <span className="text-blue-600 font-bold text-lg">
                    ₹{selectedDoctor?.fee || selectedService?.price}
                  </span>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold transition duration-300 shadow-md disabled:opacity-60"
                >
                  {loading ? "Booking..." : "Confirm Booking"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default DoctorBooking;