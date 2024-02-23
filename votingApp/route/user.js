const user = require("./../model/user");
const { generateToken } = require("./../jwt");
const express = require("express");
const router = express.Router();

router.get("/signup", (req, res) => {
  return res.render("signup");
});
router.post("/signup", async (req, res) => {
  try {
    const data = req.body;
    const newUser = new user(data);
    const response = await newUser.save();

    const payload = {
      id: response.id,
    };
    const token = generateToken(payload);

    console.log("token is " + token);
    res.status(200).cookie("token", token).json({ success: "user Saved" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Intenal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { cnic, password } = req.body;
    const userData = await user.findOne({ cnic: cnic });

    if (!userData) return res.status(400).json({ message: "user not exist!" });

    const payload = {
      id: userData.id,
    };
    const token = generateToken(payload);

    console.log("token is " + token);
    res.status(200).cookie("token", token).json({ success: "user Logged in" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Intenal server error" });
  }
});

module.exports = router;
