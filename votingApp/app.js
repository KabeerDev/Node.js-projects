const conn = require("./config");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./routes/user");
const admin = require("./routes/admin");
const { party } = require("./model/party")
const { loadParties, partyDetail } = require("./controllers/mainController")
const dotenv = require("dotenv").config();
const { checkUser, restrictUser } = require("./middleware/checkUser");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", checkUser, async (req, res) => {
  const parties = await party.find().limit(9);

  res.render("index", {
    userData: req.user,
    parties
  });
});

app.get("/parties", checkUser, async (req, res) => {
  const parties = await party.find();

  res.render("allParties", {
    userData: req.user,
    parties
  });
});

app.get("/load-parties", checkUser, loadParties);

app.get("/party-detail/:p_id", checkUser, partyDetail);

app.use("/", auth);
app.use("/admin", admin);

app.listen(port, () => {
  console.log(`port started on ${port}`);
});
