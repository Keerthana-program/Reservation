import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const UserProfile = () => {
  const { user } = useAuth();  
  const [userName, setUserName] = useState(localStorage.getItem("userName") || "Guest");
  const [bookings, setBookings] = useState(null); // Default to null for better handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);

    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve token
    
        if (!token) {
          console.error("No token found");
          setLoading(false);
          return;
        }

        console.log("Fetching bookings with token:", token);

        const response = await fetch(`http://localhost:5000/api/bookings/my-bookings`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Send token in headers
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        console.log("Fetched bookings:", data);

        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message);
      } finally {
        setLoading(false); // Ensure loading stops even if there's an error
      }
    };

    fetchBookings();
  }, [user]);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    
    try {
      const token = localStorage.getItem("token"); // Ensure token is included for DELETE
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to delete booking");

      setBookings((prevBookings) => prevBookings.filter((booking) => booking._id !== bookingId));
      alert("Booking deleted successfully!");
    } catch (error) {
      console.error("Error deleting booking:", error);
      alert("Failed to delete booking. Try again.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Navbar />
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}!</h1>
      <h2 className="text-2xl font-bold mb-4">Your Booking History</h2>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      
      {!loading && !error && (!bookings || bookings.length === 0) && (
        <p>No bookings found.</p>
      )}

      {!loading && !error && bookings?.length > 0 && (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white border rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold text-blue-600">Booking Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <p><strong>Restaurant:</strong> {booking.restaurantId?.name || "N/A"}</p>
                <p><strong>Date:</strong> {booking.date}</p>
                <p><strong>Time:</strong> {booking.time}</p>
                <p><strong>Seats:</strong> {booking.seats}</p>
                <p><strong>Amount Paid:</strong> ₹{booking.amountPaid}</p>
                <p><strong>Confirmation Code:</strong> {booking.confirmationCode}</p>
              </div>

              <button 
                className="bg-red-500 text-white px-4 py-2 rounded mt-4 w-full hover:bg-red-700"
                onClick={() => handleCancelBooking(booking._id)}
              >
                Cancel Booking
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserProfile;
