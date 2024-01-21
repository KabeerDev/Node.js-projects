const mongoose = require("mongoose");
const currentDate = new Date();
const formattedDate = currentDate.toLocaleDateString("en-US", {
  day: "numeric",
  month: "numeric",
  year: "numeric",
});
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: formattedDate,
  },
});

const task = mongoose.model("tasks", taskSchema);

module.exports = task;
