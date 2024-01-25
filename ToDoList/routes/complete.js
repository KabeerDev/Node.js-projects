const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todo = require("./../models/todo");

router.get("/", async (req, res) => {
  try {
    let id = req.params.id;
    let update = await todo.findOneAndUpdate(
      { id: id },
      { $set: { status: 1 } }
    );
    if (update) {
      var success = "Todo Completed!";
    } else {
      var error = "Something went wrong. Please try again!";
    }

    if (success) {
      req.flash("success", success);
      res.redirect("/");
    }
    if (error) {
      req.flash("error", error);
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
