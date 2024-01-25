const mongoose = require("mongoose");
const env = require("dotenv");
env.config();
const url = process.env.DB_URL;
mongoose.connect(url);
const db = mongoose.connection;
db.on("connected", () => {
  console.log("Successfully connected!");
});
db.on("disconnected", () => {
  console.log("Successfully disconnected!");
});

module.exports = db;
