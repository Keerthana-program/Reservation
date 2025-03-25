import express from "express";
import { registerUser } from "../controllers/authController.js"; // Import controller
import { login } from "../controllers/authController.js";

const router = express.Router();

// Define the register route
router.post("/register", registerUser);
router.post("/login", login);

export default router;
