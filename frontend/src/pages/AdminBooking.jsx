import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/bookings", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-500 mb-4">Booking Details</h1>

      <button 
        className="bg-gray-500 text-white px-4 py-2 mb-4 rounded hover:bg-gray-700"
        onClick={() => navigate(-1)}
      >
        ⬅ Back to Admin Dashboard
      </button>

      {loading && <p>Loading bookings...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && bookings.length === 0 && <p>No bookings found.</p>}

      {!loading && !error && bookings.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 px-4 py-2">User</th>
                <th className="border border-gray-300 px-4 py-2">Restaurant</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Time</th>
                <th className="border border-gray-300 px-4 py-2">Seats</th>
                <th className="border border-gray-300 px-4 py-2">Amount Paid</th>
                <th className="border border-gray-300 px-4 py-2">Confirmation Code</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{booking.userId?.name || "Unknown"}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.restaurantId?.name || "Unknown"}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.date}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.time}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.seats}</td>
                  <td className="border border-gray-300 px-4 py-2">${booking.amountPaid}</td>
                  <td className="border border-gray-300 px-4 py-2">{booking.confirmationCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminBooking;
