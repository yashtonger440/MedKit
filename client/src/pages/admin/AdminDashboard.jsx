import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Users,
  UserCheck,
  Calendar,
  Menu,
  X,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

 const[stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalBookings: 0,
 });

 useEffect(() => {
    const fetchStats = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get(
                "http://localhost:5000/api/admin/stats",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setStats(res.data)
        } catch (err) {
            console.log(err);
        }
    }

    fetchStats();
 }, []);

const statsData = [
  { title: "Total Users", value: stats.totalUsers, icon: <Users size={28} /> },
  { title: "Total Doctors", value: stats.totalDoctors, icon: <UserCheck size={28} /> },
  { title: "Total Bookings", value: stats.totalBookings, icon: <Calendar size={28} /> },
];

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    alert("Logged out successfully");
    navigate("/admin-login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div
        className={`fixed md:static z-50 top-0 left-0 h-full w-64 bg-white shadow-lg transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition duration-300`}
      >
        <div className="p-6 font-bold text-xl border-b">
          Admin Panel
        </div>

        <nav className="p-4 space-y-4">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-blue-100 text-blue-600">
            <LayoutDashboard size={20} />
            Dashboard
          </div>

          <div
            onClick={() => navigate("/admin/doctors")}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <UserCheck size={20} />
            Doctors
          </div>

          <div
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <Users size={20} />
            Users
          </div>

          <div
            onClick={() => navigate("/admin/bookings")}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <Calendar size={20} />
            Bookings
          </div>
        </nav>
      </div>

      {/* 🔘 Overlay (Mobile) */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
        />
      )}

      {/* 🟢 Main Content */}
      <div className="flex-1 flex flex-col">

        {/* 🔝 Navbar */}
        <div className="flex items-center justify-between bg-white px-6 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="md:hidden">
              {open ? <X /> : <Menu />}
            </button>
            <h1 className="text-xl font-semibold">Dashboard</h1>
          </div>

          {/* 🔥 Profile Section */}
          <div className="relative">
            {/* Profile Icon */}
            <div
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center cursor-pointer"
            >
              A
            </div>

            {/* Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl overflow-hidden z-50 animate-fadeIn">

                <div className="flex items-center gap-2 px-4 py-3 border-b">
                  <User size={16} />
                  <span className="text-sm font-medium">Admin</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-3 text-left hover:bg-red-50 text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>

              </div>
            )}
          </div>
        </div>

        {/* 📊 Content */}
        <div className="p-6">

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {statsData.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500 text-sm">
                      {item.title}
                    </p>
                    <h2 className="text-2xl font-bold">
                      {item.value}
                    </h2>
                  </div>
                  <div className="text-blue-600">
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <h2 className="text-xl font-semibold mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            <div
              onClick={() => navigate("/admin/doctors")}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2">
                Manage Doctors
              </h3>
              <p className="text-gray-500">
                Approve or reject doctor registrations
              </p>
            </div>

            <div
              onClick={() => navigate("/admin/users")}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2">
                Manage Users
              </h3>
              <p className="text-gray-500">
                View and manage all users
              </p>
            </div>

            <div
              onClick={() => navigate("/admin/bookings")}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition cursor-pointer"
            >
              <h3 className="text-lg font-semibold mb-2">
                Manage Bookings
              </h3>
              <p className="text-gray-500">
                Track and manage appointments
              </p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;