import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import Restaurant from "../models/Restaurant.js";
import Review from "../models/Review.js";

const router = express.Router();

// GET reviews for restaurants owned by the logged-in owner
router.get("/reviews", authMiddleware, async (req, res) => {
  try {
    // Find all restaurants for this owner
    const ownerRestaurants = await Restaurant.find({ ownerId: req.ownerId });
    // Get their IDs
    const restaurantIds = ownerRestaurants.map((restaurant) => restaurant._id);
    
    // Find reviews for any of these restaurants
    const reviews = await Review.find({ restaurantId: { $in: restaurantIds } });
    
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching owner reviews:", error);
    res.status(500).json({ message: "Error fetching owner reviews", error });
  }
});

// Endpoint for owner to respond to a review
router.put("/reviews/:reviewId/respond", authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    
    if (!response) {
      return res.status(400).json({ message: "Response text is required" });
    }
    
    // Find the review by its ID
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    
    // Find the restaurant for this review
    const restaurant = await Restaurant.findById(review.restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found for this review" });
    }
    
    // Ensure the logged-in owner is the owner of the restaurant
    if (restaurant.ownerId.toString() !== req.ownerId.toString()) {
      return res.status(403).json({ message: "You are not authorized to respond to this review" });
    }
    
    // Update the review with the owner's response
    review.ownerResponse = response;
    await review.save();
    
    res.json(review);
  } catch (error) {
    console.error("Error responding to review:", error);
    res.status(500).json({ message: "Error responding to review", error });
  }
});

export default router;
