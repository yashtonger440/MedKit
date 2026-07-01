import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { FaCompass } from "react-icons/fa";
import CareNavigator from "./CareNavigator";

import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);
  const [openNavigator, setOpenNavigator] = useState(false);
  const { t } = useTranslation();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const closeDropdown = () => setOpenProfile(false);

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", closeDropdown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", closeDropdown);
    };
  }, []);

  const menuItems = [
    { key: "nav.home", path: "/" },
    { key: "nav.services", path: "/services" },
    { key: "nav.booking", path: "/booking" },
    { key: "nav.partners", path: "/partners" },
    { key: "nav.ambulance", path: "/ambulance" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <>
      <nav
        className={`h-18.75 fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/50 backdrop-blur-xl shadow-lg`}
      >
        <div className="max-w-7xl mx-auto px-4 py-1 flex justify-between items-center">
          {/* Logo */}
          <Link to="/">
            <img
              className="w-38 h-18"
              src="/images/logo/logo.png"
              alt="logo"
            />
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex gap-10 font-medium text-gray-800">
            {menuItems.map((item, i) => (
              <li key={i}>
                <Link to={item.path} className="relative group">
                  {t(item.key)}
                  <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setOpenNavigator(true)}
              className="hidden md:flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-semibold text-sm px-5 py-2.5 rounded-full shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <FaCompass size={15} />
              {t("nav.findmyservice")}
            </button>

            {user ? (
              <div className="relative hidden md:block">
                {/* Profile Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenProfile(!openProfile);
                  }}
                  className="px-4 py-2 rounded-full bg-gray-200 font-medium hover:bg-gray-300 transition"
                >
                  {user.name}
                </button>

                {/* Dropdown */}
                {openProfile && (
                  <div className="absolute right-0 mt-2 w-40 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/40 z-50 overflow-hidden animate-dropdown">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                      >
                        👤 Profile
                      </Link>

                      <Link
                        to="/bookinghistory"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 transition"
                      >
                        📅 Booking History
                      </Link>

                      <div className="my-2 border-t border-gray-200/50"></div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition"
                      >
                        🚪 Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden md:block px-5 py-2 rounded-full font-medium transition-all duration-300 bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow hover:scale-105"
              >
                {t("nav.login")}
              </Link>
            )}

            {/* Hamburger */}
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              {open ? (
                <X className="text-black" />
              ) : (
                <Menu className="text-black" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            open ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white/90 backdrop-blur-xl px-6 py-4 space-y-4 shadow-lg">
            {/* Find My Service */}
            <button
              onClick={() => {
                setOpen(false);
                setOpenNavigator(true);
              }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-full font-semibold shadow"
            >
              <FaCompass size={16} />
              {t("nav.findmyservice")}
            </button>

            {menuItems.map((item, i) => (
              <Link
                key={i}
                to={item.path}
                onClick={() => setOpen(false)}
                className="block text-gray-800 font-medium"
              >
                {t(item.key)}
              </Link>
            ))}

            {user ? (
              <>
                <div className="text-center font-medium">{user.name}</div>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-gray-200 py-2 rounded-full"
                >
                  {t("nav.profile")}
                </Link>

                <Link
                  to="/bookinghistory"
                  onClick={() => setOpen(false)}
                  className="block text-center bg-gray-200 py-2 rounded-full"
                >
                  {t("nav.bookingHistory")}
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full text-center bg-red-500 text-white py-2 rounded-full"
                >
                  {t("nav.logout")}
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block text-center bg-linear-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-full"
              >
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Replace this with your actual Navigator component */}
      <CareNavigator
        open={openNavigator}
        onClose={() => setOpenNavigator(false)}
      />
    </>
  );
}