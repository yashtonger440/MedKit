import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { LayoutDashboard, LogOut, User, Menu, X, Camera, Save, Plus, XCircle } from "lucide-react";

const SERVICES = [
  "Injection at Home",
  "Blood Test",
  "BP & Sugar Check",
  "General Checkup",
  "Dressing & Wound Care",
  "IV Drip at Home",
  "Physiotherapy",
  "ECG at Home",
];

const TechnicianProfile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [hasChanges, setHasChanges] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    address: "",
    specialization: "",
    profileImage: "",
  });

  const [services, setServices] = useState([]);
  const [customService, setCustomService] = useState("");

  const technicianName = localStorage.getItem("technicianName") || "Technician";
  const initials = technicianName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  const displayInitials = form.name
    ? form.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : initials;

  const getToken = () => localStorage.getItem("technicianToken");

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast({ show: false, msg: "", type: "success" }), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = getToken();
        if (!token) return navigate("/technician-login");
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/technician/profile`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = res.data;
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
          experience: data.experience || "",
          address: data.address || "",
          specialization: data.specialization || "",
          profileImage: data.profileImage || "",
        });
        if (data.specialization) {
          setServices(data.specialization.split(",").map((s) => s.trim()).filter(Boolean));
        }
      } catch (err) {
        showToast("Failed to load profile", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setHasChanges(true);
  };

  const addService = (svc) => {
    if (!svc.trim() || services.includes(svc.trim())) return;
    setServices((prev) => [...prev, svc.trim()]);
    setHasChanges(true);
    setShowServiceDropdown(false);
    setCustomService("");
  };

  const removeService = (svc) => {
    setServices((prev) => prev.filter((s) => s !== svc));
    setHasChanges(true);
  };

  // ✅ Cloudinary pe upload karo — URL form mein save karo
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image 5MB se chhoti honi chahiye", "error");
      return;
    }

    try {
      setUploading(true);
      showToast("Photo upload ho rahi hai...", "success");

      const formData = new FormData();
      formData.append("image", file);

      const token = getToken();
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/technician/profile/upload-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Cloudinary URL form state mein save karo
      setForm((prev) => ({ ...prev, profileImage: res.data.imageUrl }));
      showToast("Photo upload ho gayi!", "success");
      setHasChanges(true);
    } catch (err) {
      showToast("Photo upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.name.trim()) return showToast("Name is required", "error");
    setSaving(true);
    try {
      const token = getToken();
      const payload = {
        ...form,
        specialization: services.join(", "),
        experience: form.experience ? Number(form.experience) : undefined,
      };
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/technician/profile`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("technicianName", res.data.name);
      setHasChanges(false);
      showToast("Profile updated successfully");
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("technicianToken");
    localStorage.removeItem("technicianName");
    navigate("/technician-login");
  };

  const navItems = [
    { label: "Dashboard", path: "/technician-dashboard", icon: <LayoutDashboard size={17} /> },
    { label: "Profile",   path: "/technician-profile",   icon: <User size={17} /> },
  ];
  const isActive = (path) => location.pathname === path;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm flex items-center gap-2 transition-all
          ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-60 bg-white border-r border-gray-200 z-40 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>
        <div className="p-5 border-b border-gray-100">
          <h1 className="text-lg font-bold text-gray-800">Technician Panel</h1>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive(item.path) ? "bg-green-50 text-green-600" : "text-gray-600 hover:bg-gray-50"}`}>
              {item.icon} {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-all">
            <LogOut size={17} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
            <h2 className="text-base font-semibold text-gray-700 hidden md:block">My Profile</h2>
          </div>
          <div className="w-9 h-9 rounded-full bg-green-600 text-white flex items-center justify-center font-semibold text-sm">
            {displayInitials}
          </div>
        </header>

        <main className="p-6 w-full max-w-2xl">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 text-sm mt-1">Update your personal information and services</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Avatar Section */}
            <div className="p-6 flex items-center gap-5 border-b border-gray-100">
              <div className="relative w-20 h-20 shrink-0">
                {form.profileImage ? (
                  <img src={form.profileImage} alt="profile"
                    className="w-20 h-20 rounded-full object-cover" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-semibold">
                    {displayInitials}
                  </div>
                )}
                <label className={`absolute bottom-0 right-0 w-7 h-7 bg-white border border-gray-200 rounded-full flex items-center justify-center cursor-pointer shadow-sm hover:bg-gray-50 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <Camera size={13} className="text-gray-500" />
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploading} />
                </label>
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-lg">{form.name || technicianName}</p>
                <p className="text-sm text-gray-400">Technician</p>
                <label className={`mt-2 inline-flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-100 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-green-100 transition ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}>
                  <Camera size={12} />
                  {uploading ? "Uploading..." : "Change photo"}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploading} />
                </label>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-5">

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Personal information</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Full name <span className="text-red-400">*</span></label>
                    <input type="text" name="name" value={form.name} onChange={handleChange}
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Phone number</label>
                    <input type="text" name="phone" value={form.phone} onChange={handleChange}
                      placeholder="+91 XXXXX XXXXX"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Email address</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="you@example.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1.5">Experience (years)</label>
                    <input type="number" name="experience" value={form.experience} onChange={handleChange}
                      min="0" placeholder="e.g. 3"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition" />
                  </div>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Service area</p>
                <input type="text" name="address" value={form.address} onChange={handleChange}
                  placeholder="e.g. Sector 63, Noida"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 outline-none focus:border-green-400 focus:ring-2 focus:ring-green-50 transition" />
              </div>

              <hr className="border-gray-100" />

              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Services you provide</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {services.map((svc) => (
                    <span key={svc}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                      {svc}
                      <button onClick={() => removeService(svc)} className="hover:text-red-500 transition">
                        <XCircle size={13} />
                      </button>
                    </span>
                  ))}
                  <div className="relative">
                    <button onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-gray-50 text-gray-500 border border-dashed border-gray-300 hover:bg-gray-100 transition">
                      <Plus size={12} /> Add service
                    </button>
                    {showServiceDropdown && (
                      <div className="absolute left-0 top-8 z-10 w-56 bg-white border border-gray-100 rounded-xl shadow-lg p-2">
                        {SERVICES.filter((s) => !services.includes(s)).map((s) => (
                          <button key={s} onClick={() => addService(s)}
                            className="w-full text-left px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-700 transition">
                            {s}
                          </button>
                        ))}
                        <hr className="my-1 border-gray-100" />
                        <div className="flex gap-1 px-1">
                          <input
                            type="text"
                            value={customService}
                            onChange={(e) => setCustomService(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addService(customService)}
                            placeholder="Custom service..."
                            className="flex-1 px-2 py-1.5 text-xs border border-gray-200 rounded-lg outline-none focus:border-green-400"
                          />
                          <button onClick={() => addService(customService)}
                            className="px-2 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition">
                            Add
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <>
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs text-gray-400">Unsaved changes</span>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate("/technician-dashboard")}
                  className="px-4 py-2 rounded-xl text-sm text-gray-600 border border-gray-200 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving || uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2 disabled:opacity-60">
                  <Save size={15} />
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TechnicianProfile;