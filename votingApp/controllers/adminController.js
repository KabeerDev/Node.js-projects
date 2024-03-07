const { party } = require("../model/party");
const { candidate } = require("../model/candidate");
const { user } = require("../model/user");

async function index(req, res) {
    let allParties = await party.find().lean();

    res.render("admin/home", {
        userData: req.user,
        allParties,
        s_no: 1
    });
}

async function addParty(req, res) {
    const { p_name, p_motive, id } = req.body;

    const userData = await user.findById(id);

    if (p_name == "" && p_motive == "") return res.render("admin/addParty", {
        error: "Please fill all the mandatory feilds!",
        userData
    });

    if (p_motive.length < 50) return res.render("admin/addParty", {
        error: "Party motive must be minimum 50 characters long!",
        userData
    });

    const newParty = new party({ partyName: p_name, motive: p_motive });
    const response = await newParty.save();

    if (!response) return res.render("admin/addParty", {
        error: "Something went wrong please try again!",
        userData
    });

    return res.redirect("/admin");

}

async function deleteParty(req, res) {
    const { id } = req.body;
    const findParty = await party.findById(id);

    const deleteCandidate = await candidate.deleteMany({ party: findParty.partyName })

    if (!deleteCandidate) return res.json({ message: "Something went wrong please try again!" });

    const response = await party.findByIdAndDelete(id);
    if (!response) return res.json({ message: "Something went wrong please try again!" });

    return res.json({ message: "Party Deleted!" });
}

async function editParty(req, res) {
    if (req.method == "POST") {
        const p_id = req.params.id;
        const { p_name, p_motive, u_id } = req.body;

        const userData = await user.findById(u_id);

        if (p_name == "" && p_motive == "") return res.render("admin/partyEdit", {
            error: "Please fill all the mandatory feilds!",
            userData
        });

        if (p_motive.length < 50) return res.render("admin/partyEdit", {
            error: "Party motive must be minimum 50 characters long!",
            userData
        });;

        const response = await party.findByIdAndUpdate(p_id, { partyName: p_name, motive: p_motive });

        if (!response) return res.json({ message: "Something went wrong please try again!" });

        return res.redirect("/admin");
    } else {
        const id = req.params.id;

        const p_data = await party.findById(id);

        res.render("admin/partyEdit", {
            userData: req.user,
            p_data
        })
    }
}

async function addCandidate(req, res) {
    if (req.method == "POST") {
        const { c_name, c_age, c_party, u_id } = req.body;

        const userData = await user.findById(u_id);

        if (c_name == "" && c_age == "" && c_party == "") return res.render("admin/partyEdit", {
            error: "Please fill all the mandatory feilds!",
            userData
        });

        if (c_age < 25) return res.render("admin/partyEdit", {
            error: "Minimum 25 age is required!",
            userData
        });;

        const newCandidate = new candidate({ name: c_name, age: c_age, party: c_party });

        const response = await newCandidate.save();

        if (!response) return res.json({ message: "Something went wrong please try again!" });

        const increaseCandidateCount = await party.updateOne({ partyName: c_party }, { $inc: { totalCandidates: 1 } });

        if (!increaseCandidateCount) return res.json({ message: "Something went wrong please try again!" });

        return res.redirect("/admin/all-candidate");
    } else {
        const parties = await party.find();

        res.render("admin/addCandidate", {
            userData: req.user,
            parties,
        })
    }
}

async function allCandidate(req, res) {
    let allCandidates = await candidate.find().lean();

    res.render("admin/allCandidates", {
        userData: req.user,
        allCandidates,
        s_no: 1
    });
}

async function deleteCandidate(req, res) {
    const { id } = req.body;
    const findCandidate = await candidate.find({ _id: id });

    console.log(findCandidate)

    if (!findCandidate) return res.json({ message: "Candidate does not exist!" });

    const updateParty = await party.updateOne({ partyName: findCandidate[0].party }, { $inc: { totalCandidates: -1 } });
    
    if (!updateParty) return res.json({ message: "Something went wrong please try again!" });

    const response = await candidate.findByIdAndDelete(id);

    if (!response) return res.json({ message: "Something went wrong please try again!" });

    return res.json({ message: "Candidate Deleted!" });
}

async function editCandidate(req, res) {
    if (req.method == "POST") {
        const c_id = req.params.id;
        const { c_name, c_age, c_party, old_party, u_id } = req.body;

        const userData = await user.findById(u_id);

        if (c_name == "" && c_age == "" && c_party == "") return res.render("admin/candidateEdit", {
            error: "Please fill all the mandatory feilds!",
            userData
        });

        if (c_age < 25) return res.render("admin/partyEdit", {
            error: "Candidate age must be above 25!",
            userData
        });;

        const response = await candidate.findByIdAndUpdate(c_id, { name: c_name, age: c_age, party: c_party });

        if (!response) return res.json({ message: "Something went wrong please try again!" });

        if (old_party !== c_party) {
            const decreaseCandidateCount = await party.updateOne({ partyName: old_party }, { $inc: { totalCandidates: -1 } });

            const increaseCandidateCount = await party.updateOne({ partyName: c_party }, { $inc: { totalCandidates: 1 } });

            if (!increaseCandidateCount || !decreaseCandidateCount) return res.json({ message: "Something went wrong please try again!" });
        }

        return res.redirect("/admin/all-candidate");
    } else {
        const id = req.params.id;

        const c_data = await candidate.findById(id);
        const parties = await party.find();

        res.render("admin/candidateEdit", {
            userData: req.user,
            c_data,
            parties,
        })
    }
}

module.exports = { addParty, index, deleteParty, editParty, addCandidate, allCandidate, deleteCandidate, editCandidate };
