import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthAdmin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Handle Input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        // "http://localhost:5000/api/auth/login",
        formData
      );

      const user = res.data.user;

      // 🔐 Check Role
      if (user.role !== "admin") {
        alert("Access denied. Not an admin.");
        return;
      }

      // Save token & role
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", user.role);

      alert("Admin login successful");
      navigate("/admin");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-300 px-4">
      
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

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition transform hover:scale-105"
          >
            Login as Admin
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