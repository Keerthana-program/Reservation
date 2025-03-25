import { Link } from "react-router-dom";

const NavLogin = () => {
  return (
    <nav className="bg-blue-500 p-4 flex justify-between items-center">
      {/* Left Side - Links */}
      <div className="space-x-4">
        <Link to="/" className="text-white font-semibold hover:text-gray-300">Home</Link>
        <Link to="/Register" className="text-white font-semibold hover:text-gray-300">Register</Link>
      </div>

      {/* Right Side - Title */}
      <h1 className="text-white text-xl font-bold">Reserve Your Spot</h1>
    </nav>
  );
};

export default NavLogin;
