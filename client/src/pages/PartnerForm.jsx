import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useTranslation } from "react-i18next";
import {
  FaUser,
  FaPhoneAlt,
  FaBriefcase,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function PartnerForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    role: "Healthcare Technician",
    city: "",
    experience: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get("role");
    if (role) {
      setForm((prev) => ({ ...prev, role }));
    }
  }, [location.service]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      setLoading(true);

      // yaha future me API call lagega to submit the form data
      console.log(form);

      alert(t("partnerForm.submitSuccess"));

      setTimeout(() => {
        navigate("/partner-form");
      }, 1000);

    } catch (err) {
      alert(t("partnerForm.submitError"));
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
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 mt-10">

            <h1 className="text-3xl font-bold text-gray-800 text-center">
              {t("partnerForm.heading")}
            </h1>

            <p className="text-center text-gray-500 mt-2">
              {t("partnerForm.subheading")}
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">

              {/* NAME */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
                <FaUser className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="name"
                  placeholder={t("partnerForm.fullName")}
                  required
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                />
              </div>

              {/* PHONE */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl focus-within:ring-2 focus-within:ring-blue-400">
                <FaPhoneAlt className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="phone"
                  placeholder={t("partnerForm.phoneNumber")}
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
                  <option value="Healthcare Technician">{t("partnerForm.roleTechnician")}</option>
                  <option value="Doctor Partner">{t("partnerForm.roleDoctor")}</option>
                  <option value="Ambulance Partner">{t("partnerForm.roleAmbulance")}</option>
                </select>
              </div>

              {/* CITY */}
              <div className="flex items-center bg-gray-100 p-3 rounded-xl">
                <FaMapMarkerAlt className="text-gray-400 mr-2" />
                <input
                  type="text"
                  name="city"
                  placeholder={t("partnerForm.yourCity")}
                  required
                  onChange={handleChange}
                  className="bg-transparent w-full outline-none"
                />
              </div>

              {/* EXPERIENCE */}
              <textarea
                name="experience"
                placeholder={t("partnerForm.experiencePlaceholder")}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-100 outline-none focus:ring-2 focus:ring-blue-400"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-105 transition"
              >
                {loading ? t("partnerForm.submitting") : t("partnerForm.submitApplication")}
              </button>

            </form>

          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}