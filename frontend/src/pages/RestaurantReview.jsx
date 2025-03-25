import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => setRating(star)}
          className={`cursor-pointer text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-400"}`}
        >
          ★
        </span>
      ))}
    </div>
  );
};

const RestaurantReview = () => {
  // 'id' is the restaurant ID from the URL
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ text: "", rating: 0 });
  const [selectedImage, setSelectedImage] = useState(null);
  const [editingReview, setEditingReview] = useState(null);

  console.log("Restaurant ID:", id);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/${id}/reviews`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) return console.error("No token found. User must be logged in.");
    if (!id) return console.error("Restaurant ID is not defined");
  
    try {
      let requestBody;
      let headers = { "Authorization": `Bearer ${token}` };
  
      if (selectedImage) {
        requestBody = new FormData();
        requestBody.append("text", newReview.text.trim());
        requestBody.append("rating", newReview.rating.toString());
        requestBody.append("image", selectedImage);
        // Don't set Content-Type manually, FormData handles it.
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({ text: newReview.text, rating: newReview.rating });
      }
  
      const response = await fetch(`http://localhost:5000/api/restaurants/${id}/reviews`, {
        method: "POST",
        headers,
        body: requestBody, // ✅ This will be FormData or JSON based on condition
      });
  
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Error submitting review");
  
      console.log("Review submitted successfully:", data);
      setNewReview({ text: "", rating: 0 });
      setSelectedImage(null);
      fetchReviews();
    } catch (error) {
      console.error("Error submitting review:", error.message);
    }
  };
  

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User must be logged in.");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/restaurants/${id}/reviews/${reviewId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete review");
      }
      fetchReviews();
    } catch (error) {
      console.error("Error deleting review:", error.message);
    }
  };

  const handleUpdateReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. User must be logged in.");
      return;
    }
    try {
      let requestBody;
      const headers = { "Authorization": `Bearer ${token}` };

      if (selectedImage) {
        requestBody = new FormData();
        requestBody.append("text", newReview.text);
        requestBody.append("rating", newReview.rating);
        requestBody.append("image", selectedImage);
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({ text: newReview.text, rating: newReview.rating });
      }

      const response = await fetch(`http://localhost:5000/api/restaurants/${id}/reviews/${reviewId}`, {
        method: "PUT",
        headers,
        body: requestBody,
      });

      if (!response.ok) {
        throw new Error("Failed to update review");
      }

      setEditingReview(null);
      setNewReview({ text: "", rating: 0 });
      setSelectedImage(null);
      fetchReviews();
    } catch (error) {
      console.error("Error updating review:", error.message);
    }
  };

  const handleEditReview = (review) => {
    setEditingReview(review._id);
    setNewReview({ text: review.text, rating: review.rating });
  };

  return (
    <div className="min-h-screen bg-blue-100 p-4">
        <Navbar />
  
      <h2 className="text-2xl font-bold">Leave a Review</h2>
      <div className="mt-4">
        <textarea
          className="border p-2 w-full"
          placeholder="Write your review..."
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
        />
        <StarRating rating={newReview.rating} setRating={(rating) => setNewReview({ ...newReview, rating })} />
        <div className="mt-2">
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {editingReview ? (
          <button
            onClick={() => handleUpdateReview(editingReview)}
            className="bg-yellow-500 text-white px-4 py-2 mt-2 rounded"
          >
            Update Review
          </button>
        ) : (
          <button
            onClick={handleSubmitReview}
            className="bg-green-500 text-white px-4 py-2 mt-2 rounded"
          >
            Submit Review
          </button>
        )}
      </div>

      <h3 className="text-xl font-bold mt-6">All Reviews</h3>
      {reviews.map((review) => (
        <div key={review._id} className="bg-white p-4 rounded shadow mt-4">
          {/* Always display review details */}
          <p>{review.text}</p>
          <p className="font-bold">Rating: {review.rating}/5</p>
          {review.image && (
            <img
              src={`http://localhost:5000${review.image}`}
              alt="Review"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
          <div className="mt-2 space-x-2">
            <button onClick={() => handleEditReview(review)} className="bg-blue-500 text-white px-3 py-1 rounded">
              Edit
            </button>
            <button onClick={() => handleDeleteReview(review._id)} className="bg-red-500 text-white px-3 py-1 rounded">
              Delete
            </button>
          </div>
          {/* If an owner response exists, display it only under this review */}
          {review.ownerResponse && (
            <div className="mt-4 bg-gray-200 p-2 rounded">
              <strong>Owner Response:</strong> {review.ownerResponse}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default RestaurantReview;
