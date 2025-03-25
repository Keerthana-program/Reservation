import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import React from "react";
import jwtDecode from "jwt-decode";
import Navbar from "../components/Navbar";
import socket from "../socket";

const RestaurantBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedSeats, setSelectedSeats] = useState(1);
  const [availableSeats, setAvailableSeats] = useState(12);

  const seatPrice = 100;
  const totalCost = selectedSeats * seatPrice;

  // Get user ID from token
  const getUserId = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      return decoded.userId;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  // Fetch seat availability on mount
  useEffect(() => {
    const fetchAvailableSeats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${id}/availability`);
        if (response.ok) {
          const data = await response.json();
          setAvailableSeats(data.availableSeats);
        }
      } catch (error) {
        console.error("Error fetching seat availability:", error);
        setAvailableSeats(12);
      }
    };

    fetchAvailableSeats();

    // Listen for real-time updates
    socket.on("availabilityUpdated", (data) => {
      if (data.restaurantId === id) {
        setAvailableSeats(data.availableSeats);
      }
    });

    return () => {
      socket.off("availabilityUpdated");
    };
  }, [id]);

  // Function to update selected seats properly
  const updateSeats = (change) => {
    setSelectedSeats((prev) => {
      let newSeats = prev + change;
      if (newSeats < 1) newSeats = 1;
      if (newSeats > availableSeats) newSeats = availableSeats; // ✅ Prevent selecting more than available
      return newSeats;
    });
  };

  const handlePayment = async () => {
    const userId = getUserId();
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Create Razorpay Order
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalCost, currency: "INR" }),
      });

      const order = await response.json();

      const options = {
        key: "rzp_test_8RoXSNWQDmFeNS",
        amount: order.amount,
        currency: order.currency,
        name: "Restaurant Booking",
        description: "Payment for reservation",
        order_id: order.id,
        handler: async function (paymentResponse) {
          alert("Payment Successful! 🎉");

          // Save booking after successful payment
          const confirmationCode = `RES-${Date.now()}`;
          const bookingResponse = await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
              userId,
              restaurantId: id,
              date,
              time,
              seats: selectedSeats,
              amountPaid: totalCost,
              confirmationCode,
              paymentId: paymentResponse.razorpay_payment_id,
            }),
          });

          const bookingData = await bookingResponse.json();
          if (!bookingResponse.ok) throw new Error(bookingData.message || "Booking failed");

          alert("Booking Confirmed! ✅");
          navigate("/success");
        },
        theme: { color: "#F37254" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed!");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-center">Reserve Your Seat</h2>

          <label className="block mt-4 font-semibold">Select Date:</label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)} 
            className="border p-2 w-full rounded" 
          />

          <label className="block mt-4 font-semibold">Select Time:</label>
          <input 
            type="time" 
            value={time} 
            onChange={(e) => setTime(e.target.value)} 
            className="border p-2 w-full rounded" 
          />

          <label className="block mt-4 font-semibold">Number of Seats:</label>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => updateSeats(-1)} 
              className="bg-red-500 text-white px-3 py-1 rounded"
              disabled={selectedSeats <= 1}
            >
              -
            </button>
            <span className="text-lg">{selectedSeats}</span>
            <button 
              onClick={() => updateSeats(1)} 
              className="bg-green-500 text-white px-3 py-1 rounded"
              disabled={selectedSeats >= availableSeats}
            >
              +
            </button>
          </div>

          <p className="mt-2 text-red-500">Available Seats: {availableSeats}</p>
          <p className="mt-2 text-green-600">Total Cost: ₹{totalCost}</p>

          <button 
            onClick={handlePayment} 
            className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded text-lg font-semibold"
          >
            Proceed to Pay
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantBooking;
