import { FaMapMarkerAlt } from "react-icons/fa";

export default function Coverage() {
  const areas = [
    "Rampur Road",
    "Kaladhungi Road",
    "Nainital Road",
    "Mukhani",
    "Heera Nagar",
    "Kusumkhera",
    "Panchakki",
    "Bareilly Road",
    "Transport Nagar",
    "Lamachaur",
    "Kathgharia",
    "Devalchaur",
    "Chadail",
    "Kathgodam Market",
    "Gaula Barrage",
    "Shish Mahal",
    "Ranibagh",
  ];

  return (
    <section className="py-25 bg-gray-50">

      <div className="max-w-5xl mx-auto text-center px-4">

        {/* SMALL TAG */}
        <p className="text-sm text-blue-500 font-semibold tracking-wider uppercase">
          Coverage
        </p>

        {/* HEADING */}
        <h2 className="text-4xl font-bold text-gray-800 mt-2">
          Areas We <span className="text-blue-500">Serve</span>
        </h2>

        {/* SUBTEXT */}
        <p className="text-gray-500 mt-3">
          Currently serving Haldwani & Kathgodam with plans to expand.
        </p>

        {/* AREAS */}
        <div className="mt-10 flex flex-wrap justify-center gap-4">

          {areas.map((area, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition duration-200"
            >
              <FaMapMarkerAlt className="text-blue-500 text-sm" />
              <span className="text-gray-700 text-sm font-medium">
                {area}
              </span>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}