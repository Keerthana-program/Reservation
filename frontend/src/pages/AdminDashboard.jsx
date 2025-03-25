import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 w-full max-w-md">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
          onClick={() => navigate("/admin/users")}
        >
          User Details
        </button>

        <button onClick={() => navigate("/admin/restaurants")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Restaurants
        </button>

        <button onClick={() => navigate("/admin/bookings")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Bookings
        </button>

        <button onClick={() => navigate("/admin/reviews")} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          View Reviews
        </button>

      </div>
    </div>
  );
};

export default AdminDashboard;
