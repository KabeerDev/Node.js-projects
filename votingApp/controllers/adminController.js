const { party } = require("../model/party");
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
    const response = await party.findByIdAndDelete(id);
    if (!response) return res.redirect("/admin");

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

module.exports = { addParty, index, deleteParty, editParty };