import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import API from "../services/api.js";
import { useNavigate } from "react-router-dom";
import { FaUser, FaUserMd, FaUserShield } from "react-icons/fa";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null); 

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
        const res = await API.post("/auth/login", {
          email: data.email,
          password: data.password,
          role: selectedRole, // send role
        });

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("Login successful");

        // Role based redirect
        if (selectedRole === "admin") navigate("/admin");
        else if (selectedRole === "doctor") navigate("/doctor");
        else navigate("/");

      } else {
        await API.post("/auth/signup", {
          ...data,
          role: selectedRole,
        });

        alert("Signup successful");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT SIDE */}
      <div className="hidden md:flex w-1/2 bg-linear-to-br from-blue-600 to-cyan-400 text-white flex-col justify-center items-center p-10">
        <h1 className="text-4xl font-bold mb-4">MedKit</h1>
        <p className="text-lg text-center max-w-sm">
          Get healthcare services at your doorstep within 30 minutes.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex w-full md:w-1/2 justify-center items-center bg-gray-100 px-6">

        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md transition-all duration-500">

          {/* STEP 1: ROLE SELECTION */}
          {!selectedRole ? (
            <>
              <h2 className="text-2xl font-bold text-center mb-6">
                Login As
              </h2>

              <div className="grid grid-cols-3 gap-4">

                {/* USER */}
                <div
                  onClick={() => setSelectedRole("user")}
                  className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition text-center"
                >
                  <FaUser className="mx-auto text-2xl text-blue-500 mb-2" />
                  <p className="text-sm font-medium">User</p>
                </div>

                {/* DOCTOR */}
                <div
                 onClick={() => navigate("/doctor-login")}
                  className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition text-center"
                >
                  <FaUserMd className="mx-auto text-2xl text-green-500 mb-2" />
                  <p className="text-sm font-medium">Doctor</p>
                </div>

                {/* ADMIN */}
                <div
                  onClick={() => navigate("/admin-login")}
                  className="cursor-pointer bg-white p-4 rounded-xl shadow hover:shadow-xl hover:scale-105 transition text-center"
                >
                  <FaUserShield className="mx-auto text-2xl text-red-500 mb-2" />
                  <p className="text-sm font-medium">Admin</p>
                </div>

              </div>
            </>
          ) : (
            <>
              {/* BACK BUTTON */}
              <button
                onClick={() => setSelectedRole(null)}
                className="text-sm text-blue-500 mb-3"
              >
                ← Change Role
              </button>

              {/* HEADING */}
              <h2 className="text-2xl font-bold text-center mb-6 capitalize">
                {isLogin ? `Login as ${selectedRole}` : `Signup as ${selectedRole}`}
              </h2>

              {/* FORM */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {!isLogin && (
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                  />
                )}

                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                  required
                />

                {/* PASSWORD */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    className="w-full p-3 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-400 outline-none"
                    required
                  />

                  <span
                    className="absolute right-3 top-3 cursor-pointer text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </span>
                </div>

                {/* BUTTON */}
                <button className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-semibold hover:scale-105 transition">
                  {isLogin ? "Login" : "Signup"}
                </button>

              </form>

              {/* TOGGLE */}
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
            </>
          )}

        </div>
      </div>
    </div>
  );
};

export default Auth;