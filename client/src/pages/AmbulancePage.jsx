import { FaAmbulance, FaPhoneAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Ambulance() {
  return (
    <>
    <Navbar />
    <div className="bg-gray-50">

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10">

          {/* TEXT */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Fast & Reliable <br /> Ambulance Service 🚑
            </h1>

            <p className="mt-4 text-white/90">
              Emergency response within minutes. Our trained team ensures safe
              and quick transportation with medical support.
            </p>

            <div className="mt-6 flex gap-4">
              <button className="bg-white text-red-600 px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
                Call Now
              </button>

              <button className="bg-white/20 border border-white px-6 py-3 rounded-full hover:bg-white hover:text-red-600 transition">
                Book Ambulance
              </button>
            </div>
          </div>

          {/* IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1686797366685-6420f4bd9c2f"
              alt="Ambulance"
              className="rounded-3xl shadow-xl w-full h-[350px] object-cover"
            />
          </div>

        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">

          <h2 className="text-3xl font-bold text-gray-800">
            Why Choose Our Ambulance Service
          </h2>

          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-8">

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <FaClock className="text-red-500 text-3xl mb-4" />
              <h3 className="font-semibold text-lg">24/7 Availability</h3>
              <p className="text-gray-600 text-sm mt-2">
                Available anytime, anywhere for emergencies.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <FaAmbulance className="text-red-500 text-3xl mb-4" />
              <h3 className="font-semibold text-lg">Advanced Ambulances</h3>
              <p className="text-gray-600 text-sm mt-2">
                Fully equipped with oxygen & life-saving tools.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <FaMapMarkerAlt className="text-red-500 text-3xl mb-4" />
              <h3 className="font-semibold text-lg">Quick Response</h3>
              <p className="text-gray-600 text-sm mt-2">
                Reach your location within minutes.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow hover:shadow-xl transition">
              <FaPhoneAlt className="text-red-500 text-3xl mb-4" />
              <h3 className="font-semibold text-lg">Instant Booking</h3>
              <p className="text-gray-600 text-sm mt-2">
                Call or WhatsApp for instant service.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-red-50 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800">
          Need Emergency Help?
        </h2>

        <p className="mt-3 text-gray-600">
          Call now and get ambulance within minutes.
        </p>

        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          <button className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition">
            📞 Call Now
          </button>

          <button className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition">
            WhatsApp Booking
          </button>
        </div>
      </section>

    </div>
    <Footer />
    </>
  );
}