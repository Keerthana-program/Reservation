import express from "express";
import Restaurant from "../models/Restaurant.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET All Restaurants (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const restaurants = await Restaurant.find({}, "name location contact cuisine ownerId");

        if (!restaurants.length) {
            return res.status(404).json({ message: "No restaurants found" });
        }

        res.status(200).json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
