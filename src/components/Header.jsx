import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { useNotification } from "../context/NotificationContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { showToast } = useNotification();
  const { theme, toggleTheme, isLoggedIn, logout, user } =
    useContext(AppContext);

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast("Logged out successfully 👋", "success");
    navigate("/");
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 ${
        theme === "dark"
          ? "bg-slate-900 text-white"
          : "bg-white text-black shadow"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">

        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-blue-500 text-2xl">🌐</span>
          <span className="text-xl font-bold">RathnaWeb</span>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>

        {/* ✅ DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">Home</Link>
          <Link to="/cards">Cards</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
          {isLoggedIn && <Link to="/profile">Profile</Link>}

          {/* ✅ ROLE BADGE */}
          {isLoggedIn && (
            <span className="px-3 py-1 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded text-sm font-medium">
              {user?.role === "admin" ? "Admin" : "User"}
            </span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="bg-green-500 text-white px-3 py-1 rounded">
                Login
              </button>
            </Link>
          )}
        </nav>
      </div>

      {/* ✅ MOBILE MENU */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 shadow-lg px-4 py-4 space-y-3">

          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <Link to="/cards" onClick={() => setIsMenuOpen(false)}>Cards</Link>
          <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)}>About</Link>

          {isLoggedIn && (
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
              Profile
            </Link>
          )}

          {/* ✅ ROLE BADGE MOBILE */}
          {isLoggedIn && (
            <span className="block px-3 py-2 bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded text-sm text-center">
              {user?.role === "admin" ? "Admin" : "User"}
            </span>
          )}

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full bg-blue-500 text-white py-2 rounded"
          >
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          {/* Auth Buttons */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded"
            >
              Logout
            </button>
          ) : (
            <Link to="/login">
              <button className="w-full bg-green-500 text-white py-2 rounded">
                Login
              </button>
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;