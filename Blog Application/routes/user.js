const express = require("express");
const user = require("./../models/user");
const conn = require("./../config");
const { generateToken } = require("./../services/auth");
const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const userInfo = await user.matchPassword(email, password);
    const token = await generateToken(userInfo);

    return res.cookie("token", token).redirect("/");
  } catch (err) {
    return res.render("login", {
      error: "Invalid Credentials",
    });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/user/login");
});

router.get("/signup", (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const data = req.body;
  await user.create({
    fullname: data.fullname,
    email: data.email,
    password: data.password,
  });
  return res.redirect("/");
});

module.exports = router;
