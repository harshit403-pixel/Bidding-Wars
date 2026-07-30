import mongoose from "mongoose";

// Auction status lifecycle: draft → upcoming → active → ended / cancelled
const AUCTION_STATUSES = ["draft", "upcoming", "active", "ended", "cancelled"] as const;
const PAYMENT_STATUSES = ["pending", "paid", "failed"] as const;

const auctionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller is required"],
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    category: {
      type: String,
      trim: true,
      default: "",
    },

    // Pricing
    startingPrice: {
      type: Number,
      required: [true, "Starting price is required"],
      min: [0, "Starting price cannot be negative"],
    },

    currentPrice: {
      type: Number,
      default: 0, // Will be set to startingPrice via pre-save hook
      min: [0, "Current price cannot be negative"],
    },

    minimumIncrement: {
      type: Number,
      default: 1,
      min: [1, "Minimum increment must be at least 1"],
    },

    // Bidding references
    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    totalBids: {
      type: Number,
      default: 0,
    },

    participantsCount: {
      type: Number,
      default: 0,
    },

    // Real-time room identifier for socket connections
    roomId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values while enforcing uniqueness on non-null
      trim: true,
    },

    // Auction lifecycle
    status: {
      type: String,
      enum: {
        values: AUCTION_STATUSES,
        message: "{VALUE} is not a valid auction status",
      },
      default: "draft",
    },

    startTime: {
      type: Date,
    },

    endTime: {
      type: Date,
    },

    endedAt: {
      type: Date,
      default: null,
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: {
        values: PAYMENT_STATUSES,
        message: "{VALUE} is not a valid payment status",
      },
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Set currentPrice to startingPrice if not explicitly provided
auctionSchema.pre("save", function () {
  if (this.isNew && this.currentPrice === 0 && this.startingPrice > 0) {
    this.currentPrice = this.startingPrice;
  }
});

// Indexes for common query patterns
auctionSchema.index({ seller: 1 });
auctionSchema.index({ status: 1 });
auctionSchema.index({ endTime: 1 });
auctionSchema.index({ status: 1, endTime: 1 }); // Compound: find active auctions ending soon

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;