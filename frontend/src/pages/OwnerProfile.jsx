// frontend/src/pages/OwnerProfile.jsx
import { useEffect, useState } from "react";
import NavBarOwner from "../components/NavBarOwner";
import { useAuth } from "../context/AuthContext";

const OwnerProfile = () => {
  const [restaurants, setRestaurants] = useState([]);
  const { owner } = useAuth();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/restaurants/owner", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        console.log("Fetched restaurants:", data); // Debugging
  
        setRestaurants(data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };
  
    fetchRestaurants();
  }, []);
  

  const handleDelete = async (restaurantId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Delete failed: ${response.status}`);
      }
      // Remove deleted restaurant from state
      setRestaurants(prev => prev.filter(r => r._id !== restaurantId));
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  return (
    <div>
      <NavBarOwner />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">My Restaurants</h2>
        {restaurants.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {restaurants.map((restaurant) => (
              <div key={restaurant._id} className="bg-white shadow p-4 rounded">
                <h3 className="text-xl font-semibold">{restaurant.name}</h3>
                <p className="text-gray-600">Location: {restaurant.location}</p>
                <p className="text-gray-600">Cuisine: {restaurant.cuisine}</p>
                <p className="text-gray-600">Hours: {restaurant.hours}</p>
                <p className="text-gray-600">Contact: {restaurant.contact}</p>
                
                {restaurant.features && restaurant.features.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-bold">Features:</h4>
                    <ul className="list-disc list-inside">
                      {restaurant.features.map((feat, index) => (
                        <li key={index}>{feat}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {restaurant.menu && restaurant.menu.length > 0 && (
                  <div className="mt-2">
                    <h4 className="font-bold">Menu:</h4>
                    <ul>
                      {restaurant.menu.map((menuItem, index) => (
                        <li key={index}>
                          {menuItem.name} - {menuItem.price}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {restaurant.images && restaurant.images.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {restaurant.images.map((img, index) => (
                      <img
                        key={index}
                        src={img.startsWith("http") ? img : `http://localhost:5000${img}`}
                        alt="Restaurant"
                        className="w-20 h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}

                {/* Delete Button */}
                <button
                  onClick={() => handleDelete(restaurant._id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Delete Restaurant
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No restaurants added yet.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerProfile;
