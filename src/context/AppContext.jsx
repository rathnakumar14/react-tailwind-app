import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  // =========================
  // 🎨 THEME (CLEAN VERSION)
  // =========================
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  // ✅ APPLY THEME + SAVE
  useEffect(() => {
    localStorage.setItem("theme", theme);

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  // ✅ Toggle (optional)
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // =========================
  // 👤 ROLE
  // =========================
  const [role, setRole] = useState(
    localStorage.getItem("role") || "user"
  );

  useEffect(() => {
    localStorage.setItem("role", role);
  }, [role]);

  // =========================
  // 🔐 AUTH STATE
  // =========================
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // =========================
  // 👤 USER PROFILE
  // =========================
  const [user, setUser] = useState({
    name: "",
    email: "",
    profilePic: "",
    role: "user",
  });

  // 💾 LOAD USER
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsLoggedIn(true);
      setRole(parsedUser.role || "user");
    }
  }, []);

  // =========================
  // 🔐 LOGIN
  // =========================
  const login = (email, password) => {

    if (email === "admin@gmail.com" && password === "1234") {
      const userData = {
        name: "Admin",
        email,
        profilePic: "",
        role: "admin",
      };

      setUser(userData);
      setIsLoggedIn(true);
      setRole("admin");

      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    if (email === "user@gmail.com" && password === "1234") {
      const userData = {
        name: "User",
        email,
        profilePic: "",
        role: "user",
      };

      setUser(userData);
      setIsLoggedIn(true);
      setRole("user");

      localStorage.setItem("user", JSON.stringify(userData));
      return true;
    }

    return false;
  };

  // =========================
  // 🚪 LOGOUT
  // =========================
  const logout = () => {
    setUser({
      name: "",
      email: "",
      profilePic: "",
      role: "user",
    });

    setIsLoggedIn(false);
    setRole("user");

    localStorage.removeItem("user");
  };

  // =========================
  // ✏️ UPDATE PROFILE
  // =========================
  const updateProfile = (updatedData) => {
    const newUser = { ...user, ...updatedData };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  // =========================
  // 🧾 CARDS
  // =========================
  const [cards, setCards] = useState([]);

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,        // ✅ IMPORTANT
        toggleTheme,

        role,
        setRole,

        cards,
        setCards,

        isLoggedIn,
        login,
        logout,

        user,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};