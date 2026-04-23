import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [openProfile, setOpenProfile] = useState(false);

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

  const menuItems = ["Home", "Services", "Booking", "Partners"];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <nav
      className={`h-[70px] fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/40 backdrop-blur-xl shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <h1
            className={`text-2xl font-bold transition text-gray-800`}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
              Med
            </span>
            Kit
          </h1>
        </Link>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex gap-12 pl-120 font-medium transition text-gray-800`}
        >
          {menuItems.map((item, i) => (
            <li key={i}>
              <Link
                to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                className="relative group"
              >
                {item}
                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Emergency Tag */}
          <span
            className={`hidden md:block text-xs px-3 py-1 rounded-full font-medium ${
              scrolled
                ? "bg-red-100 text-red-500"
                : "bg-white/20 text-red-500 backdrop-blur"
            }`}
          >
            24/7 Emergency
          </span>

          {/* 🔥 USER OR LOGIN */}
          {user ? (
            <div className="relative hidden md:block">
              {/* Profile Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenProfile(!openProfile);
                }}
                className="px-4 py-2 rounded-full bg-gray-200 font-medium hover:bg-gray-300"
              >
                {user.name}
              </button>

              {/* Dropdown */}
              {openProfile && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>

                  <Link
                    to="/bookinghistory"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Booking History
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className={`hidden md:block px-5 py-2 rounded-full font-medium transition-all duration-300 ${
                scrolled
                  ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white shadow hover:scale-105"
                  : "bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-blue-600"
              }`}
            >
              Login
            </Link>
          )}

          {/* Hamburger Icon */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? (
              <X className={scrolled ? "text-black" : "text-white"} />
            ) : (
              <Menu className={scrolled ? "text-black" : "text-white"} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/90 backdrop-blur-xl px-6 py-4 space-y-4 shadow-lg">
          {menuItems.map((item, i) => (
            <Link
              key={i}
              to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="block text-gray-800 font-medium"
            >
              {item}
            </Link>
          ))}

          {/* Mobile User/Login */}
          {user ? (
            <>
              <div className="text-center font-medium">{user.name}</div>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="block text-center bg-gray-200 py-2 rounded-full"
              >
                Profile
              </Link>

              <button
                onClick={handleLogout}
                className="block w-full text-center bg-red-500 text-white py-2 rounded-full"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="block text-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
