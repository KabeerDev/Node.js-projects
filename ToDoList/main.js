const conn = require("./config");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const env = require("dotenv");
const todo = require("./models/todo");

env.config();
let m_ware = (req, res, next) => {
  if (req.session.auth) {
    res.redirect("/");
  } else {
    next();
  }
};
let m_ware2 = (req, res, next) => {
  if (!req.session.auth) {
    req.flash("error", "Please Login First!");
    res.redirect("/login");
  } else {
    next();
  }
};

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 86400000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

let calculateTime = (time) => {
  let createdAt = new Date(time);
  let currentDate = new Date();

  const timeDiffrence = currentDate - createdAt;

  let seconds = Math.floor(timeDiffrence / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);
  let weeks = Math.floor(days / 7);
  let months = Math.floor(weeks / 4.2);
  let years = Math.floor(months / 12);

  if (years > 0) {
    return years + ` year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return months + ` month${months > 1 ? "s" : ""} ago`;
  } else if (weeks > 0) {
    return weeks + ` week${weeks > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return days + ` day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return hours + ` hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return minutes + ` minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return seconds + ` second${seconds > 1 ? "s" : ""} ago`;
  }
};

app.get("/", m_ware2, async (req, res) => {
  let todos = await todo.find({ user_id: req.session.auth._id }).lean();

  res.render("index", {
    success: req.flash("success"),
    error: req.flash("error"),
    auth: req.session.auth,
    todos: todos,
    calculateTime: calculateTime,
  });
});

const signup = require("./routes/signup");
const login = require("./routes/login");
const logout = require("./routes/logout");
const add = require("./routes/addtodo");
const edit = require("./routes/edit");
const del = require("./routes/delete");
const done = require("./routes/complete");

app.use("/signup", m_ware, signup);
app.use("/login", m_ware, login);
app.use("/logout", logout);
app.use("/add", add);
app.use("/edit", edit);
app.use("/delete", del);
app.use("/done", done);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
