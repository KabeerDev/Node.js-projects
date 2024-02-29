const express = require("express");
const router = express.Router();
const restrictAdmin = require("./../middleware/admin");

router.get("/", restrictAdmin, (req, res) => {
    res.render("admin/home", {
        userData: req.user,
    });
});

router.get("/add-party", restrictAdmin, (req, res) => {
    res.render("admin/addParty", {
        userData: req.user,
    });
});

module.exports = router;
