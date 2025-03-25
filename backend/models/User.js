import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Add `unique: true`
  password: { type: String, required: true },
  type: { type: String, enum: ["user", "owner"], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, default: null },
  ownerId: { type: mongoose.Schema.Types.ObjectId, default: null },
});

const User = mongoose.model("User", userSchema);
export default User;
