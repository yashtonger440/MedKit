import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { useState } from "react";

const PHONE_NUMBER = "919818185270";
const WHATSAPP_MESSAGE = "Hi, I need assistance with your healthcare services. Please contact me as soon as possible.";

const FloatingButtons = () => {
  const [callTooltip, setCallTooltip] = useState(false);
  const [waTooltip, setWaTooltip] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:+${PHONE_NUMBER}`;
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(WHATSAPP_MESSAGE);
    window.open(`https://wa.me/${PHONE_NUMBER}?text=${encoded}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-3">

      {/* WhatsApp Button */}
      <div className="relative flex items-center gap-3">
        {/* Tooltip */}
        {waTooltip && (
          <div className="absolute right-16 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            Chat on WhatsApp
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800" />
          </div>
        )}

        <button
          onClick={handleWhatsApp}
          onMouseEnter={() => setWaTooltip(true)}
          onMouseLeave={() => setWaTooltip(false)}
          className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-500/40 hover:scale-110 transition-all duration-200"
        >
          {/* Pulse ring */}
          <span className="absolute w-14 h-14 rounded-full bg-green-400 animate-ping opacity-30" />
          <FaWhatsapp size={26} />
        </button>
      </div>

      {/* Call Button */}
      <div className="relative flex items-center gap-3">
        {/* Tooltip */}
        {callTooltip && (
          <div className="absolute right-16 bg-gray-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
            Call Us Now
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-800" />
          </div>
        )}

        <button
          onClick={handleCall}
          onMouseEnter={() => setCallTooltip(true)}
          onMouseLeave={() => setCallTooltip(false)}
          className="w-14 h-14 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-110 transition-all duration-200"
        >
          {/* Pulse ring */}
          <span className="absolute w-14 h-14 rounded-full bg-blue-400 animate-ping opacity-30" />
          <FaPhoneAlt size={22} />
        </button>
      </div>

    </div>
  );
};

export default FloatingButtons;