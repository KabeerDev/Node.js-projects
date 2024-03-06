const express = require("express");
const router = express.Router();
const restrictAdmin = require("./../middleware/admin");
const { addParty, index, deleteParty } = require("./../controllers/adminController");

router.get("/", restrictAdmin, index);

router.get("/add-party", restrictAdmin, (req, res) => {
    res.render("admin/addParty", {
        userData: req.user,
    });
});

router.post("/add-party", restrictAdmin, addParty);

router.delete("/delete", restrictAdmin, deleteParty);

module.exports = router;
