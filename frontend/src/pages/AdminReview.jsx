import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminReview = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/reviews", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }

        const data = await response.json();
        setReviews(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Review Details</h1>

      <button 
        className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        ⬅ Back to Admin Dashboard
      </button>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reviews.length === 0 && <p>No reviews found.</p>}

      {!loading && !error && reviews.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Rating</th>
                <th className="border border-gray-300 px-4 py-2">Review</th>
                <th className="border border-gray-300 px-4 py-2">Owner Response</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{review.restaurantId?.name || "Unknown"}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.userId?.name || "Anonymous"}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.rating} ⭐</td>
                  <td className="border border-gray-300 px-4 py-2">{review.text}</td>
                  <td className="border border-gray-300 px-4 py-2">{review.ownerResponse || "No response yet"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReview;
