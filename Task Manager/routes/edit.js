const express = require("express");
const router = express.Router();
let task = require("./../models/task");

router.post("/", async (req, res) => {
  try {
    let id = req.body.id;
    let updatedData = {
      title: req.body.title,
      desc: req.body.desc,
    };
    let updateData = await task.findByIdAndUpdate({ _id: id }, updatedData);
    if (!updateData) {
      req.flash("err", "Something went wrong!");
      res.status(404).json({ error: "Something went wrong!" });
    } else {
      req.flash("success", "Task Updated!");
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Internal server error" });
  }
});

module.exports = router;
