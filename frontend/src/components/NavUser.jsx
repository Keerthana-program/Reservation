import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const NavUser = () => {
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "");

  useEffect(() => {
    const updateName = () => {
      setUserName(localStorage.getItem("userName") || "");
    };

    window.addEventListener("storage", updateName);
    return () => window.removeEventListener("storage", updateName);
  }, []);

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="text-white font-semibold hover:text-gray-300">Home</Link>
        <Link to="/user-profile" className="text-white font-semibold hover:text-gray-300">Profile</Link>
      </div>
      <h1 className="text-white text-xl font-bold">Reserve Your Spot</h1>
      <div className="text-white font-semibold">
        {userName ? `Welcome, ${userName}!` : "Welcome!"}
      </div>
    </nav>
  );
};

export default NavUser;
