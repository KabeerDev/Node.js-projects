const express = require("express");
const router = express.Router();
let task = require("./../models/task");

router.get("/", async (req, res) => {
  try {
    let data = {
      status: 1,
    };
    let tasks = task.find(data).lean();
    let comp_tasks = await task.find(data);
    let pageNum = Number(req.query.page) || 1;
    let limit = 5;
    let skip = (pageNum - 1) * limit;
    let totalPages = Math.ceil(comp_tasks.length / limit);
    tasks = await tasks.skip(skip).limit(limit).exec();

    res.render("completed", {
      totalPages: totalPages,
      pageNum: pageNum,
      tasks: tasks,
      skip: skip,
    });
  } catch (err) {
    res.status(404).json({ error: "Internal server error!" });
  }
});

module.exports = router;
