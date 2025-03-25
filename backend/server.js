import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import bodyParser from "body-parser";
import multer from "multer";
import Review from "./models/Review.js";
import ownerReviewRoutes from "./routes/ownerReviewRoutes.js"; 
import Restaurant from "./models/Restaurant.js";
import {authMiddleware}   from "./middleware/authMiddleware.js";
import paymentRoutes from"./routes/paymentRoutes.js";
import Razorpay from "razorpay";
import reviewRoutes from "./routes/reviewRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import Booking from "./models/Booking.js";
import ownerBookingsRoutes from "./routes/ownerBookingsRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import http from "http";
import { Server } from "socket.io";
import adminRestaurantRoutes from "./routes/adminRestaurantRoutes.js";
import adminReviewRoutes from "./routes/adminReviewRoutes.js";
import adminBookingRoutes from "./routes/adminBookingRoutes.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:5173"], // Allow frontend to connect
    methods: ["GET", "POST"]
  },
});
app.use(express.json()); // Middleware to parse JSON
app.use(cors({ origin: ["http://localhost:3000", "http://localhost:5173"], credentials: true }));




 // Enable CORS
app.use("/api/auth", authRoutes);
app.use("/uploads", express.static("uploads")); 
app.use("/api/restaurants", restaurantRoutes);
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/owners", ownerReviewRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/restaurants", reviewRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/owner", ownerReviewRoutes);
app.use("/api/owners", ownerBookingsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/restaurants", adminRestaurantRoutes);
app.use("/api/admin/reviews", adminReviewRoutes);
app.use("/api/admin/bookings", adminBookingRoutes);

// Listen for client connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id );

  socket.on("disconnect", () => {
    console.log("A user disconnected:",socket.id);
  });
});
// Configure multer for image uploads
// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  }
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,  // Use environment variables
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


app.get('/restaurant/:id', async (req, res) => {
  const { id } = req.params;

  // Check if id is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid restaurant ID" });
  }

  try {
      const restaurant = await Restaurant.findById(id);
      if (!restaurant) {
          return res.status(404).json({ error: "Restaurant not found" });
      }
      res.json(restaurant);
  } catch (error) {
      res.status(500).json({ error: "Error fetching restaurant" });
  }
});

app.post("/api/restaurants/add", authMiddleware, async (req, res) => {
  try {
      const { ownerId, name, location, contact, cuisine, features, hours, menu, images } = req.body;

      if (!req.ownerId || req.ownerId !== ownerId) {
          return res.status(403).json({ message: "Unauthorized: Invalid Owner ID" });
      }

      // ✅ Save restaurant to DB (mock response here)
      res.status(201).json({ message: "Restaurant added successfully!", data: req.body });
  } catch (error) {
      res.status(500).json({ message: "Server Error", error: error.message });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const { userId, restaurantId, date, time, seats, amountPaid, confirmationCode } = req.body;
    console.log("Received Booking Data:", req.body); // Debugging
    const newBooking = new Booking({
      userId,
      restaurantId,
      date,
      time,
      seats,
      amountPaid,
      confirmationCode,
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking); // ✅ Ensure _id is returned
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

app.get("/api/bookings/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    console.log("Fetching bookings for user:", userId); // Debugging

    const userBookings = await Booking.find({ userId }).populate("restaurantId");
    if (!userBookings.length) {
      return res.status(404).json({ message: "No bookings found" });
    }

    res.json(userBookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Error fetching bookings" });
  }
});
// Payment Route
app.post("/api/payment", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    const options = {
      amount: amount * 100, // Razorpay uses paise (1 INR = 100 paise)
      currency,
      receipt: `order_rcptid_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
});



app.get("/bookings", async (req, res) => {
  try {
    const { userId } = req.query; // Or req.params, req.body depending on where it's coming from

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    const bookings = await Booking.find({ userId });
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/api/userAvailability/:userId/availability', (req, res) => {
  const { userId } = req.params;
  // Fetch availability from database
  res.json({ userId, availability: true }); // Dummy response
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Export io for use in bookingRoutes
export { io };