const conn = require("./config");
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const task = require("./models/task");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use("/", (req, res, next) => {
  if (Number(req.query.page) < 1) {
    res.redirect("/?page=1");
  }
  next();
});

app.get("/", async (req, res) => {
  let p_tasks = task.find({ status: 0 }).lean();
  let pen_tasks = await task.find({ status: 0 });
  let pageNum = Number(req.query.page) || 1;
  let limit = 5;
  let skip = (pageNum - 1) * limit;
  let totalPages = Math.ceil(pen_tasks.length / limit);
  p_tasks = await p_tasks.skip(skip).limit(limit).exec();

  res.render("index", {
    success: req.flash("success"),
    error: req.flash("error"),
    err: req.flash("err"),
    totalPages: totalPages,
    pageNum: pageNum,
    p_tasks: p_tasks,
    skip: skip,
  });
});

const addtask = require("./routes/addtask");
const taskDone = require("./routes/taskDone");
const deleteTask = require("./routes/deleteTask");
const editTask = require("./routes/edit");
const search = require("./routes/search");
const completed = require("./routes/completed");

app.use("/addTask", addtask);
app.use("/done", taskDone);
app.use("/delete", deleteTask);
app.use("/edit", editTask);
app.use("/search", search);
app.use("/completed", completed);

app.listen(port);
