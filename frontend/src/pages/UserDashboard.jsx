import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NavUser from "../components/NavUser";


const UserDashboard = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchParams, setSearchParams] = useState({
    cuisine: "",
    price: "",
    location: "",
    features: "",
  });

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/restaurants/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        setRestaurants(data);
        setFilteredRestaurants(data); // Initially show all restaurants
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, []);

  // Function to handle search input changes
  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value,
    });
  };

  // Function to filter restaurants based on search criteria
  const handleSearch = () => {
    const filtered = restaurants.filter((restaurant) => {
      return (
        (searchParams.cuisine === "" || restaurant.cuisine.toLowerCase().includes(searchParams.cuisine.toLowerCase())) &&
        (searchParams.price === "" || restaurant.priceRange.toLowerCase() === searchParams.price.toLowerCase()) &&
        (searchParams.location === "" || restaurant.location.toLowerCase().includes(searchParams.location.toLowerCase())) &&
        (searchParams.features === "" || restaurant.features.some((feature) => feature.toLowerCase().includes(searchParams.features.toLowerCase())))
      );
    });

    setFilteredRestaurants(filtered);
  };

  return (
    <div className="min-h-screen bg-blue-100">
      <NavUser />

      {/* Search Bar */}
      <div className="container mx-auto p-4 bg-white shadow-md rounded-md mb-4">
        <h2 className="text-2xl font-bold mb-2">Search Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            name="cuisine"
            placeholder="Search by Cuisine"
            value={searchParams.cuisine}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <select
            name="price"
            value={searchParams.price}
            onChange={handleChange}
            className="p-2 border rounded"
          >
            <option value="">Select Price Range</option>
            <option value="low">$</option>
            <option value="medium">$$</option>
            <option value="high">$$$</option>
          </select>
          <input
            type="text"
            name="location"
            placeholder="Search by Location"
            value={searchParams.location}
            onChange={handleChange}
            className="p-2 border rounded"
          />
          <input
            type="text"
            name="features"
            placeholder="Search by Features (e.g., outdoor seating)"
            value={searchParams.features}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>
        <button
          onClick={handleSearch}
          className="mt-4 p-2 bg-blue-500 text-white rounded w-full md:w-auto"
        >
          Search
        </button>
      </div>

      {/* Restaurant Listings */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Restaurants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredRestaurants.length > 0 ? (
            filteredRestaurants.map((restaurant) => (
              <Link key={restaurant._id} to={`/restaurant/${restaurant._id}`} className="block">
                <div className="bg-white shadow rounded overflow-hidden">
                  <img
                    src={
                      restaurant.images && restaurant.images.length > 0
                        ? restaurant.images[0].startsWith("http")
                          ? restaurant.images[0]
                          : `http://localhost:5000${restaurant.images[0]}`
                        : "/placeholder.jpg"
                    }
                    alt={restaurant.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-semibold text-center">{restaurant.name}</h3>
                    <p className="text-gray-600 text-center">{restaurant.cuisine} • {restaurant.priceRange}</p>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-600 col-span-3">No restaurants found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
