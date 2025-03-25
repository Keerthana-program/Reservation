import express from "express";
import Review from "../models/Review.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET All Reviews (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate("restaurantId", "name") // Get restaurant name
            .populate("userId", "name email"); // Get reviewer info

        if (!reviews.length) {
            return res.status(404).json({ message: "No reviews found" });
        }

        res.status(200).json(reviews);
    } catch (error) {
        console.error("Error fetching reviews:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
