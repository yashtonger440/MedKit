import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Users, UserCheck, Calendar, Menu, X,
  LayoutDashboard, LogOut, User,
} from "lucide-react";
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0, totalDoctors: 0, totalBookings: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStats(res.data);
      } catch (err) { console.log(err); }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const fetchBookingStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/booking-stats`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setChartData(
          res.data.map((item) => ({ day: item._id, bookings: item.total }))
        );
      } catch (err) { console.log(err); }
    };
    fetchBookingStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/admin-login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin",          icon: <LayoutDashboard size={18} /> },
    { label: "Doctors",   path: "/admin/doctors",  icon: <UserCheck size={18} /> },
    { label: "Users",     path: "/admin/users",    icon: <Users size={18} /> },
    { label: "Bookings",  path: "/admin/bookings", icon: <Calendar size={18} /> },
  ];

  const isActive = (path) =>
    path === "/admin"
      ? location.pathname === "/admin"
      : location.pathname.startsWith(path);

  const statCards = [
    { title: "Total Users",    value: stats.totalUsers,    icon: <Users size={24} />,     bg: "bg-blue-50",   text: "text-blue-600"   },
    { title: "Total Doctors",  value: stats.totalDoctors,  icon: <UserCheck size={24} />, bg: "bg-green-50",  text: "text-green-600"  },
    { title: "Total Bookings", value: stats.totalBookings, icon: <Calendar size={24} />,  bg: "bg-purple-50", text: "text-purple-600" },
  ];

  const pieData = [
    { name: "Users",   value: stats.totalUsers   },
    { name: "Doctors", value: stats.totalDoctors },
  ];

  const COLORS = ["#3b82f6", "#10b981"];

  const quickActions = [
    { title: "Manage Doctors",  desc: "Approve or reject doctor registrations", path: "/admin/doctors"  },
    { title: "Manage Users",    desc: "View and manage all users",               path: "/admin/users"    },
    { title: "Manage Bookings", desc: "Track and manage appointments",           path: "/admin/bookings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* ── Sidebar ── */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <img src="/images/logo/logo.png" alt="logo" className="h-10 w-auto" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item.path)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main Content ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className="text-base font-semibold text-gray-700 hidden md:block">
              Admin Panel
            </h2>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold text-sm"
            >
              A
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-100 rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                  <User size={15} className="text-gray-400" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Admin</p>
                    <p className="text-xs text-gray-400">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); handleLogout(); }}
                  className="flex items-center gap-2 w-full px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={15} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 w-full">

          {/* Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back, Admin</p>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {statCards.map((item, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                    <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                  </div>
                  <div className={`${item.bg} ${item.text} p-3 rounded-xl`}>
                    {item.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Users vs Doctors</h3>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {pieData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h3 className="text-base font-semibold text-gray-700 mb-4">Weekly Bookings</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="bookings" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions */}
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((item) => (
              <div
                key={item.path}
                onClick={() => navigate(item.path)}
                className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer"
              >
                <h3 className="text-base font-semibold text-gray-800 mb-1">{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>

        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;