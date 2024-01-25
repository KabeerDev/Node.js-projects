const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todo = require("./../models/todo");

router.post("/", async (req, res) => {
  try {
    let data = req.body;
    if (
      data.add != "" &&
      data.title != "" &&
      data.desc != "" &&
      data.id != ""
    ) {
      let title = data.title;
      let desc = data.desc;
      let id = data.id;
      let date = new Date();
      let newTodo = new todo({
        title: title,
        desc: desc,
        user_id: id,
        status: 0,
        createdat: date,
      });
      let response = await newTodo.save();
      if (!response) {
        var error = "Something went wrong, please try again!";
      } else {
        var success = "Todo was created!";
      }
    } else {
      var error = "Title or Description cannot be empty!";
    }

    if (error) {
      req.flash("error", error);
      res.redirect("/");
    }
    if (success) {
      req.flash("success", success);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
