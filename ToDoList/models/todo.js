const mongoose = require("mongoose");
const todoSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  createdat: {
    type: Number,
    required: true,
  },
});
const todo = mongoose.model("todo", todoSchema);

module.exports = todo;
