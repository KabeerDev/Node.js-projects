const express = require("express");
const router = express.Router();
let task = require("./../models/task");

router.get("/", async (req, res) => {
  try {
    let search = req.query.search;
    if (search != "") {
      let tasks = task
        .find({
          $or: [
            { title: { $regex: search }, status: 0 },
            { desc: { $regex: search }, status: 0 },
          ],
        })
        .lean();
      let pen_tasks = await task.find({
        $or: [{ title: { $regex: search } }, { desc: { $regex: search } }],
      });
      let pageNum = Number(req.query.page) || 1;
      let limit = 5;
      let skip = (pageNum - 1) * limit;
      let totalPages = Math.ceil(pen_tasks.length / limit);
      tasks = await tasks.skip(skip).limit(limit).exec();

      res.render("search", {
        totalPages: totalPages,
        pageNum: pageNum,
        tasks: tasks,
        skip: skip,
        search,
      });
    } else {
      res.redirect("/");
    }
  } catch (err) {
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
