import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await API.post(
          "http://localhost:5000/api/auth/login",
          {
            email: data.email,
            password: data.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        alert("Login successful");
        navigate("/");
      } else {
        await API.post(
          "http://localhost:5000/api/auth/signup",
          data
        );

        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred" );
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-blue-600 to-cyan-400 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">MedKit</h1>
        <p className="text-lg text-center max-w-sm">
          Get healthcare services at your doorstep within 30 minutes.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 px-6">

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500">

          {/* Heading */}
          <h2 className="text-2xl font-bold text-center mb-6">
            {isLogin ? "Login" : "Create Account"}
          </h2>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
              />
            )}

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
              required
            />

            {/* Password Field */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                required
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
              className={`w-full py-3 rounded-lg text-white font-semibold transition ${
                isLogin
                  ? "bg-blue-500 hover:bg-blue-600"
                  : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLogin ? "Login" : "Signup"}
            </button>

          </form>

          {/* Toggle */}
          <p className="text-center mt-5 text-sm">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-500 cursor-pointer ml-1 font-medium"
            >
              {isLogin ? "Signup" : "Login"}
            </span>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Auth;