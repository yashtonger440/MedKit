import { useEffect, useState } from "react";
import API from "../services/api";
import {
  FaUserMd, FaFileMedical, FaPills,
  FaChevronDown, FaChevronUp, FaClock,
  FaMapMarkerAlt, FaPhone, FaVideo, FaHome,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const BookingHistory = () => {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  
   const navigate = useNavigate();

  // Tracks which booking's prescription panel is open
  // { [bookingId]: true/false }
  const [openPrescriptions, setOpenPrescriptions] = useState({});

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my");
        setBookings(res.data);
      } catch (err) {
        console.log("error object", err);
        console.log("BACKEND ERROR:", err.response?.data);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ✅ Toggle prescription panel open/close for a specific booking
  const togglePrescription = (id) => {
    setOpenPrescriptions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ✅ Status badge style helper
  const badgeStyle = (status) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-600";
      case "cancelled":  return "bg-red-100 text-red-500";
      case "accepted":   return "bg-blue-100 text-blue-600";
      default:           return "bg-yellow-100 text-yellow-600";
    }
  };

  // ✅ Booking type badge
  const typeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "call":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-purple-100 text-purple-700">
            <FaPhone size={9} /> Audio Call
          </span>
        );
      case "video":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-700">
            <FaVideo size={9} /> Video Call
          </span>
        );
      case "home visit":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-orange-100 text-orange-700">
            <FaHome size={9} /> Home Visit
          </span>
        );
      default: return null;
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-20">

      <button
        onClick={() => navigate("/")}
        className="absolute top-5 left-5 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100"
      >
        ← Home
      </button>

      <h1 className="text-3xl font-bold text-center mb-10">My Bookings</h1>

      {bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings found</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-5">
          {bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white shadow-sm rounded-2xl overflow-hidden border border-gray-100"
            >
              {/* ── Top Section: main booking info ── */}
              <div className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">

                {/* Left — Service + Doctor + Date */}
                <div className="space-y-2 flex-1">

                  {/* Service name + type badge */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-lg font-bold text-gray-800">{b.service}</h2>
                    {typeBadge(b.type)}
                  </div>

                  {/* Doctor info — comes from .populate("doctor") in backend */}
                  {b.doctor && (
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          b.doctor.profileImage
                            ? `${import.meta.env.VITE_API_URL}/uploads/${b.doctor.profileImage}`
                            : `https://ui-avatars.com/api/?name=${b.doctor.name}&background=3b82f6&color=fff`
                        }
                        alt={b.doctor.name}
                        className="w-7 h-7 rounded-full object-cover border border-blue-100"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-700">{b.doctor.name}</p>
                        <p className="text-xs text-gray-400">{b.doctor.specialization}</p>
                      </div>
                    </div>
                  )}

                  {/* Date + Address */}
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-gray-500 flex items-center gap-1.5">
                      <FaClock size={11} className="text-gray-400" />
                      {new Date(b.date).toLocaleString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit", hour12: true,
                      })}
                    </p>
                    {b.address && (
                      <p className="text-sm text-gray-500 flex items-center gap-1.5">
                        <FaMapMarkerAlt size={11} className="text-gray-400" />
                        {b.address}
                      </p>
                    )}
                  </div>

                  {/* ✅ Report uploaded indicator */}
                  {b.reportUrl && (
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-teal-50 text-teal-600 border border-teal-200">
                        <FaFileMedical size={9} /> Report Uploaded
                      </span>
                    </div>
                  )}
                </div>

                {/* Right — Price + Status */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <p className="text-xl font-bold text-blue-600">₹{b.price}</p>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium capitalize ${badgeStyle(b.status)}`}>
                    {b.status}
                  </span>
                </div>
              </div>

              {/* ── Prescription Section ── */}
              {/* Only show if doctor has written a prescription */}
              {b.prescription?.notes || b.prescription?.medicines?.length > 0 ? (
                <div className="border-t border-gray-100">

                  {/* Toggle button */}
                  <button
                    onClick={() => togglePrescription(b._id)}
                    className="w-full flex items-center justify-between px-5 py-3 bg-indigo-50 hover:bg-indigo-100 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <FaPills size={13} className="text-indigo-500" />
                      <span className="text-sm font-semibold text-indigo-700">
                        Doctor's Prescription Available
                      </span>
                    </div>
                    {openPrescriptions[b._id]
                      ? <FaChevronUp size={12} className="text-indigo-500" />
                      : <FaChevronDown size={12} className="text-indigo-500" />
                    }
                  </button>

                  {/* Prescription content — shown when toggled open */}
                  {openPrescriptions[b._id] && (
                    <div className="px-5 py-4 bg-indigo-50/50 space-y-4">

                      {/* Doctor info inside prescription */}
                      {b.doctor && (
                        <div className="flex items-center gap-2">
                          <FaUserMd size={13} className="text-indigo-400" />
                          <p className="text-xs text-gray-500">
                            Prescribed by{" "}
                            <span className="font-semibold text-gray-700">
                              {b.doctor.name}
                            </span>
                            {b.prescription?.createdAt && (
                              <span className="text-gray-400 ml-1">
                                · {new Date(b.prescription.createdAt).toLocaleDateString("en-IN", {
                                  day: "numeric", month: "short", year: "numeric",
                                })}
                              </span>
                            )}
                          </p>
                        </div>
                      )}

                      {/* Doctor's notes */}
                      {b.prescription?.notes && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100">
                          <p className="text-xs font-semibold text-gray-500 mb-1.5">
                            📋 Doctor's Notes
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {b.prescription.notes}
                          </p>
                        </div>
                      )}

                      {/* Medicines list */}
                      {b.prescription?.medicines?.length > 0 && (
                        <div className="bg-white rounded-xl p-4 border border-indigo-100">
                          <p className="text-xs font-semibold text-gray-500 mb-3">
                            💊 Medicines
                          </p>
                          <div className="space-y-2">
                            {b.prescription.medicines.map((med, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-3 p-2.5 rounded-lg bg-indigo-50 border border-indigo-100"
                              >
                                {/* Medicine number */}
                                <span className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>

                                {/* Medicine details */}
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-gray-800">
                                    {med.name}
                                  </p>
                                </div>

                                {/* Dose */}
                                {med.dose && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-600 shrink-0">
                                    {med.dose}
                                  </span>
                                )}

                                {/* Duration */}
                                {med.duration && (
                                  <span className="text-xs text-gray-500 shrink-0">
                                    for {med.duration}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                // Show this when booking is accepted but no prescription yet
                b.status === "accepted" && (
                  <div className="border-t border-gray-100 px-5 py-3 bg-gray-50">
                    <p className="text-xs text-gray-400 flex items-center gap-1.5">
                      <FaPills size={10} />
                      Prescription will appear here once the doctor writes it
                    </p>
                  </div>
                )
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;
