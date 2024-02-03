const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const cookieParser = require("cookie-parser");
const { restrictUser } = require("./middleware/auth");
const urlModel = require("./models/url");
const dotenv = require("dotenv").config();
const app = express();
const port = process.env.PORT || 3000;
const auth = require("./routes/auth");
const url = require("./routes/url");

app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", restrictUser, async (req, res) => {
  let r_url;
  let clicks;
  if (req.query.s_id) {
    let s_id = req.query.s_id;
    let entry = await urlModel.findOne({ shortId: s_id });
    r_url = `http://127.0.0.1:3000/${entry.shortId}`;
    clicks = entry.visitHistory.length;
  } else {
    r_url = "";
    clicks = "";
  }
  let success = req.flash("success");
  let error = req.flash("error");
  let userData = req.user;
  res.render("index", { success, error, userData, r_url, clicks });
});
app.get("/:shortid", restrictUser, async (req, res) => {
  let s_id = req.params.shortid;
  let userData = req.user;
  let entry = await urlModel.findOneAndUpdate(
    { shortId: s_id, userId: userData.id },
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  if (!entry) return res.redirect("/");
  res.redirect(entry.redirectUrl);
});
app.use("/user", auth);
app.use("/shortener", url);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
