const express = require("express");
const router = express.Router();
const { checkUser } = require("./../middleware/checkUser");
const { vote } = require("./../controllers/voteController");

router.get("/", checkUser, vote)

router.post("/", checkUser, vote)

module.exports = router;
