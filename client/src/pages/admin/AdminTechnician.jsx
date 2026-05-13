import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Trash2 } from "lucide-react";

const AdminTechnicians = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchTechnicians = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/technicians`,
        { headers }
      );
      setTechnicians(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTechnicians(); }, []);

  const handleAction = async (id, status) => {
    try {
      const endpoint = status === "approved"
        ? `${import.meta.env.VITE_API_URL}/api/admin/technician/${id}/approve`
        : `${import.meta.env.VITE_API_URL}/api/admin/technician/${id}/reject`;

      await axios.put(endpoint, {}, { headers });

      setTechnicians(prev =>
        prev.map(t => t._id === id ? { ...t, status } : t)
      );
    } catch (err) {
      console.log(err);
    }
  };


  const filtered = technicians.filter(t =>
    filter === "all" ? true : t.status === filter
  );

  if (loading) return <div className="p-6 text-gray-500">Loading technicians...</div>;

  return (
    <div className="p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">All Technicians</h1>
          {/* <p className="text-sm text-gray-500 mt-0.5">Manage technician registrations</p> */}
        </div>
        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm transition"
        >
          ⬅ Back
        </button>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total",    value: technicians.length,                                    color: "text-gray-800",   bg: "bg-gray-50"    },
          { label: "Pending",  value: technicians.filter(t => t.status === "pending").length,  color: "text-yellow-600", bg: "bg-yellow-50"  },
          { label: "Approved", value: technicians.filter(t => t.status === "approved").length, color: "text-green-600",  bg: "bg-green-50"   },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-4 text-center border border-gray-100`}>
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div> */}

      {/* Filter Tabs */}
      {/* <div className="flex gap-2 mb-6 flex-wrap">
        {["all", "pending", "approved", "rejected"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm capitalize transition-all ${
              filter === f
                ? "bg-purple-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div> */}

      {/* Technician Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
          No technicians found
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(tech => (
            <div
              key={tech._id}
              className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition border border-gray-100"
            >
              {/* Profile */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={
                    tech.profileImage
                      ? `${import.meta.env.VITE_API_URL}/uploads/${tech.profileImage}`
                      : `https://ui-avatars.com/api/?name=${tech.name}&background=9333ea&color=fff`
                  }
                  alt="profile"
                  className="w-16 h-16 rounded-full object-cover border-2 border-purple-100"
                />
                <div>
                  <h2 className="font-semibold text-gray-800 text-lg">{tech.name}</h2>
                  <p className="text-sm text-gray-500">{tech.email}</p>
                </div>
              </div>

              {/* Info */}
              <div className="space-y-1.5 mb-4">
                <p className="text-sm text-gray-600">
                  Experience: <span className="font-medium text-gray-800">{tech.experience || "N/A"} years</span>
                </p>
                <p className="text-sm text-gray-600">
                  Phone: <span className="font-medium text-gray-800">{tech.phone || "N/A"}</span>
                </p>

              </div>

              {/* Certificate */}
              <a
              
                href={`${import.meta.env.VITE_API_URL}/uploads/${tech.certificate}`}
                target="_blank"
                rel="noreferrer"
                className="text-purple-600 text-sm underline block mb-3 hover:text-purple-800 transition"
              >
                📄 View Certificate
              </a>

              {/* Status Badge */}
              <div className="mb-4">
                <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                  tech.status === "approved"
                    ? "bg-green-100 text-green-700"
                    : tech.status === "rejected"
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {tech.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2 flex-wrap">
                {tech.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleAction(tech._id, "approved")}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      <CheckCircle size={15} /> Approve
                    </button>
                    <button
                      onClick={() => handleAction(tech._id, "rejected")}
                      className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                    >
                      <XCircle size={15} /> Reject
                    </button>
                  </>
                )}

                {tech.status === "approved" && (
                  <button
                    onClick={() => handleAction(tech._id, "rejected")}
                    className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    <XCircle size={15} /> Revoke
                  </button>
                )}

                {tech.status === "rejected" && (
                  <button
                    onClick={() => handleAction(tech._id, "approved")}
                    className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm transition"
                  >
                    <CheckCircle size={15} /> Approve
                  </button>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTechnicians;