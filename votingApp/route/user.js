const express = require("express");
const router = express.Router();
const { handleSignup, handleLogin, handleLogout } = require("./../controller/authController")

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", handleSignup);

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/login", handleLogin);

router.get("/logout", handleLogout)

module.exports = router;
