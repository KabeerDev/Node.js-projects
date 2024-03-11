const mongoose = require("mongoose");

const partySchema = new mongoose.Schema({
  partyName: {
    type: String,
    required: true,
  },
  motive: {
    type: String,
    required: true,
  },
  flag: {
    type: String,
    required: true,
  },
  totalCandidates: {
    type: Number,
    default: 0,
  }
});

const party = mongoose.model("party", partySchema);
module.exports = { party };
