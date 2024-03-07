const express = require("express");
const router = express.Router();
const restrictAdmin = require("./../middleware/admin");
const { addParty, index, deleteParty, editParty, addCandidate, allCandidate, deleteCandidate, editCandidate, getCandidates } = require("./../controllers/adminController");

router.get("/", restrictAdmin, index);

router.get("/add-party", restrictAdmin, (req, res) => {
    res.render("admin/addParty", {
        userData: req.user,
    });
});

router.post("/add-party", restrictAdmin, addParty);

router.delete("/delete", restrictAdmin, deleteParty);

router.get("/edit/:id", restrictAdmin, editParty);

router.post("/edit/:id", restrictAdmin, editParty);

router.get("/add-candidate", restrictAdmin, addCandidate);

router.post("/add-candidate", restrictAdmin, addCandidate);

router.get("/all-candidate", restrictAdmin, allCandidate);

router.delete("/delete-candidate", restrictAdmin, deleteCandidate);

router.get("/edit-candidate/:id", restrictAdmin, editCandidate);

router.post("/edit-candidate/:id", restrictAdmin, editCandidate);

router.get("/candidates", restrictAdmin, getCandidates);

module.exports = router;
