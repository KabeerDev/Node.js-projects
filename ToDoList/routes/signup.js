const express = require("express");
const router = express.Router();
const user = require("./../models/user");

router.get("/", (req, res) => {
  res.render("signup", {
    error: req.flash("error"),
    auth: req.session.auth,
  });
});
router.post("/", async (req, res) => {
  try {
    let username = req.body.u_name;
    let email = req.body.u_email;
    let pass = req.body.u_pass;
    let c_pass = req.body.c_pass;

    if (username != "" && email != "" && pass != "" && c_pass != "") {
      if (pass === c_pass) {
        if (pass.length >= 4 && pass.length <= 12) {
          let checkUsername = await user.find({ username: username }).lean();
          if (checkUsername.length == 0) {
            let checkEmail = await user.find({ username: email }).lean();
            if (checkEmail.length == 0) {
              let newUser = new user({
                username: username,
                email: email,
                password: pass,
              });
              let saveUser = await newUser.save();
              if (saveUser) {
                req.session.auth = newUser;
                var success = "User Signed up!";
              } else {
                var error = "Something went wrong, please try again!";
              }
            } else {
              var error = "Email already exist!";
            }
          } else {
            var error = "Username already exist!";
          }
        } else {
          var error = "Password can contain 4to12 characters!";
        }
      } else {
        var error = "Password do not match!";
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
      res.redirect("/signup");
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error!" });
  }
});

module.exports = router;
