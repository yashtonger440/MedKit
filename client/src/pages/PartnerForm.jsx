import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
  FaUser,
  FaPhone,
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PartnerForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "Healthcare Technician",
    city: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  // ✅ Get role from URL (optional pro feature)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role) {
      setForm((prev) => ({ ...prev, role }));
    }
  }, [location.search]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 👉 yaha future me API call laga sakte ho
      console.log(form);

      alert("Application Submitted Successfully ✅");

      setTimeout(() => {
        navigate("/partner-form");
      }, 1000);

    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen mt-6 bg-linear-to-br from-blue-50 to-cyan-100 flex items-center justify-center px-4 py-16">

        <div className="grid md:grid-cols-2 gap-10 max-w-6xl w-full items-center">

          {/* LEFT IMAGE */}
          <div className="hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1518135714426-c18f5ffb6f4d"
              alt="Healthcare Partner"
              className="rounded-3xl shadow-2xl h-125 w-full object-cover"
            />
          </div>

          {/* FORM CARD */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8">

            <h1 className="text-3xl font-bold text-gray-800 text-center">
              Become a Partner 🤝
            </h1>

            <p className="text-center text-gray-500 mt-2">
              Join MedKit & grow your career with us
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* NAME */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  required
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                />
              </div>

              {/* PHONE */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
                <FaPhone className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  required
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                />
              </div>

              {/* ROLE */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl">
                <FaBriefcase className="text-gray-400 mr-2" />
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                >
                  <option>Healthcare Technician</option>
                  <option>Doctor Partner</option>
                  <option>Ambulance Partner</option>
                </select>
              </div>

              {/* CITY */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="city"
                  placeholder="Your City"
                  required
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                />
              </div>

              {/* EXPERIENCE */}
              <textarea
                name="experience"
                placeholder="Experience / Details (optional)"
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-105 transition"
              >
                {loading ? "Submitting..." : "Submit Application 🚀"}
              </button>

            </form>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}