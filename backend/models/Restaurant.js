import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid"; 
const restaurantSchema = new mongoose.Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
  restaurantId: { type: String, unique: true, default: () => `REST-${uuidv4()}` },
  name: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  cuisine: { type: String, required: true, trim: true },
  features: { type: [String], required: true, default: [] },
  hours: { type: String, required: true, trim: true },
  menu: [ {
    name: { type: String, required: true }, // ✅ Ensure menu item name is required
    price: { type: String, required: true },
  },],
  images: { type: [String], default: [] }, // Ensuring default empty array
}, { timestamps: true }); // Adds createdAt & updatedAt fields

const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export default Restaurant;
