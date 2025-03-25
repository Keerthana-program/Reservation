import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant", required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    seats: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    confirmationCode: { type: String, required: true },
    availableSeatsAfterBooking: { type: Number, required: true } // ✅ Store available seats after each booking
  },
  { timestamps: true }
);

export default mongoose.model("Booking", BookingSchema);
