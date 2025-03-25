import express from "express";
import Booking from "../models/Booking.js"; // Adjust path as needed
import { authMiddleware } from "../middleware/authMiddleware.js";
import Restaurant from "../models/Restaurant.js";
const router = express.Router();

router.get("/owner/bookings", authMiddleware, async (req, res) => {
  try {
      const ownerId = req.ownerId; // Extract ownerId from auth middleware

      // Find all restaurants owned by this owner
      const restaurants = await Restaurant.find({ ownerId });
      if (!restaurants.length) {
          return res.status(404).json({ message: "No restaurants found for this owner." });
      }

      // Extract all restaurant IDs owned by the owner
      const restaurantIds = restaurants.map((restaurant) => restaurant._id);

      // Find all bookings related to these restaurants
      const bookings = await Booking.find({ restaurantId: { $in: restaurantIds } }).populate("restaurantId").populate("userId");

      res.status(200).json(bookings);
  } catch (error) {
      console.error("Error fetching owner bookings:", error);
      res.status(500).json({ message: "Server Error: Unable to fetch bookings" });
  }
});

export default router;
