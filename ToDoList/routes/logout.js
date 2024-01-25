const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
        res.status(500).json({ error: "Internal server error!" });
      } else {
        res.redirect("/login");
      }
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
