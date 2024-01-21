const express = require("express");
const router = express.Router();
let task = require("./../models/task");

router.get("/", async (req, res) => {
  try {
    let id = req.query.id;
    let updateStatus = await task.findByIdAndUpdate({ _id: id }, { status: 1 });
    if (!updateStatus) {
      req.flash("err", "Something went wrong!");
      res.status(404).json({ error: "Something went wrong!" });
    } else {
      req.flash("success", "Hurry! Task Done");
    }
    res.redirect("/");
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Internal server error" });
  }
});

module.exports = router;
