const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const url = process.env.DB_URL;
mongoose.connect(url);
let db = mongoose.connection;

db.on("connected", () => {
  console.log("Successfully connected to db!");
});

module.exports = db;
