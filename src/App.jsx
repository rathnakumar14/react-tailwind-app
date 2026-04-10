import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AppContext } from "./context/AppContext";

// Lazy pages
const Home = lazy(() => import("./Pages/Home"));
const Cards = lazy(() => import("./Pages/Cards"));
const About = lazy(() => import("./Pages/About"));
const Dashboard = lazy(() => import("./Pages/Dashboard"));
const Login = lazy(() => import("./Pages/Login"));
const UserProfile = lazy(() => import("./Pages/UserProfile"));

function App() {
  const { theme } = useContext(AppContext); // ✅ IMPORTANT

  return (
    <div
      className={`min-h-screen transition duration-300 ${
        theme === "dark"
          ? "bg-slate-900 text-white"
          : "bg-gray-100 text-black"
      }`}
    >
      <BrowserRouter>
        <Header />

        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              Loading...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />

            <Route
              path="/cards"
              element={
                <ProtectedRoute>
                  <Cards />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;