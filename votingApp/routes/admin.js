const express = require("express");
const router = express.Router();
const multer = require('multer');
const restrictAdmin = require("./../middleware/admin");
const { addParty, index, deleteParty, editParty, addCandidate, allCandidate, deleteCandidate, editCandidate, getCandidates, getParties } = require("./../controllers/adminController");

router.get("/", restrictAdmin, index);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/p_flag_image/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/add-party", restrictAdmin, (req, res) => {
    res.render("admin/addParty", {
        userData: req.user,
    });
});

router.post("/add-party", restrictAdmin, upload.single('p_flag'), addParty);

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

router.get("/parties", restrictAdmin, getParties);

module.exports = router;
