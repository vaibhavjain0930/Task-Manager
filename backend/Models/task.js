const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    project: {
      type: mongoose.Types.ObjectId,
      ref: "project",
    },
    assignedTo: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "completed"],
      default: "todo",
    },
    dueDate: {
      type: Date,
    },
    important: {
      type: Boolean,
      default: false,
    },
    complete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("task", taskSchema);
