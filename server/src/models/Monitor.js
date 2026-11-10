import mongoose from "mongoose";

const monitorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: [true, "Monitor name is required"],
      trim: true,
      maxlength: 100,
    },

    url: {
      type: String,
      required: [true, "Url is required"],
      trim: true,
    },

    intervalMinutes: {
      type: Number,
      enum: [1, 5, 10, 15],
      default: 5,
    },

    status: {
      type: String,
      enum: ["active", "paused"],
      default: "paused",
    },

    currentStatus : {
        type : String,
        enum : ["pending" , "up", "down" ],
        default : "pending",
    },

    lastCheckedAt: {
      type: Date,
      default: null,
    },

    consecutiveFailures: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// find the user and sort the monitors in ascending order
monitorSchema.index({user : 1, createdAt : -1});

const Monitor = mongoose.model("Monitor" , monitorSchema);

export default Monitor;
