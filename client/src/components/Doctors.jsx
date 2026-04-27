import { FaStar } from "react-icons/fa";

export default function Doctors() {
  const doctors = [
    {
      name: "Dr. Rahul Sharma",
      degree: "MBBS, MD",
      specialty: "General Physician",
      exp: "8+ years experience",
      rating: "4.8",
      available: true,
      img: "/images/doctors/rahulsharma.jpg",
    },
    {
      name: "Dr. Neha Verma",
      degree: "MBBS, DGO",
      specialty: "Women's Health",
      exp: "6+ years experience",
      rating: "4.7",
      available: true,
      img: "/images/doctors/nehaverma.jpg",
    },
    {
      name: "Dr. Amit Joshi",
      degree: "MBBS, MD",
      specialty: "Internal Medicine",
      exp: "10+ years experience",
      rating: "4.9",
      available: false,
      img: "/images/doctors/amitjoshi.jpg",
    },
    {
      name: "Dr. Priya Rawat",
      degree: "MBBS, DCH",
      specialty: "Pediatrics",
      exp: "5+ years experience",
      rating: "4.6",
      available: true,
      img: "/images/doctors/priyarawat.jpg",
    },
  ];

  return (
    <section className="py-20 bg-linear-to-b from-white to-blue-50">
      
      {/* Heading */}
      <div className="text-center max-w-2xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800">
          Meet Our Expert Doctors
        </h2>
        <p className="mt-4 text-gray-600">
          Trusted, verified doctors available for consultations — at home or on call.
        </p>
      </div>

      {/* Cards */}
      <div className="mt-14 grid gap-8 px-6 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        
        {doctors.map((doc, index) => (
          <div
            key={index}
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition duration-300 overflow-hidden hover:-translate-y-2"
          >
            
            {/* Image */}
            <div className="relative">
              <img
                src={doc.img}
                alt={doc.name}
                className="w-full h-56 object-cover"
              />

              {/* Availability Badge */}
              {doc.available && (
                <span className="absolute top-3 left-3 bg-green-500 text-white text-xs px-3 py-1 rounded-full">
                  ● Available Now
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-5 text-center">
              
              <h3 className="text-lg font-semibold text-gray-800">
                {doc.name}
              </h3>

              <p className="text-sm text-gray-500">{doc.degree}</p>

              <p className="mt-2 text-blue-600 font-medium">
                {doc.specialty}
              </p>

              <p className="text-sm text-gray-500 mt-1">{doc.exp}</p>

              {/* Rating */}
              <div className="flex justify-center items-center gap-1 mt-3 text-yellow-500">
                <FaStar />
                <span className="text-gray-700 font-medium">
                  {doc.rating}
                </span>
                <span className="text-gray-500 text-sm">/5</span>
              </div>
            </div>
          </div>
        ))}

      </div>

      {/* Bottom Trust Line */}
      <div className="mt-16 text-center">
        <p className="text-gray-600 text-sm">
          <span className="font-semibold text-gray-800">✔ Verified Doctors</span> • 
          <span className="font-semibold text-gray-800"> 4.8★ Avg Rating</span> • 
          <span className="font-semibold text-gray-800"> Instant Consultation</span>
        </p>
      </div>

    </section>
  );
}

