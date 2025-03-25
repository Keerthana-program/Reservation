import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import OwnerDashboard from "./pages/OwnerDashboard";
import UserDashboard from "./pages/UserDashboard";
import AddRestaurants from "./pages/AddRestaurants";
import OwnerProfile from "./pages/OwnerProfile";
import OwnerReviews from "./pages/OwnerReviews";
import RestaurantDetails from "./pages/RestaurantDetails";
import UserProfile from "./pages/UserProfile";
import RestaurantReview from "./pages/RestaurantReview";
import RestaurantBooking from "./pages/RestaurantBooking";
import PayAmount from "./pages/PayAmount";
import Pay from "./pages/Pay";
import UserBookings from "./pages/UserBookings"; 
import AdminDashboard from "./pages/AdminDashboard";
import AdminUser from "./pages/AdminUser";
import AdminRestaurant from "./pages/AdminRestaurant";
import { useEffect } from "react";
import socket from "./socket"; 
import AdminReview from "./pages/AdminReview";
import AdminBooking from "./pages/AdminBooking";

export default function App() {
  useEffect(() => {
    // Listen for connection
    socket.on("connect", () => {
      console.log("Connected to server with ID:", socket.id);
    });

    // Handle disconnect
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => {
      socket.disconnect(); // Cleanup on unmount
    };
  console.log("Check console for Socket.io logs!");
  }, []);
  
  return (
   
    <BrowserRouter>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/owner-dashboard" element={<OwnerDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/add-restaurants" element={<AddRestaurants />} />
        <Route path="/owner-profile" element={<OwnerProfile />} />
        <Route path="/owner-reviews" element={<OwnerReviews />} />
        <Route path="//admin-dashboard"element={<AdminDashboard/>}/>
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
        <Route path="/user-profile" element={<UserProfile/>}/>
        <Route path="/restaurant/:id/review" element={<RestaurantReview />} />
        <Route path="/restaurant/:id/booking" element={<RestaurantBooking />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantReview />} />
        <Route path="/pay-amount" element={<PayAmount/>} />
        <Route path="/user-bookings" element={<UserBookings />} />
        <Route path="/admin/users" element={<AdminUser />} />
        <Route path="/admin/restaurants" element={<AdminRestaurant />} />
        <Route path="/admin/reviews" element={<AdminReview />} />
        <Route path="/admin/bookings" element={<AdminBooking />} />
      </Routes>
    </BrowserRouter>
   
  );
}
 