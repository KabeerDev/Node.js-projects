const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const todo = require("./../models/todo");

router.post("/", async (req, res) => {
  try {
    let data = req.body;
    if (
      data.update != "" &&
      data.id != "" &&
      data.p_id != "" &&
      data.title != "" &&
      data.desc != ""
    ) {
      let id = data.id;
      let p_id = data.p_id;
      let title = data.title;
      let desc = data.desc;
      let u_data = await todo.findOneAndUpdate(
        { user_id: id, _id: p_id },
        { $set: { title: title, desc: desc } }
      );
      if (u_data) {
        var success = "Todo updated!";
      } else {
        var error = "Some thing went wrong. Please try agein!";
      }
    } else {
      var error = "Some feilds are missing!";
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
