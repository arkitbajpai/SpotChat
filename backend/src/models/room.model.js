import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

/* 🔥 REQUIRED INDEXES 🔥 */

// Geo index for $near queries
roomSchema.index({ location: "2dsphere" });

// TTL auto-delete index
roomSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Room = mongoose.model("Room", roomSchema);
