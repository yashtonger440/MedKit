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
      className={`h-18.75 fixed top-0 left-0 w-full z-50 transition-all duration-300 bg-white/40 backdrop-blur-xl shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-between items-center">
        <Link to="/">
          <img className="w-35 h-15" src="/images/logo/logo.png" alt="logo" />
        </Link>

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
                <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-linear-to-r from-cyan-400 to-blue-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          <span
            className={`hidden md:block text-xs px-3 py-1 rounded-full font-medium ${
              scrolled
                ? "bg-red-100 text-red-500"
                : "bg-white/20 text-red-500 backdrop-blur"
            }`}
          >
            24/7 Emergency
          </span>

          {/*LOGIN */}
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
                <div className="absolute right-0 mt-2 w-39 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/40 z-50 overflow-hidden animate-dropdown">
                  {/* MENU ITEMS */}
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

                    {/* Divider */}
                    <div className="my-2 border-t border-gray-200/50"></div>

                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full text-left px-4 text-sm text-red-500 hover:bg-red-50 transition"
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
              className={`hidden md:block px-5 py-2 rounded-full font-medium transition-all duration-300 bg-linear-to-r from-blue-500 to-cyan-400 text-white shadow hover:scale-105`}
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
          open ? "max-h-100 opacity-100" : "max-h-0 opacity-0"
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
              className="block text-center bg-linear-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-full"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
