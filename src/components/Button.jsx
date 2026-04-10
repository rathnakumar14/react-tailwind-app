import React, { useState } from "react";

const Button = ({ label, onClick }) => {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        px-4 py-2 
        rounded-lg 
        text-white 
        transition duration-300 
        ${isActive ? "bg-blue-500 hover:bg-green-600" : "bg-blue-500 hover:bg-green-600"}
      `}
    >
      {label}
    </button>
  );
};

export default Button;