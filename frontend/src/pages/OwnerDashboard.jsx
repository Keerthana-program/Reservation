import { useNavigate } from "react-router-dom";
import NavOwner from "../components/NavOwner";

const OwnerDashboard = () => {
  const navigate = useNavigate(); 

  return (
    <div className="min-h-screen bg-blue-100">
      <NavOwner />  {/* ✅ Include Navbar */}

      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Welcome, Owner!</h2>

          {/* Buttons to Navigate */}
          <div className="space-y-4">
            <button 
              onClick={() => navigate("/add-restaurants")} 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Add Restaurants
            </button>
            <button 
              onClick={() => navigate("/owner-profile")} 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Profile
            </button>
            <button 
              onClick={() => navigate("/owner-reviews")} 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              User Reviews
            </button>
            <button 
              onClick={() => navigate("/user-bookings")} 
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              User Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
