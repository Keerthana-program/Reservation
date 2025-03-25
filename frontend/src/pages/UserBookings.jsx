import { useState, useEffect } from "react";
import NavBarOwner from "../components/NavBarOwner";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/owners/owner/bookings", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const data = await response.json();
      console.log("Bookings Data:", data); // Debugging

      if (data.message) {
        setBookings([]); // If no bookings, set empty
      } else {
        setBookings(data);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  return (
    <div>
      <NavBarOwner />
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Bookings for Your Restaurants</h2>

        {bookings.length > 0 ? (
          bookings.map((booking) => (
            <div key={booking._id} className="border border-gray-300 shadow-md rounded-lg p-4 mb-4">
              {/* Restaurant Name with Blue Background */}
              <h3 className="bg-blue-500 text-white font-semibold text-lg p-2 rounded-t-md">
                {booking.restaurantId.name}
              </h3>
              
              {/* Booking Details */}
              <div className="p-4">
                <p className="text-gray-700"><strong>Date:</strong> {booking.date}</p>
                <p className="text-gray-700"><strong>Time:</strong> {booking.time}</p>
                <p className="text-gray-700"><strong>Seats:</strong> {booking.seats}</p>
                <p className="text-gray-700"><strong>Amount Paid:</strong> ₹{booking.amountPaid}</p>
                <p className="text-gray-700"><strong>Confirmation Code:</strong> {booking.confirmationCode}</p>
              </div>
            </div>
          ))
        ) : (
          <p>No bookings found</p>
        )}
      </div>
    </div>
  );
};

export default OwnerBookings;
