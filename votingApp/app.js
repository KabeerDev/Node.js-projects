const conn = require("./config");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const signup = require("./route/user");
const dotenv = require("dotenv").config();

app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("hello world!");
});

app.use("/", signup);

app.listen(port, () => {
  console.log(`port started on ${port}`);
});
