import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthDoctor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // 🔥 error state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    experience: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [certificate, setCertificate] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setError(""); // clear error on typing
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setError("");
    if (e.target.name === "profileImage") {
      setProfileImage(e.target.files[0]);
    } else if (e.target.name === "certificate") {
      setCertificate(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/doctor-login`,
          // "http://localhost:5000/api/auth/doctor-login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);
        localStorage.setItem("doctorName", res.data.user.name);

        navigate("/doctor-dashboard");
      } else {
        if (!profileImage || !certificate) {
          setError("Please upload all required files");
          setLoading(false);
          return;
        }

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("specialization", formData.specialization);
        data.append("experience", formData.experience);
        data.append("profileImage", profileImage);
        data.append("certificate", certificate);

        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/doctor-signup`,
          // "http://localhost:5000/api/auth/doctor-signup",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        setError("Signup successful. Wait for admin approval."); // success message
        setIsLogin(true);
      }
    } catch (err) {
      // backend message OR fallback
      setError(
        err.response?.data?.message || "Email or password is incorrect"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4 relative">

      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate("/login")}
        className="absolute top-6 left-6 bg-white px-4 py-2 rounded-lg shadow"
      >
        ← Back
      </button>

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl flex flex-col items-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3">
              {isLogin ? "Logging in..." : "Creating account..."}
            </p>
          </div>
        </div>
      )}

      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Doctor Login" : "Doctor Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border rounded-lg"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <p className="text-sm text-red-500 font-medium text-center">
              {error}
            </p>
          )}

          {!isLogin && (
            <>
              <input
                type="text"
                name="specialization"
                placeholder="Specialization"
                required
                value={formData.specialization}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="number"
                name="experience"
                placeholder="Experience (years)"
                required
                value={formData.experience}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg"
              />

              <input
                type="file"
                name="profileImage"
                accept="image/*"
                onChange={handleFileChange}
              />

              <input
                type="file"
                name="certificate"
                accept=".pdf,image/*"
                onChange={handleFileChange}
              />
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
          >
            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Signup"}
          </button>
        </form>

        <p className="text-center mt-4">
          {isLogin ? "New doctor?" : "Already have an account?"}{" "}
          <span
            className="text-blue-600 cursor-pointer font-medium"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthDoctor;