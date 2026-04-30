import { useEffect, useState } from "react";
import axios from "axios";
import { Search } from "lucide-react";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // 🔄 Update Status
  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/booking/${id}/status`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchBookings();
    } catch (err) {
      console.log(err);
    }
  };

  // 🔍 Filter + Search
  const filteredBookings = bookings
    .filter((b) =>
      filter === "all" ? true : b.status === filter
    )
    .filter((b) =>
      b.service.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bookings</h1>

      <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back
        </button>

      {/* 🔍 Search + Filter */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 mt-4">
        <div className="flex items-center gap-2 bg-white p-3 rounded-xl shadow w-full md:w-1/3">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search service..."
            className="outline-none w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {["all", "pending", "completed", "cancelled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-100 text-gray-600 text-sm">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Service</th>
              <th className="p-4">Date</th>
              <th className="p-4">Price</th>
              <th className="p-4">Status</th>
              <th className="p-4">Review</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b._id} className="border-t hover:bg-gray-50">
                
                {/* User */}
                <td className="p-4">
                  <p className="font-semibold">{b.user?.name}</p>
                  <p className="text-sm text-gray-500">
                    {b.user?.email}
                  </p>
                </td>

                {/* Doctor */}
                <td className="p-4">
                  <p className="font-semibold">
                    {b.doctor?.name || "N/A"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {b.doctor?.specialization}
                  </p>
                </td>

                {/* Service */}
                <td className="p-4">{b.service}</td>

                {/* Date */}
                <td className="p-4">
                  {new Date(b.date).toLocaleDateString()}
                </td>

                {/* Price */}
                <td className="p-4">₹{b.price}</td>

                {/* Status */}
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      b.status === "completed"
                        ? "bg-green-100 text-green-600"
                        : b.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>

                {/* Review */}
                <td className="p-4">
                  {b.review ? (
                    <div>
                      ⭐ {b.review.rating}/5
                      <p className="text-xs text-gray-500">
                        {b.review.comment}
                      </p>
                    </div>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      No Review
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td className="p-4 space-x-2">
                  <button
                    onClick={() =>
                      updateStatus(b._id, "completed")
                    }
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Complete
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(b._id, "cancelled")
                    }
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;