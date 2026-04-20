import { FaPhoneAlt, FaWhatsapp, FaUserMd } from "react-icons/fa";

export default function DoctorCall() {
  return (
    <section className="py-20 bg-gradient-to-b from-blue-50 to-white">
      
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          <h2 className="text-4xl font-bold text-gray-800">
            Consult a Doctor from Home
          </h2>

          <p className="mt-4 text-gray-600">
            Skip the clinic queues. Talk to verified, experienced doctors via audio or video call — anytime, from the comfort of your home.
          </p>

          {/* Features */}
          <ul className="mt-6 space-y-3 text-gray-700">
            <li>✔ Audio & Video consultations available</li>
            <li>✔ Available 8 AM – 10 PM, 7 days a week</li>
            <li>✔ MBBS / MD verified doctors only</li>
            <li>✔ Digital prescription after consultation</li>
          </ul>

          {/* Price */}
          <p className="mt-6 text-lg font-semibold text-blue-600">
            Starting at ₹499 per consultation
          </p>

          {/* Buttons */}
          <div className="mt-6 flex gap-4 flex-wrap">
            
            <a
              href="https://wa.me/919818185270"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-full hover:scale-105 transition"
            >
              <FaWhatsapp /> Book Doctor on Whatsapp
            </a>

            <a
              href="tel:9818185270"
              className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full hover:scale-105 transition"
            >
              <FaPhoneAlt /> Call Now
            </a>

          </div>
        </div>

        {/* RIGHT IMAGE + CARD */}
        <div className="relative flex justify-center">
          
          {/* Glow Background */}
          <div className="absolute w-80 h-80 bg-blue-200/40 blur-3xl rounded-full"></div>

          {/* Image */}
          <img
            src="https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b"
            alt="Doctor Consultation"
            className="relative z-10 w-[350px] md:w-[420px] rounded-2xl shadow-2xl"
          />

          {/* Floating Card */}
          {/* <div className="absolute bottom-5 left-5 bg-white p-4 rounded-xl shadow-lg flex items-center gap-3">
            <FaUserMd className="text-blue-500 text-xl" />
            <div>
              <p className="text-sm font-semibold">4.8★ Rated Doctors</p>
              <p className="text-xs text-gray-500">Trusted by 100+ families</p>
            </div>
          </div> */}

        </div>

      </div>
    </section>
  );
}