import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PayAmount = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, restaurantId, date, time, seats, amount } = location.state || {};
  console.log("Payment Page State:", location.state);
  useEffect(() => {
    if (!amount) {
      navigate("/");
    }
  }, [amount, navigate]);

  const handlePayment = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, currency: "INR" }),
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
          alert("Payment Successful!");

          // Save booking to the database
          await fetch("http://localhost:5000/api/booking/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              restaurantId,
              date,
              time,
              seats,
              amountPaid: amount,
              confirmationCode: `RES-${Date.now()}`,
              paymentId: paymentResponse.razorpay_payment_id,
            }),
          });

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold">Total Amount to Pay</h2>
        <p className="text-lg font-semibold mt-2">₹{amount}</p>
        <button 
          onClick={handlePayment} 
          className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded text-lg font-semibold"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PayAmount;
