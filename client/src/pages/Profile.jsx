import React, { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [editMode, setEditMode] = useState(false);

  const [editData, setEditData] = useState({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);

    if (storedUser) {
      setEditData({
        name: storedUser.name || "",
        phone: storedUser.phone || "",
      });

      const userImage = localStorage.getItem(
        `profileImage_${storedUser.email}`
      );
      if (userImage) setImage(userImage);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      localStorage.setItem(
        `profileImage_${user.email}`,
        reader.result
      );
    };
    reader.readAsDataURL(file);
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // SAVE PROFILE
  const handleSave = () => {
    const updatedUser = {
      ...user,
      name: editData.name,
      phone: editData.phone,
    };

    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setEditMode(false);
  };

  if (!user) {
    return (
      <div className="h-screen flex justify-center items-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-100 via-cyan-100 to-blue-200 flex justify-center items-center px-4 py-10">

      <div className="bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border border-white/40">

        {/* PROFILE IMAGE */}
        <div className="relative w-28 h-28 mx-auto mb-4">
          {image ? (
            <img
              src={image}
              className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>
          )}

          <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer">
            📷
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* VIEW MODE */}
        {!editMode ? (
          <>
            <h2 className="text-2xl font-bold text-gray-800">
              {user.name}
            </h2>

            <p className="text-gray-500">{user.email}</p>

            <p className="text-gray-600 mt-1">
              📞 {user.phone || "Not added"}
            </p>

            <span className="inline-block mt-3 px-4 py-1 text-sm bg-blue-100 text-blue-600 rounded-full">
              {user.role || "User"}
            </span>
          </>
        ) : (
          /* EDIT MODE */
          <div className="space-y-3 text-left mt-4">
            <input
              name="name"
              value={editData.name}
              onChange={handleChange}
              placeholder="Name"
              className="w-full p-3 rounded-xl bg-white shadow-sm outline-none"
            />

            <input
              name="phone"
              value={editData.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="w-full p-3 rounded-xl bg-white shadow-sm outline-none"
            />
          </div>
        )}

        {/* BUTTONS */}
        <div className="mt-6 space-y-3">

          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              className="w-full py-2 bg-linear-to-r from-blue-500 to-cyan-400 text-white rounded-xl font-semibold hover:scale-105 transition"
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                className="w-full py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition"
              >
                Save Changes
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="w-full py-2 bg-gray-300 rounded-xl hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          )}

          <button
            onClick={handleLogout}
            className="w-full py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
          >
            Logout
          </button>

        </div>

      </div>
    </div>
  );
}

export default Profile;