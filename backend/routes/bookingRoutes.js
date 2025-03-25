import express from "express";
import Booking from "../models/Booking.js";
import { authMiddleware } from "../middleware/authMiddleware.js"; // Import middleware
import Restaurant from "../models/Restaurant.js";
import { io } from "../server.js"; 

const router = express.Router();

// Create a new booking and update seat availability
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { restaurantId, date, time, seats, amountPaid, confirmationCode } = req.body;
    const userId = req.userId; // Extracted from authMiddleware

    if (!restaurantId || !date || !time || !seats || !amountPaid || !confirmationCode) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Get the latest available seats from the last booking OR default to 12
    const lastBooking = await Booking.findOne({ restaurantId }).sort({ createdAt: -1 });
    let availableSeats = lastBooking ? lastBooking.availableSeatsAfterBooking : 12;

    if (availableSeats < seats) {
      return res.status(400).json({ error: "Not enough available seats" });
    }

    // Save the new booking with updated seat count
    const newBooking = new Booking({
      userId,
      restaurantId,
      date,
      time,
      seats,
      amountPaid,
      confirmationCode,
      availableSeatsAfterBooking: availableSeats - seats, // ✅ Store updated availability
    });

    await newBooking.save();

    // Emit real-time update
    io.emit("availabilityUpdated", {
      restaurantId,
      availableSeats: availableSeats - seats,
    });

    res.status(201).json({ message: "Booking successful", newBooking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});

// Get the latest availability for a restaurant
router.get("/:restaurantId/availability", async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // Get the latest booking to determine available seats
    const lastBooking = await Booking.findOne({ restaurantId }).sort({ createdAt: -1 });
    const availableSeats = lastBooking ? lastBooking.availableSeatsAfterBooking : 12;

    res.json({ availableSeats });
  } catch (error) {
    console.error("Error fetching availability:", error);
    res.status(500).json({ error: "Failed to fetch availability" });
  }
});

// Get bookings for the logged-in user
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId; // ✅ Extract from authMiddleware

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching bookings for userId:", userId); // ✅ Debugging log

    // Fetch bookings for the logged-in user
    const bookings = await Booking.find({ userId }).populate("restaurantId");

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});


export default router;
