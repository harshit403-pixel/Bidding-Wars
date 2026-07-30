// Importing modules
import mongoose from "mongoose";
import TIMELINE_TYPES from "../constants/timeline.constant.js";

// Defining the Timeline schema
const timelineSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: {
        values: TIMELINE_TYPES,
        message: "{VALUE} is not a valid timeline event type",
      },
      required: [true, "Event type is required"],
    },

    message: {
      type: String,
      trim: true,
      default: "",
    },

    // Flexible payload for event-specific data (e.g. bid amount, previous price)
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fetching event history
timelineSchema.index({ auction: 1, createdAt: -1 }); // Auction timeline in reverse chronological order
timelineSchema.index({ user: 1 });
timelineSchema.index({ type: 1 });

// Creating the Timeline model
const Timeline = mongoose.model("Timeline", timelineSchema);

export default Timeline;
