import express from "express";
import multer from "multer";
import Restaurant from "../models/Restaurant.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import mongoose from 'mongoose';

const router = express.Router();

// Configure multer (file upload middleware)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Upload route
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
  }
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});


router.post("/add", authMiddleware, async (req, res) => {
  console.log("📥 Received Data:", JSON.stringify(req.body, null, 2)); // Log request body
  console.log("🔑 Owner ID from Token:", req.ownerId); // Log owner ID from auth middleware

  if (!req.ownerId) {
    return res.status(403).json({ error: "Unauthorized: Owner ID missing" });
  }

  try {
    const { name, location, contact, cuisine, features, hours, menu, images } = req.body;

    // Validate required fields
    if (!name || !location || !menu || menu.length === 0) {
      return res.status(400).json({ error: "Missing required fields: name, location, or menu" });
    }

    // Ensure menu items have names
    const formattedMenu = menu.map(item => ({
      name: item.name?.trim() || "Unknown Dish",
      price: item.price?.trim() || "0",
    }));

    // Create new restaurant
    const newRestaurant = new Restaurant({
      ownerId: req.ownerId, // Assign owner ID from token
      name,
      location,
      contact,
      cuisine,
      features,
      hours,
      menu: formattedMenu,
      images,
    });

    await newRestaurant.save();
    res.status(201).json({ message: "✅ Restaurant added successfully", restaurant: newRestaurant });
    console.log("🔑 Owner ID from Token:", req.ownerId);

  } catch (error) {
    console.error("❌ Error adding restaurant:", error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Get restaurants added by the logged-in owner
router.get("/owner", authMiddleware, async (req, res) => {
  try {
    const ownerId = req.ownerId; // Extract from middleware
    console.log("Fetching restaurants for owner:", ownerId);

    const restaurants = await Restaurant.find({ ownerId });
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const restaurantId = req.params.id;
    console.log("Deleting restaurant:", restaurantId);

    const restaurant = await Restaurant.findOneAndDelete({
      _id: restaurantId,
      ownerId: req.ownerId,
    });

    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found or unauthorized" });
    }

    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({ error: "Error deleting restaurant" });
  }
});


// NEW: Get all restaurants (public endpoint for users)
router.get("/all", async (req, res) => {
  try {
    const restaurants = await Restaurant.find({});
    res.json(restaurants);
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ error: "Error fetching restaurants" });
  }
});

// NEW: Get restaurant details by id (public endpoint)
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid restaurant ID" });
  }

  try {
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found" });
    }
    res.json(restaurant);
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    res.status(500).json({ error: "Error fetching restaurant" });
  }
});

export default router;
