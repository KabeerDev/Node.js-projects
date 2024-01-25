const express = require("express");
const router = express.Router();
const user = require("./../models/user");

router.get("/", (req, res) => {
  res.render("login", {
    error: req.flash("error"),
    auth: req.session.auth,
  });
});
router.post("/", async (req, res) => {
  try {
    let username = req.body.u_name;
    let pass = req.body.u_pass;

    if (username != "" && pass != "") {
      let data = {
        username: username,
        password: pass,
      };
      let userData = await user.find(data).lean();
      if (userData.length > 0) {
        req.session.auth = userData[0];
        var success = "User Logged in!";
      } else {
        var error = "User don't exist!";
      }
    } else {
      var error = "Please fill all the fields!";
    }

    if (success) {
      req.flash("success", success);
      res.redirect("/");
    }

    if (error) {
      req.flash("error", error);
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
