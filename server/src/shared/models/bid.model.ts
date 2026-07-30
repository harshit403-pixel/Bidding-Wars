// Importing modules
import mongoose from "mongoose";

// Defining the Bid schema
const bidSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "Auction reference is required"],
    },

    bidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Bidder reference is required"],
    },

    amount: {
      type: Number,
      required: [true, "Bid amount is required"],
      min: [0, "Bid amount cannot be negative"],
    },

    isWinningBid: {
      type: Boolean,
      default: false,
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for common query patterns
bidSchema.index({ auction: 1 });
bidSchema.index({ bidder: 1 });
bidSchema.index({ amount: -1 }); // Descending for "highest bid" lookups
bidSchema.index({ auction: 1, amount: -1 }); // Compound: highest bid per auction

// Creating the Bid model
const Bid = mongoose.model("Bid", bidSchema);

export default Bid;
