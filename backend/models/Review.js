import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
  // Note: Ideally, the field for the review’s author should be named something like `userId`.
  // For now, we keep the original field as-is.
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  text: { type: String, required: true },
  rating: { type: Number, required: true },
  image: { type: String },
  ownerResponse: { type: String, default: "" } // New field for owner's response
});

const Review = mongoose.model("Review", ReviewSchema);
export default Review;
