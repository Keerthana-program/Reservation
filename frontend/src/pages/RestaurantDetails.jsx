// frontend/src/pages/RestaurantDetails.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import Navbar from "../components/Navbar"; 

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    console.log("Fetching restaurant with ID:", id); // ✅ Debugging

    const fetchRestaurant = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/restaurants/${id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();
        setRestaurant(data);
      } catch (error) {
        console.error("Error fetching restaurant details:", error);
      }
    };

    fetchRestaurant();
  }, [id]);

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100">
          <Navbar />
        <h2 className="text-2xl font-bold text-gray-700">Loading...</h2>
      </div>
    );
  }
  const handleSubmitReview = async () => {
    if (!restaurantId || !reviewText || !rating) {
      alert("Please fill all fields");
      return;
    }
  
    const formData = new FormData();
    formData.append("text", reviewText);
    formData.append("rating", rating);
    if (selectedImage) {
      formData.append("image", selectedImage);
    }
  
    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/${restaurantId}/reviews`, {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) throw new Error("Failed to submit review");
  
      const data = await response.json();
      setReviews([...reviews, data]);
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };
  
  return (
    <div className="min-h-screen bg-blue-100">
      <Navbar/>
      <div className="container mx-auto p-4">
        <h2 className="text-3xl font-bold text-center text-gray-700">{restaurant.name}</h2>

        {/* Restaurant Image */}
        <img 
          src={
            restaurant.images && restaurant.images.length > 0 
              ? restaurant.images[0].startsWith("http")
                ? restaurant.images[0]
                : `http://localhost:5000${restaurant.images[0]}`
              : "/placeholder.jpg"
          }
          alt={restaurant.name}
          className="w-full h-64 object-cover rounded-lg shadow-md my-4"
        />

        {/* Restaurant Details */}
        <div className="bg-white p-6 shadow-lg rounded-lg">
          <p><strong>📍 Location:</strong> {restaurant.location}</p>
          <p><strong>🍽 Cuisine:</strong> {restaurant.cuisine}</p>
          <p><strong>🕒 Hours:</strong> {restaurant.hours}</p>
          <p><strong>📞 Contact:</strong> {restaurant.contact}</p>

          {/* Features */}
          {restaurant.features && restaurant.features.length > 0 && (
            <div>
              <h4 className="font-bold mt-4">✨ Features:</h4>
              <ul className="list-disc pl-6">
                {restaurant.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Menu */}
          {restaurant.menu && restaurant.menu.length > 0 && (
            <div>
              <h4 className="font-bold mt-4">📜 Menu:</h4>
              <ul className="list-disc pl-6">
                {restaurant.menu.map((menuItem, index) => (
                  <li key={index}>{menuItem.name} - <strong>${menuItem.price}</strong></li>

                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Buttons for Review and Booking */}
        <div className="flex justify-center space-x-4 mt-6">
          <Link to={`/restaurant/${id}/review`}>
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg shadow hover:bg-green-600">
              Review
            </button>
          </Link>

          <Link to={`/restaurant/${id}/booking`}>
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-600">
              Booking
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
