import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Search, LayoutDashboard,
  LogOut, Menu, X, User,
} from "lucide-react";
import { FaPhone, FaPhoneSlash, FaVideo, FaHome, FaHistory, FaTimes } from "react-icons/fa";
import useCall from "../../hooks/useCall";
import CallScreen from "../../components/CallScreen";

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({
    total: 0, pending: 0, accepted: 0, completed: 0,
  });

  // ✅ User history popup state
  const [historyPopup, setHistoryPopup] = useState(false);
  const [selectedUserHistory, setSelectedUserHistory] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");

  const doctorName = localStorage.getItem("doctorName") || "Doctor";
  const initials = doctorName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const doctorId = JSON.parse(
    atob(localStorage.getItem("token")?.split(".")[1] || "e30=")
  )?.id;

  const {
    callState, myVideo, remoteVideo,
    initiateCall, acceptCall, rejectCall, endCall,
  } = useCall(doctorId);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/bookings/doctor`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = res.data;
      setBookings(data);
      setStats({
        total:     data.length,
        pending:   data.filter((b) => b.status === "pending").length,
        accepted:  data.filter((b) => b.status === "accepted").length,
        completed: data.filter((b) => b.status === "completed").length,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  // ✅ User ki saari bookings nikalo
  // Agar sirf 1 booking hai → new user (button disabled)
  // Agar 2+ bookings hain → existing user (button enabled)
  const getUserBookings = (userId) => {
    return bookings.filter((b) => b.user?._id === userId);
  };

  // ✅ View History button click
  const handleViewHistory = (userId, userName) => {
    const userBookings = getUserBookings(userId);
    setSelectedUserHistory(userBookings);
    setSelectedUserName(userName);
    setHistoryPopup(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("doctorName");
    navigate("/doctor-login");
  };

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  const bookingTypeBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "call":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
            <FaPhone size={9} /> Audio Call
          </span>
        );
      case "video":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
            <FaVideo size={9} /> Video Call
          </span>
        );
      case "home visit":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
            <FaHome size={9} /> Home Visit
          </span>
        );
      default:
        return null;
    }
  };

  const navItems = [
    { label: "Dashboard", path: "/doctor-dashboard", icon: <LayoutDashboard size={18} /> },
  ];

  const isActive = (path) => location.pathname === path;

  const badgeStyle = (status) => {
    switch (status) {
      case "pending":   return "bg-yellow-100 text-yellow-700";
      case "accepted":  return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "cancelled": return "bg-red-100 text-red-700";
      default:          return "bg-gray-100 text-gray-600";
    }
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";

  const filtered = bookings
    .filter((b) => filter === "all" ? true : b.status === filter)
    .filter((b) =>
      b.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.service?.toLowerCase().includes(search.toLowerCase()) ||
      b.address?.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ── Incoming Call Notification ── */}
      {callState.isReceivingCall && !callState.callAccepted && (
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl p-5 z-50 w-72 border border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xl shrink-0">
              {callState.caller?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{callState.caller?.name}</p>
              <p className="text-sm text-gray-500 animate-pulse">
                Incoming {callState.callType === "video" ? "Video 📹" : "Audio 📞"} Call...
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => acceptCall(callState.callType)}
              className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FaPhone size={13} /> Accept
            </button>
            <button
              onClick={rejectCall}
              className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl flex items-center justify-center gap-2 transition"
            >
              <FaPhoneSlash size={13} /> Reject
            </button>
          </div>
        </div>
      )}

      {/* ── Active Call Screen ── */}
      {callState.callAccepted && !callState.callEnded && (
        <CallScreen
          myVideo={myVideo}
          remoteVideo={remoteVideo}
          remoteStream={callState.remoteStream}
          myStream={callState.myStream}
          callerName={callState.caller?.name}
          callAccepted={callState.callAccepted}
          callType={callState.callType}
          onEndCall={() => endCall(callState.caller?.id)}
        />
      )}

      {/* ── User History Popup ── */}
      {historyPopup && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto">

            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  {selectedUserName} ki History
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {selectedUserHistory.length} total appointments
                </p>
              </div>
              <button
                onClick={() => setHistoryPopup(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition"
              >
                <FaTimes size={16} className="text-gray-600" />
              </button>
            </div>

            {/* History List */}
            <div className="p-6 space-y-3">
              {selectedUserHistory.map((b, i) => (
                <div key={b._id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-white transition-all">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="space-y-1.5">

                      {/* Service + Type */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{b.service}</p>
                        {bookingTypeBadge(b.type)}
                      </div>

                      {/* Date Time */}
                      <p className="text-xs text-gray-500">
                        📅{" "}
                        {new Date(b.date).toLocaleDateString("en-IN", {
                          day: "numeric", month: "short", year: "numeric",
                        })}{" "}
                        {new Date(b.date).toLocaleTimeString("en-IN", {
                          hour: "2-digit", minute: "2-digit", hour12: true,
                        })}
                      </p>

                      {/* Address */}
                      {b.address && (
                        <p className="text-xs text-gray-500">📍 {b.address}</p>
                      )}

                      {/* Phone */}
                      {b.phone && (
                        <p className="text-xs text-gray-500">📞 {b.phone}</p>
                      )}
                    </div>

                    {/* Status + Price */}
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badgeStyle(b.status)}`}>
                        {b.status}
                      </span>
                      <p className="text-sm font-bold text-gray-800">₹{b.price}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-800">Doctor Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item.path) ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"}`}
            >
              {item.icon}{item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className="text-base font-semibold text-gray-700 hidden md:block">Welcome, {doctorName}</h2>
          </div>
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm"
            >
              {initials}
            </button>
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <User size={15} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{doctorName}</p>
                    <p className="text-xs text-gray-400">Doctor</p>
                  </div>
                </div>
                <button onClick={() => { setProfileOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="p-6 w-full">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Appointments</h1>
            <p className="text-gray-500 text-sm">Manage incoming patient requests</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: "Total requests", value: stats.total,     color: "text-gray-800"   },
              { label: "Pending",        value: stats.pending,   color: "text-yellow-600" },
              { label: "Accepted",       value: stats.accepted,  color: "text-blue-600"   },
              { label: "Completed",      value: stats.completed, color: "text-green-600"  },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 w-full md:w-80 shadow-sm">
              <Search size={16} className="text-gray-400" />
              <input type="text" placeholder="Search patient, service, address..."
                className="outline-none text-sm w-full bg-transparent text-gray-700 placeholder-gray-400"
                value={search} onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "accepted", "completed", "cancelled"].map((f) => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
                    filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Booking Cards */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
              No appointments found
            </div>
          ) : (
            filtered.map((b) => {
              const userBookingsCount = getUserBookings(b.user?._id).length;
              const isNewUser = userBookingsCount <= 1;

              return (
                <div key={b._id} className="bg-white border border-gray-100 rounded-2xl p-5 mb-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4 flex-wrap">

                    {/* Left — Patient Info */}
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-semibold text-sm shrink-0">
                        {getInitials(b.user?.name)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-gray-800 text-base">{b.user?.name}</p>
                          {/* ✅ New / Existing user badge */}
                          {isNewUser ? (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-600">
                              🆕 New Patient
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-600">
                              ✅ Existing Patient
                            </span>
                          )}
                        </div>

                        <p className="text-sm text-gray-500">
                          Address: <span className="text-gray-700 font-medium">{b.address || "N/A"}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Service: <span className="text-gray-700 font-medium">{b.service}</span>
                        </p>
                        <p className="text-sm text-gray-500">
                          Date & Time:{" "}
                          <span className="text-gray-700 font-medium">
                            {new Date(b.date).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })}{" "}
                            {new Date(b.date).toLocaleTimeString("en-IN", {
                              hour: "2-digit", minute: "2-digit", hour12: true,
                            })}
                          </span>
                        </p>

                        {b.type && (
                          <div className="pt-1">{bookingTypeBadge(b.type)}</div>
                        )}

                        {/* ✅ View History Button */}
                        <button
                          onClick={() => !isNewUser && handleViewHistory(b.user?._id, b.user?.name)}
                          disabled={isNewUser}
                          className={`mt-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                            ${isNewUser
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-blue-50 text-blue-600 hover:bg-blue-100 cursor-pointer"
                            }`}
                        >
                          <FaHistory size={10} />
                          {isNewUser ? "No History (New Patient)" : `View History (${userBookingsCount} visits)`}
                        </button>
                      </div>
                    </div>

                    {/* Right — Status + Price + Actions */}
                    <div className="flex flex-col items-end gap-3 shrink-0">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${badgeStyle(b.status)}`}>
                        {b.status}
                      </span>
                      <p className="text-lg font-semibold text-gray-800">₹{b.price}</p>

                      <div className="flex flex-col gap-2">
                        {b.status === "pending" && (
                          <>
                            <button onClick={() => updateStatus(b._id, "accepted")}
                              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                            >Accept</button>
                            
                            <button onClick={() => updateStatus(b._id, "cancelled")}
                              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                            >Reject</button>
                          </>
                        )}

                        {b.status === "accepted" && (
                          <>
                            {b.type?.toLowerCase() === "call" && (
                              <button onClick={() => initiateCall(b.user._id, b.user.name, "audio")}
                                className="px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm transition-all flex items-center gap-1.5 justify-center"
                              >
                                <FaPhone size={11} /> Call Patient
                              </button>
                            )}
                            {b.type?.toLowerCase() === "video" && (
                              <button onClick={() => initiateCall(b.user._id, b.user.name, "video")}
                                className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-all flex items-center gap-1.5 justify-center"
                              >
                                <FaVideo size={11} /> Video Call
                              </button>
                            )}
                            {b.type?.toLowerCase() === "home visit" && (
                              <span className="px-4 py-1.5 bg-orange-100 text-orange-700 rounded-lg text-sm flex items-center gap-1.5 justify-center">
                                <FaHome size={11} /> Home Visit
                              </span>
                            )}
                            <button onClick={() => updateStatus(b._id, "completed")}
                              className="px-4 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm transition-all"
                            >Complete</button>
                            <button onClick={() => updateStatus(b._id, "cancelled")}
                              className="px-4 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm transition-all"
                            >Cancel</button>
                          </>
                        )}

                        {(b.status === "completed" || b.status === "cancelled") && (
                          <span className="text-xs text-gray-400">No actions</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;