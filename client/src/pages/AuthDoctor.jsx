import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AuthDoctor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

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

  // Handle text input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file input
  const handleFileChange = (e) => {
    if (e.target.name === "profileImage") {
      setProfileImage(e.target.files[0]);
    } else if (e.target.name === "certificate") {
      setCertificate(e.target.files[0]);
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/doctor-login",
          {
            email: formData.email,
            password: formData.password,
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.user.role);

        alert("Login successful");
        navigate("/doctor-dashboard");
      } else {
        // ✅ File validation
        if (!profileImage || !certificate) {
          alert("Please upload all required files");
          setLoading(false);
          return;
        }

        // Create FormData for file upload
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("password", formData.password);
        data.append("specialization", formData.specialization);
        data.append("experience", formData.experience);
        data.append("profileImage", profileImage);
        data.append("certificate", certificate);

        await axios.post(
          "http://localhost:5000/api/auth/doctor-signup",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        alert("Signup successful. Wait for admin approval.");

        // Reset form
        setFormData({
          name: "",
          email: "",
          password: "",
          specialization: "",
          experience: "",
        });
        setProfileImage(null);
        setCertificate(null);

        setIsLogin(true);
      }
    } catch (err) {
      console.log(err);
      alert(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? "Doctor Login" : "Doctor Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
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

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
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
              className="w-full p-3 border rounded-lg"
            />
            <span
              className="absolute right-3 top-3 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          {/* Extra fields */}
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

              {/* Profile Image Upload */}
              <div>
                <label className="text-sm font-medium">
                  Upload Profile Image
                </label>
                <input
                  type="file"
                  name="profileImage"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                />
              </div>

              {/* Certificate Upload */}
              <div>
                <label className="text-sm font-medium">
                  Upload Medical Certificate (Proof)
                </label>
                <input
                  type="file"
                  name="certificate"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full mt-1"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading
              ? "Processing..."
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