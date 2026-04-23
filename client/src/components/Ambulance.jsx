import { FaPhoneAlt, FaWhatsapp, FaAmbulance } from "react-icons/fa";

export default function Ambulance() {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 via-red-500 to-pink-500 text-white relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-0 left-0"></div>
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl bottom-0 right-0"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT IMAGE */}
        <div className="flex justify-center relative">
          
          {/* Glow Circle */}
          <div className="absolute w-80 h-80 bg-white/20 backdrop-blur-lg rounded-full"></div>

          <img
            src="https://images.unsplash.com/photo-1619025873875-59dfdd2bbbd6"
            alt="Ambulance Service"
            className="relative z-10 w-[350px] md:w-[400px] rounded-2xl shadow-2xl"
          />
        </div>

        {/* RIGHT CONTENT */}
        <div>
          
          <h2 className="text-4xl font-bold leading-tight">
            Ambulance Service <br />
            <span className="text-yellow-300">We're Minutes Away</span>
          </h2>

          <p className="mt-5 text-white/90">
            Fast, reliable ambulance dispatch for emergencies and hospital transfers in Haldwani & Kathgodam. Every second counts — and we don't waste them.
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3">
            <li>✔ Fastest response — under 15 minutes</li>
            <li>✔ GPS-tracked fleet across all areas</li>
            <li>✔ Equipped with oxygen & first-aid</li>
            <li>✔ Accident, cardiac & emergency support</li>
          </ul>

          {/* Price */}
          <p className="mt-6 font-semibold text-lg">
            Starting at ₹999 • No hidden charges
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            
            <a
              href="tel:9818185270"
              className="flex items-center gap-2 bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition animate-pulse"
            >
              <FaPhoneAlt /> Call Ambulance
            </a>

            <a
              href="https://wa.me/919818185270"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              <FaWhatsapp /> WhatsApp SOS
            </a>

          </div>

        </div>

      </div>
    </section>
  );
}