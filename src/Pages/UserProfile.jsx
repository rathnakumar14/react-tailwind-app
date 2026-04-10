import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNotification } from "../context/NotificationContext";

const UserProfile = () => {
  const { theme, setTheme, updateProfile } = useContext(AppContext);
  const { showToast } = useNotification();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ LOAD SAVED PROFILE
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("profile"));

    if (savedProfile) {
      setName(savedProfile.name || "");
      setEmail(savedProfile.email || "");
      setProfileImage(savedProfile.image || "");
    }
  }, []);

  // 📸 IMAGE UPLOAD
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ TYPE VALIDATION
    if (!file.type.startsWith("image/")) {
      showToast("Please upload a valid image ❌", "error");
      return;
    }

    // ✅ SIZE VALIDATION (2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Image must be less than 2MB ❌", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result);
    reader.readAsDataURL(file);
  };

  // 💾 SAVE PROFILE
  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ NAME VALIDATION
    if (!name.trim()) {
      showToast("Name is required ❌", "error");
      return;
    }

    // ✅ EMAIL VALIDATION
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast("Enter a valid email ❌", "error");
      return;
    }

    setLoading(true);

    const data = {
      name,
      email,
      image: profileImage,
    };

    // 💾 Save to localStorage
    localStorage.setItem("profile", JSON.stringify(data));

    // 🔄 Sync with global context
    updateProfile({
      name,
      email,
      profilePic: profileImage,
    });

    showToast("Profile saved successfully ✅", "success");
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex justify-center items-center px-4 transition duration-300 ${
        theme === "dark"
          ? "bg-slate-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full max-w-md p-6 rounded-xl shadow-lg bg-white text-black dark:bg-slate-800 dark:text-white">

        <h2 className="text-2xl font-bold text-center mb-4">
          User Profile
        </h2>

        {/* 👤 PROFILE IMAGE */}
        <div className="flex justify-center mb-4">
          {profileImage ? (
            <img
              src={profileImage}
              alt="User profile"
              className="w-24 h-24 rounded-full object-cover border"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-300 rounded-full flex items-center justify-center text-sm">
              No Image
            </div>
          )}
        </div>

        <input
          type="file"
          onChange={handleImageChange}
          className="mb-4 w-full text-sm"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {/* 🎨 THEME SWITCH */}
          <div>
            <p className="font-semibold mb-1">Theme Preference</p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setTheme("light")}
                className={`px-4 py-1 rounded ${
                  theme === "light"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Light
              </button>

              <button
                type="button"
                onClick={() => setTheme("dark")}
                className={`px-4 py-1 rounded ${
                  theme === "dark"
                    ? "bg-black text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                Dark
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default UserProfile;