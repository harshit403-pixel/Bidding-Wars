// Imporing modules
import mongoose from "mongoose";

// Defining the ChatMessage schema
const chatMessageSchema = new mongoose.Schema(
  {
    auction: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Auction",
      required: [true, "Auction reference is required"],
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Sender reference is required"],
    },

    message: {
      type: String,
      required: [true, "Message content is required"],
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },

    // Soft delete — preserves chat history integrity
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for chat retrieval and pagination
chatMessageSchema.index({ auction: 1, createdAt: 1 }); // Chronological messages per auction room
chatMessageSchema.index({ sender: 1 });

// Creating the ChatMessage model
const ChatMessage = mongoose.model("ChatMessage", chatMessageSchema);

export default ChatMessage;
