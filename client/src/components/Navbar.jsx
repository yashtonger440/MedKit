import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menuItems = ["Home", "Services", "Booking", "Partners"];

  return (
    <nav
      className={`h-[70px] fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-xl shadow-lg border-b border-gray-200/50"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        
        {/* Logo */}
        <h1
          className={`text-2xl font-bold transition ${
            scrolled ? "text-gray-800" : "text-white"
          }`}
        >
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-700 to-blue-900">
            Med
          </span>
          Kit
        </h1>

        {/* Desktop Menu */}
        <ul
          className={`hidden md:flex gap-8 font-medium transition ${
            scrolled ? "text-gray-700" : "text-white/85"
          }`}
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

          {/* Login Button */}
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

          {/* Hamburger Icon */}
          <button
            className="md:hidden"
            onClick={() => setOpen(!open)}
          >
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

          {/* Mobile Login */}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            className="block text-center bg-gradient-to-r from-blue-500 to-cyan-400 text-white py-2 rounded-full"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}