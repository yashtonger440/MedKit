import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  const handleSelect = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    setOpen(false);
  };

  useEffect(() => {
    const closeDropdown = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-sm font-medium text-gray-700"
      >
        <span className="text-base">{currentLang.flag}</span>
        {currentLang.label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-white/90 backdrop-blur-xl shadow-2xl rounded-2xl border border-white/40 z-50 overflow-hidden animate-dropdown">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang.code)}
                className={`flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm transition hover:bg-blue-50 ${
                  currentLang.code === lang.code
                    ? "text-blue-600 font-semibold"
                    : "text-gray-700"
                }`}
              >
                <span className="text-base">{lang.flag}</span>
                {lang.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;