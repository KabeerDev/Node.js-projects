const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.DB_URL_LOCAL;
// const url = process.env.DB_URL;
mongoose.connect(url);

let db = mongoose.connection;

db.on("connected", () => {
  console.log("Successfully connected to db!");
});

module.exports = db;
