import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { FaUserMd, FaAmbulance, FaUserNurse } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Partners() {
  const { t } = useTranslation();

  const benefitKeys = ["benefit1", "benefit2", "benefit3", "benefit4", "benefit5", "benefit6"];

  return (
    <>
      <Navbar />

      <div className="bg-linear-to-br from-blue-50 to-cyan-100 min-h-screen">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-10 items-center">

          {/* TEXT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
              {t("partnersPage.heroHeading")}
            </h1>

            <p className="mt-4 text-gray-600 text-lg">
              {t("partnersPage.heroSubheading")}
            </p>

            <ul className="mt-6 space-y-3 text-gray-600">
              <li>✔ {t("partnersPage.perk1")}</li>
              <li>✔ {t("partnersPage.perk2")}</li>
              <li>✔ {t("partnersPage.perk3")}</li>
              <li>✔ {t("partnersPage.perk4")}</li>
            </ul>

            {/* UPDATED BUTTON */}
            <Link
              to="/partnerform"
              className="inline-block mt-6 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold hover:scale-105 transition"
            >
              {t("partnersPage.becomePartner")}
            </Link>
          </div>

          {/* IMAGE */}
          <div>
            <img
              src="https://plus.unsplash.com/premium_photo-1661699717204-82c08926c77a?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Healthcare team"
              className="rounded-3xl shadow-xl w-full h-87.5 object-cover"
            />
          </div>

        </section>

        {/* PARTNER TYPES */}
        <section className="max-w-7xl mx-auto px-6 py-10">

          <h2 className="text-3xl font-bold text-center text-gray-800">
            {t("partnersPage.opportunitiesHeading")}
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-8">

            {/* DOCTOR */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition">
              <FaUserMd className="text-3xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold">{t("partnersPage.doctorPartner.title")}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {t("partnersPage.doctorPartner.desc")}
              </p>
              <img
                src="https://images.unsplash.com/photo-1758691461990-03b49d969495"
                className="mt-4 rounded-xl h-40 w-full object-cover"
              />
            </div>

            {/* TECHNICIAN */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition">
              <FaUserNurse className="text-3xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold">{t("partnersPage.technicianPartner.title")}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {t("partnersPage.technicianPartner.desc")}
              </p>
              <img
                src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b"
                className="mt-4 rounded-xl h-40 w-full object-cover"
              />

            </div>

            {/* AMBULANCE */}
            <div className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition">
              <FaAmbulance className="text-3xl text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold">{t("partnersPage.ambulancePartner.title")}</h3>
              <p className="text-gray-600 text-sm mt-2">
                {t("partnersPage.ambulancePartner.desc")}
              </p>
              <img
                src="/images/ambulance.jpg"
                className="mt-4 rounded-xl h-40 w-full object-cover"
              />

            </div>

          </div>

        </section>

        {/* CTA SECTION (REPLACES FORM) */}
        <section className=" bg-white py-20 text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            {t("partnersPage.ctaHeading")}
          </h2>

          <p className="text-gray-600 mt-3">
            {t("partnersPage.ctaSubheading")}
          </p>

          <Link
            to="/partnerform"
            className="mt-6 inline-block px-8 py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-full font-semibold hover:scale-105 transition"
          >
            {t("partnersPage.applyNow")}
          </Link>

        </section>

        {/* BENEFITS */}
        <section className="py-16 px-6">

          <div className="max-w-6xl mx-auto text-center">

            <h2 className="text-3xl font-bold text-gray-800">
              {t("partnersPage.whyJoinHeading")}
            </h2>

            <div className="mt-10 grid md:grid-cols-3 gap-6">

              {benefitKeys.map((key, i) => (
                <div
                  key={i}
                  className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition"
                >
                  <p className="font-medium text-gray-700">✔ {t(`partnersPage.${key}`)}</p>
                </div>
              ))}

            </div>

          </div>

        </section>

      </div>

      <Footer />
    </>
  );
}