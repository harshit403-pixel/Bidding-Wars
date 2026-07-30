// importing modules
import mongoose from "mongoose";
import PAYMENT_STATUSES from "../constants/payment.constant.js";

// Defining the Payment schema
const paymentSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "Auction reference is required"],
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Winner reference is required"],
    },

    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Payment amount cannot be negative"],
    },

    // Payment gateway details
    provider: {
      type: String,
      trim: true,
      default: "",
    },

    providerOrderId: {
      type: String,
      trim: true,
      default: "",
    },

    providerPaymentId: {
      type: String,
      trim: true,
      default: "",
    },

    providerSignature: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
    },

    paidAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for payment lookups
paymentSchema.index({ auction: 1 });
paymentSchema.index({ winner: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ providerOrderId: 1 }); // Quick lookup by provider order ID during webhook verification

// Creating the Payment model
const Payment = mongoose.model("Payment", paymentSchema);

// Exporting the Payment model
export default Payment;
