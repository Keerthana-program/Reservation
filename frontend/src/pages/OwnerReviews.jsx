import { useState, useEffect } from "react";
import NavBarOwner from "../components/NavBarOwner";

const OwnerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [responseText, setResponseText] = useState("");  // Input for the owner's response
  const [respondingReviewId, setRespondingReviewId] = useState(null); // Which review is being responded to

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5000/api/owners/reviews", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Server Error: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched owner reviews:", data);
      setReviews(data);
    } catch (error) {
      console.error("Error fetching owner reviews:", error);
    }
  };

  const handleRespond = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:5000/api/owners/reviews/${reviewId}/respond`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ response: responseText })
      });
      if (!response.ok) {
        throw new Error("Failed to submit response");
      }
      setResponseText("");
      setRespondingReviewId(null);
      fetchReviews(); // Refresh reviews after response
    } catch (error) {
      console.error("Error responding to review:", error);
    }
  };

  return (
    <div>
      <NavBarOwner />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Reviews for Your Restaurants</h2>
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((review) => (
              <div key={review._id} className="bg-white shadow p-4 rounded mb-4">
                <p>{review.text}</p>
                <p className="font-bold">Rating: {review.rating}/5</p>
                {review.image && (
                  <img
                    src={`http://localhost:5000${review.image}`}
                    alt="Review"
                    className="mt-2 w-20 h-20 object-cover rounded"
                  />
                )}
                {review.ownerResponse && (
                  <div className="mt-2 bg-gray-100 p-2 rounded">
                    <p>
                      <strong>Your Response:</strong> {review.ownerResponse}
                    </p>
                  </div>
                )}
                <div className="mt-2">
                  {respondingReviewId === review._id ? (
                    <div>
                      <input
                        type="text"
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        placeholder="Write your response..."
                        className="border p-2 w-full"
                      />
                      <button
                        onClick={() => handleRespond(review._id)}
                        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                      >
                        Submit Response
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRespondingReviewId(review._id)}
                      className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      Respond
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews available yet.</p>
        )}
      </div>
    </div>
  );
};

export default OwnerReviews;
