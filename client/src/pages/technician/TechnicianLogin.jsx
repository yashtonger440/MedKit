import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TechnicianLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    experience: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setError("");
    if (e.target.name === "profileImage") setProfileImage(e.target.files[0]);
    else if (e.target.name === "certificate") setCertificate(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      if (isLogin) {
        // Login
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/technician-login`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("technicianName", res.data.user.name);

        navigate("/technician-dashboard");

      } else {
        // Signup
        if (!profileImage || !certificate) {
          setError("Please upload all required files");
          setLoading(false);
          return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("experience", formData.experience);
        data.append("role", "technician");
        data.append("profileImage", profileImage);
        data.append("certificate", certificate);

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/technician-signup`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setError("Signup successful. Wait for admin approval.");
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-50 px-4 relative">

      {/* Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 bg-white px-4 py-2 rounded-lg shadow text-sm hover:bg-gray-50 transition"
      >
        ← Back
      </button>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-3 text-sm text-gray-600">
              {isLogin ? "Logging in..." : "Creating account..."}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Technician Login" : "Technician Signup"}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {isLogin ? "Welcome back!" : "Join MedKit as a Technician"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Signup fields */}
          {!isLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 text-sm"
              />
            </>
          )}

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 text-sm"
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
              className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-purple-400 text-sm"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer text-gray-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* File uploads — signup only */}
          {!isLogin && (
            <>
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Profile Image *
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1 block">
                  Certificate *
                </label>
                <input
                  type="file"
                  name="certificate"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </div>

              {/* Services info */}
              <div className="bg-purple-50 p-3 rounded-xl">
                <p className="text-xs font-semibold text-purple-700 mb-2">Services you'll handle:</p>
                <div className="flex gap-2 flex-wrap">
                  {["Injection at Home", "Dressing", "Nursing Care"].map(svc => (
                    <span key={svc} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                      {svc}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Error Message */}
          {error && (
            <p className={`text-sm font-medium text-center ${
              error.includes("successful") ? "text-green-500" : "text-red-500"
            }`}>
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Signup"}
          </button>
        </form>

        {/* Toggle */}
        <p className="text-center mt-4 text-sm text-gray-500">
          {isLogin ? "New technician?" : "Already have an account?"}{" "}
          <span
            className="text-purple-600 cursor-pointer font-medium hover:underline"
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
          >
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default TechnicianLogin;