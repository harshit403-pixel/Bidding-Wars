import mongoose from "mongoose";

const auctionSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },

    description: {
      type: String,
      required: true,
      minlength: 20,
      maxlength: 2000,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Fashion",
        "Home",
        "Books",
        "Sports",
        "Vehicles",
        "Collectibles",
        "Others",
      ],
    },

    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
      default: "Good",
    },

    images: [
      {
        type: String,
      },
    ],

    startingBid: {
      type: Number,
      required: true,
      min: 1,
    },

    currentBid: {
      type: Number,
      default: 0,
    },

    minimumIncrement: {
      type: Number,
      default: 10,
    },

    status: {
      type: String,
      enum: ["draft", "upcoming", "active", "ended", "cancelled"],
      default: "draft",
    },

    startsAt: {
      type: Date,
      required: true,
    },

    endsAt: {
      type: Date,
      required: true,
    },

    highestBidder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    totalBids: {
      type: Number,
      default: 0,
    },

    spectators: {
      type: Number,
      default: 0,
    },

    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Auction = mongoose.model("Auction", auctionSchema);

export default Auction;