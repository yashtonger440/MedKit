import {
  FaUserNurse,
  FaUserMd,
  FaAmbulance,
} from "react-icons/fa";

export default function JoinMission() {
  const partners = [
    {
      icon: <FaUserNurse />,
      role: "HEALTHCARE TECHNICIAN",
      title: "Bring care closer to every home that suits everybody",
      desc: "Serve patients in your own city with flexible hours — from injections to ECGs.",
    },
    {
      icon: <FaUserMd />,
      role: "DOCTOR PARTNER",
      title: "Be there when someone needs care the most",
      desc: "Consult patients remotely via audio or video calls. Set your own schedule.",
    },
    {
      icon: <FaAmbulance />,
      role: "AMBULANCE PARTNER",
      title: "Every second matters. Be the help that arrives in time",
      desc: "Register your ambulance with MedKit's emergency network in your area.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50 px-6">

      <div className="max-w-7xl mx-auto">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* LEFT TEXT */}
          <div>
            <p className="text-sm text-blue-500 font-semibold uppercase tracking-wide">
              Join Our Mission
            </p>

            <h2 className="text-4xl font-bold text-gray-800 mt-2 leading-tight">
              Be the Reason Someone Gets 
              <span className="text-cyan-500"> Care in Time </span>
            </h2>

            <p className="mt-4 text-gray-600 leading-relaxed">
              Healthcare isn't just a profession — it's a calling. Partner with
              MedKit and help families in India access quality care
              at their doorstep.
            </p>

            {/* POINTS */}
            <div className="mt-6 space-y-4">

              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                  ✔
                </div>
                <span className="text-gray-700">
                  Make a real difference in your community
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                  👥
                </div>
                <span className="text-gray-700">
                  Join a growing network of trusted professionals
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-cyan-100 p-3 rounded-xl text-cyan-600">
                  🛡
                </div>
                <span className="text-gray-700">
                  Verified, supported & respected partnership
                </span>
              </div>

            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div>
            <img
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef"
              alt="Healthcare Team"
              className="rounded-3xl shadow-xl w-full h-95 object-cover"
            />
          </div>

        </div>

        {/* CARDS */}
        <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {partners.map((p, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition duration-300"
            >

              {/* ICON */}
              <div className="bg-linear-to-r from-blue-500 to-cyan-400 text-white w-12 h-12 flex items-center justify-center rounded-xl mb-4 text-xl">
                {p.icon}
              </div>

              {/* ROLE */}
              <p className="text-xs font-semibold text-blue-500 uppercase">
                {p.role}
              </p>

              {/* TITLE */}
              <h3 className="text-lg font-semibold text-gray-800 mt-1">
                {p.title}
              </h3>

              {/* DESC */}
              <p className="text-gray-600 text-sm mt-2">
                {p.desc}
              </p>

              {/* BUTTON */}
              <button className="mt-6 w-full py-3 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-full font-medium hover:scale-105 transition">
                Join as Partner
              </button>

            </div>
          ))}

        </div>

        {/* BOTTOM TEXT */}
        <p className="text-center text-gray-500 text-sm mt-10">
          ✔ Trusted by healthcare professionals across the Country
        </p>

      </div>
    </section>
  );
}