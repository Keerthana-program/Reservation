import { Link } from "react-router-dom";

const NavBarOwner = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Left Side - Links */}
      <div className="space-x-4">
        <Link to="/owner-dashboard" className="text-white font-semibold hover:text-gray-300">Owner dashboard</Link>
      </div>

      {/* Right Side - Title */}
      <h1 className="text-white text-xl font-bold">Reserve Your Spot</h1>
    </nav>
  );
};

export default NavBarOwner;
