const express = require("express");
const router = express.Router();
const task = require("./../models/task");

router.post("/", async (req, res) => {
  try {
    let data = req.body;
    if (data.add) {
      if (data.title != "" && data.desc != "") {
        const newTask = new task(data);
        let response = await newTask.save();
        var success = "Task Added!";
      } else {
        var error = "Please fill all the required fields!";
      }
    }
    if (success) {
      req.flash("success", success);
      res.redirect(`/`);
    }
    if (error) {
      req.flash("error", error);
      res.redirect(`/`);
    }
  } catch (err) {
    console.log(err);
    res.status(404).json("internal server error");
  }
});

module.exports = router;
