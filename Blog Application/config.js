const mongoose = require("mongoose");
const url = process.env.DB_URL || "mongodb://localhost:27017/blog";
mongoose.connect(url);
const db = mongoose.connection;

db.on("connected", () => {
  console.log("Connected to db!");
});

module.exports = db;
