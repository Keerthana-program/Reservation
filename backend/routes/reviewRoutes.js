import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import multer from "multer";
import Review from "../models/Review.js";

const router = express.Router();

// ✅ File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// ✅ Add a new review (Users can submit reviews)
router.post("/:id/reviews", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    console.log("Decoded User ID:", req.userId); // Debugging

    if (!req.userId) {
      return res.status(401).json({ message: "Unauthorized: User ID missing." });
    }

    const { text, rating } = req.body;
    const restaurantId = req.params.id;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newReview = new Review({
      text,
      rating,
      restaurantId,
      userId: req.userId, // ✅ Corrected field name
      image: imagePath,
    });

    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).json({ message: "Server error while saving review" });
  }
});


// ✅ Get all reviews for a restaurant
router.get("/:id/reviews", async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.id }).populate("userId", "name"); // ✅ Changed from ownerId to userId
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews", error });
  }
});

// ✅ Delete a review (Only the review author can delete)
router.delete("/:restaurantId/reviews/:reviewId", authMiddleware, async (req, res) => {
  try {
    const { reviewId } = req.params;

    const deletedReview = await Review.findOneAndDelete({ _id: reviewId, userId: req.userId }); // ✅ Changed from ownerId to userId

    if (!deletedReview) {
      return res.status(403).json({ message: "Unauthorized or review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting review", error });
  }
});

// ✅ Update a review (Only the review author can update)
router.put("/:restaurantId/reviews/:reviewId", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { text, rating } = req.body;
    const { reviewId } = req.params;

    const updateData = { text, rating };
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedReview = await Review.findOneAndUpdate(
      { _id: reviewId, userId: req.userId }, // ✅ Changed from ownerId to userId
      updateData,
      { new: true }
    );

    if (!updatedReview) {
      return res.status(403).json({ message: "Unauthorized or review not found" });
    }

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: "Error updating review", error });
  }
});

export default router;
