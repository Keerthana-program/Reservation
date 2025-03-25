import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const NavOwner = () => {
  const [ownerName, setOwnerName] = useState("");

  useEffect(() => {
    const storedName = localStorage.getItem("name"); // Get the name from localStorage
    if (storedName) {
      setOwnerName(storedName);
    }
  }, []);

  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Left Side - Links */}
      <div className="space-x-4">
        <Link to="/" className="text-white font-semibold hover:text-gray-300">Home</Link>
      </div>

      {/* Right Side - Title */}
      <h1 className="text-white text-xl font-bold">
        Welcome, {ownerName ? ownerName : "Owner"}
      </h1>
    </nav>
  );
};

export default NavOwner;
