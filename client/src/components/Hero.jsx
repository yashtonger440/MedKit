import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-r from-blue-400 via-cyan-500 to-blue-600 overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute w-72 h-72 bg-white/20 rounded-full blur-3xl top-10 left-10"></div>
      <div className="absolute w-96 h-96 bg-blue-300/20 rounded-full blur-3xl bottom-10 right-10"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div className="text-white">
          
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Get Healthcare Services <br />
            <span className="text-yellow-300">Within 30 Minutes</span>
          </h1>

          <p className="mt-6 text-lg text-white/90">
            Book trusted doctors, nurses, and emergency services near you instantly.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex gap-4 flex-wrap">
            <Link
              to="/booking"
              className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition"
            >
              Book Now
            </Link>

            <Link
              to="/services"
              className="border border-white px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition"
            >
              Explore Services
            </Link>
          </div>

          <div className="mt-10 flex gap-6 text-sm">
            <span>✔ 5000+ Users</span>
            <span>✔ 100+ Doctors</span>
            <span>✔ 24/7 Service</span>
          </div>
        </div>

        {/* IMAGE */}
        <div className="flex justify-center relative">
          
          {/* Glass Circle */}
          <div className="absolute w-80 h-80 bg-white/20 backdrop-blur-lg rounded-full"></div>

          <img
            src="https://plus.unsplash.com/premium_photo-1681843126728-04eab730febe"
            alt="doctor"
            className="relative z-10 w-[350px] md:w-[420px] rounded-2xl shadow-2xl animate-float"
          />
        </div>

      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
    </section>
  );
}