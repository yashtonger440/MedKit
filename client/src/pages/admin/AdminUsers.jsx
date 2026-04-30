import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, User } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // 🔹 Fetch Users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data);
    } catch (err) {
      console.log(err);
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete User
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // UI update
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete user");
    }
  };

  // 🔍 Filter logic (optional)
  const filteredUsers =
    filter === "all"
      ? users
      : users.filter((user) => user.role === filter);

  // ⏳ Loading Skeleton
  if (loading) {
    return (
      <div className="p-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 h-40 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">

      {/* 🔝 Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>

        <button
          onClick={() => window.history.back()}
          className="px-4 py-2 rounded-lg hover:bg-gray-300"
        >
          ⬅ Back
        </button>
      </div>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No users found 
        </div>
      )}

      {/* 👥 Users Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="bg-white p-5 rounded-2xl shadow-md hover:shadow-2xl transition duration-300 border border-gray-100 hover:-translate-y-1"
          >
            {/* 👤 Profile */}
            <div className="flex items-center gap-4 mb-4">
              {user.profileImage ? (
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/${user.profileImage}`}
                  alt="profile"
                  className="w-14 h-14 rounded-full object-cover border"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-500 text-white flex items-center justify-center">
                  <User />
                </div>
              )}

              <div>
                <h2 className="font-semibold text-lg">
                  {user.name}
                </h2>
                <p className="text-sm text-gray-500">
                  {user.email}
                </p>
              </div>
            </div>

            {/* 📄 Info */}
            <p className="text-sm text-gray-600">
              📞 {user.phone || "Not available"}
            </p>

            <p className="text-sm text-gray-600">
              Role: {user.role}
            </p>

            {/* 🧾 Status */}
            <div className="mt-3">
              <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700">
                Active
              </span>
            </div>

            {/* 🗑 Action */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleDelete(user._id)}
                className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;