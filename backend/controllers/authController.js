import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";  // ✅ Import mongoose
import generateToken from "../utils/generateToken.js";
export const registerUser = async (req, res) => {
  try {
    let { name, email, password, type } = req.body;
    email = email.toLowerCase();

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate unique userId
    const userId = new mongoose.Types.ObjectId(); // ✅ Generate a unique userId for all users

    // Assign ownerId only if the user is an owner
    const ownerId = type === "owner" ? userId : null; // Owners get ownerId same as userId

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      type,
      userId,   // ✅ Assign userId
      ownerId,  // ✅ Assign ownerId if owner, otherwise null
    });

    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      userId: newUser.userId,
      ownerId: newUser.ownerId,
    });
  } catch (error) {
    console.error("Registration Error:", error);
    res.status(500).json({ message: "Error registering user", error });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials!" });
    }

    // ✅ Generate JWT token
    const token = generateToken(user);

    // ✅ Send response with user details
    res.json({
      token,
      userType: user.type,
      userId: user.userId,
      ownerId: user.ownerId || null, // Ensure ownerId is included
      name: user.name,
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Server error!" });
  }
};
