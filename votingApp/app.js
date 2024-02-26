const conn = require("./config");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./routes/user");
const dotenv = require("dotenv").config();
const { checkUser } = require("./middleware/checkUser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", checkUser, (req, res) => {
  res.render("index", {
    userData: req.user
  });
});

app.use("/", auth);

app.listen(port, () => {
  console.log(`port started on ${port}`);
});
