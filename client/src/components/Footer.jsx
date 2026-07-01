import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b2c3a] text-white pt-16 pb-6 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* LOGO + ABOUT */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FaHeart className="text-cyan-400" />
            MedKit
          </h2>

          <p className="mt-4 text-gray-300 text-sm leading-relaxed">
            {t("footer.about")}
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer.quickLinks")}</h3>

          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <Link to="/" className="hover:text-white cursor-pointer">{t("footer.home")}</Link>
            <Link to="/services" className="hover:text-white cursor-pointer">{t("footer.services")}</Link>
            <Link to="/bookadoctor" className="hover:text-white cursor-pointer">{t("footer.bookADoctor")}</Link>
            <Link to="/partners" className="hover:text-white cursor-pointer">{t("footer.partnerWithUs")}</Link>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer.servicesHeading")}</h3>

          <ul className="space-y-2 text-gray-300 text-sm">
            <li>{t("footer.service1")}</li>
            <li>{t("footer.service2")}</li>
            <li>{t("footer.service3")}</li>
            <li>{t("footer.service4")}</li>
            <li>{t("footer.service5")}</li>
            <li>{t("footer.service6")}</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-4">{t("footer.contactHeading")}</h3>

          <ul className="space-y-3 text-gray-300 text-sm">
            <li className="flex items-center gap-2">
              <FaPhoneAlt className="text-red-400" />
              +91 9818185270
            </li>

            <li className="flex items-center gap-2">
              <FaEnvelope className="text-gray-400" />
              hello@medkit.in
            </li>

            <li className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-red-400" />
              {t("footer.address")}
            </li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-600 mt-12 pt-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400">

        <p>{t("footer.copyright")}</p>
      </div>

    </footer>
  );
}