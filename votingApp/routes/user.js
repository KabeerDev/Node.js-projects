const express = require("express");
const router = express.Router();
const multer = require('multer');
const { handleSignup, handleLogin, handleLogout, changePass } = require("../controllers/authController");
const { checkUser, restrictUser } = require("./../middleware/checkUser");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/p_img/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.post("/signup", upload.single('p_img'), handleSignup);

router.get("/login", (req, res) => {
  return res.render("login");
});

router.post("/login", handleLogin);

router.get("/logout", handleLogout);

router.get("/change-password", [checkUser, restrictUser], (req, res) => {
  return res.render("changePassword", { userData: req.user });
});

router.post("/change-password", changePass);

module.exports = router;
