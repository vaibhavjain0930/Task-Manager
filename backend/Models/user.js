const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "member"],
      default: "member",
    },
    tasks: [
      {
        type: mongoose.Types.ObjectId,
        ref: "task",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", userSchema);
