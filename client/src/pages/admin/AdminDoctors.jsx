import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors
  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/doctors`,
        // "http://localhost:5000/api/admin/doctors",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDoctors(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

      // Approve and Reject
      const handleAction = async (id, status) => {
  try {
    const token = localStorage.getItem("token");

    const endpoint =
      status === "approved"
      ? `${import.meta.env.VITE_API_URL}/api/admin/doctor/${id}/approve`
      : `${import.meta.env.VITE_API_URL}/api/admin/doctor/${id}/reject`;
      // ? `http://localhost:5000/api/admin/doctor/${id}/approve`
      // : `http://localhost:5000/api/admin/doctor/${id}/reject`;

    await axios.put(endpoint, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // UI update
    setDoctors((prev) =>
      prev.map((doc) =>
        doc._id === id ? { ...doc, status } : doc
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  if (loading) {
    return <div className="p-6">Loading doctors...</div>;
  }

  return (
    <div className="p-6">
      {/* 🔝 Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Doctors</h1>

        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {doctors.map((doc) => (
          <div
            key={doc._id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-xl transition"
          >
            {/* Profile */}
            <div className="flex items-center gap-4 mb-4">
              <img
                 src={`${import.meta.env.VITE_API_URL}/uploads/${doc.profileImage}`}
                // src={`http://localhost:5000/uploads/${doc.profileImage}`}
                alt="profile"
                className="w-16 h-16 rounded-full object-cover border"
              />
              <div>
                <h2 className="font-semibold text-lg">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {doc.specialization}
                </p>
              </div>
            </div>

            {/* Info */}
            <p className="text-sm text-gray-600">
              Experience: {doc.experience} years
            </p>

            {/* Certificate */}
            <a
              href={`${import.meta.env.VITE_API_URL}/uploads/${doc.certificate}`}
              // href={`http://localhost:5000/uploads/${doc.certificate}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 text-sm underline mt-2 block"
            >
              View Certificate
            </a>

            {/* Status */}
            <div className="mt-3">
              <span
                className={`px-3 py-1 text-xs rounded-full ${
                  doc.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : doc.status === "rejected"
                    ? "bg-red-100 text-red-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {doc.status}
              </span>
            </div>

            {/* Actions */}
            {doc.status === "pending" && (
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() =>
                    handleAction(doc._id, "approved")
                  }
                  className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>

                <button
                  onClick={() =>
                    handleAction(doc._id, "rejected")
                  }
                  className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDoctors;