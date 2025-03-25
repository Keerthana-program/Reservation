import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminRestaurant = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/restaurants", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch restaurants");
        }

        const data = await response.json();
        setRestaurants(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Restaurant Details</h1>

      <button 
        className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        ⬅ Back to Admin Dashboard
      </button>

      {loading && <p>Loading restaurants...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && restaurants.length === 0 && <p>No restaurants found.</p>}

      {!loading && !error && restaurants.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Name</th>
                <th className="border border-gray-300 px-4 py-2">Location</th>
                <th className="border border-gray-300 px-4 py-2">Contact</th>
                <th className="border border-gray-300 px-4 py-2">Cuisine</th>
              </tr>
            </thead>
            <tbody>
              {restaurants.map((restaurant) => (
                <tr key={restaurant._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{restaurant.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{restaurant.location}</td>
                  <td className="border border-gray-300 px-4 py-2">{restaurant.contact}</td>
                  <td className="border border-gray-300 px-4 py-2">{restaurant.cuisine}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminRestaurant;
