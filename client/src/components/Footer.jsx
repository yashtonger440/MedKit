import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
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
            Your trusted healthcare-at-home partner in Haldwani & Kathgodam.
            Quality medical care delivered to your doorstep.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="font-semibold mb-4">QUICK LINKS</h3>

          <div className="flex flex-col gap-2 text-gray-300 text-sm">
            <Link to="/" className="hover:text-white cursor-pointer">Home</Link>
            <Link to="/services" className="hover:text-white cursor-pointer">Services</Link>
            <Link to="/bookadoctor" className="hover:text-white cursor-pointer">Book a doctor</Link>
            <Link to="/partners" className="hover:text-white cursor-pointer">Partner With Us</Link>
          </div>
        </div>

        {/* SERVICES */}
        <div>
          <h3 className="font-semibold mb-4">SERVICES</h3>

          <ul className="space-y-2 text-gray-300 text-sm">
            <li>Injection at Home</li>
            <li>IV Drip</li>
            <li>ECG Test</li>
            <li>Nurse Visit</li>
            <li>Doctor Consultation</li>
            <li>Ambulance Service</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="font-semibold mb-4">CONTACT</h3>

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
              xyz
            </li>
          </ul>
        </div>

      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-600 mt-12 pt-6 flex flex-col md:flex-row justify-center items-center text-sm text-gray-400">

        <p>© 2026 MedKit. All rights reserved.</p>
      </div>

    </footer>
  );
}