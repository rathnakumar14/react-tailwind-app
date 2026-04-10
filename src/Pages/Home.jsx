import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Home = () => {

  const navigate = useNavigate();
  const { theme } = useContext(AppContext);

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${
      theme === "dark" ? "bg-slate-900 text-white" : "bg-gray-100 text-black"
    }`}>

      <h1 className="text-4xl font-bold mb-6 text-center">
        Welcome to RathnaWeb
      </h1>

      {/* Buttons */}
      <div className="flex gap-6">

        {/* ✅ LOGIN BUTTON → NAVIGATE */}
        <Button
          label="Login"
          onClick={() => navigate("/login")}
        />

        {/* OPTIONAL REGISTER */}
        <Button
          label="Register"
          onClick={() => alert("Register not implemented")}
        />

      </div>
    </div>
  );
};

export default Home;