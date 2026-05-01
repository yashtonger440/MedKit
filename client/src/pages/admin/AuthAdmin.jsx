import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // 🔥 error state

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle Input
  const handleChange = (e) => {
    setError(""); // clear error while typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // clear old errors

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        formData
      );

      const user = res.data.user;

      // Check Role
      if (user.role !== "admin") {
        setError("Access denied. Not an admin.");
        setLoading(false);
        return;
      }

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", user.role);

      navigate("/admin");
    } catch (err) {
      // 🔥 show backend message or fallback
      setError(
        err.response?.data?.message || "Email or password is incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-300 px-4 relative">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 bg-white px-4 py-2 rounded-lg shadow hover:bg-gray-100"
      >
        ← Back
      </button>

      {/* 🔥 Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-700 font-medium">Logging in...</p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">

        {/* Title */}
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Admin Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* Password */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* 🔥 Error Message */}
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? "Please wait..." : "Login as Admin"}
          </button>
        </form>

        {/* Info */}
        <p className="text-center text-sm text-gray-500 mt-4">
          Only authorized admins can access this panel.
        </p>
      </div>
    </div>
  );
};

export default AuthAdmin;