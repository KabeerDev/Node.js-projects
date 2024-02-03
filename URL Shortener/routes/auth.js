const express = require("express");
const router = express.Router();
const {
  handleRegistrarion,
  handleLogin,
} = require("./../controllers/authController");

router.get("/login", (req, res) => {
  const error = req.flash("error");
  const success = req.flash("success");
  res.render("login", { error, success });
});
router.post("/login", handleLogin);

router.get("/register", (req, res) => {
  const error = req.flash("error");
  res.render("register", { error });
});
router.post("/register", handleRegistrarion);

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});

module.exports = router;
