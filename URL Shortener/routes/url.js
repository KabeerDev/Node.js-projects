const express = require("express");
const { shortUrl } = require("./../controllers/urlController");
const router = express.Router();

router.post("/", shortUrl);

module.exports = router;
