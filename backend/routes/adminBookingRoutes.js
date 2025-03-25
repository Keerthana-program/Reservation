import express from "express";
import Booking from "../models/Booking.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ GET All Bookings (Admin Only)
router.get("/", authMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("userId", "name email") // Get user details
            .populate("restaurantId", "name location"); // Get restaurant details

        if (!bookings.length) {
            return res.status(404).json({ message: "No bookings found" });
        }

        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

export default router;
