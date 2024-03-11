const { party } = require("../model/party");
const { candidate } = require("../model/candidate");
const { user } = require("../model/user");

async function index(req, res) {
    res.render("admin/home", {
        userData: req.user,
    });
}

async function addParty(req, res) {
    const { p_name, p_motive, p_flag, id } = req.body;

    const userData = await user.findById(id);

    if (p_name == "" || p_motive == "" || p_flag == "") return res.render("admin/addParty", {
        error: "Please fill all the mandatory feilds!",
        userData
    });

    if (p_motive.length < 50) return res.render("admin/addParty", {
        error: "Party motive must be minimum 50 characters long!",
        userData
    });

    flag = req.file.filename;

    const newParty = new party({ partyName: p_name, motive: p_motive, flag: flag });
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
    let parties = await party.find();

    res.render("admin/allCandidates", {
        userData: req.user,
        parties,
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

async function getCandidates(req, res) {
    if (req.query.filter) {
        var filter_term = await req.query.filter;
    } else {
        var filter_term = "all";
    }


    if (filter_term == "all") {
        var totalCandidates = await candidate.countDocuments();
    } else {
        var totalCandidates = await candidate.countDocuments({ party: filter_term });
    }

    let pageNo = req.query.page_no;
    let totalRecords = totalCandidates;
    let limit = 3;
    let offset = (pageNo - 1) * limit;
    let totalPages = Math.ceil(totalRecords / limit);
    let p_disabled;
    let n_disabled;

    if (filter_term == "all") {
        var candidates = await candidate.find().limit(limit)
            .skip(offset)
            .exec();
    } else {
        var candidates = await candidate.find({ party: filter_term }).limit(limit)
            .skip(offset)
            .exec();
    }

    if (pageNo <= 1) {
        p_disabled = "disabled";
    } else {
        p_disabled = "";
    }

    if (pageNo >= totalPages) {
        n_disabled = "disabled";
    } else {
        n_disabled = "";
    }

    if (totalCandidates > 0) {
        let s_no = 1;

        let data = `<table class="table w-75 mx-auto my-4 border border-dark table-info table-striped">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Name</th>
                <th scope="col">Party</th>
                <th scope="col">Votes</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>`;
        candidates.forEach(candidate => {

            data += `<tr>
                        <th scope="row">${s_no}</th>
                        <td>${candidate.name}</td>
                        <td>${candidate.party}</td>
                        <td>${candidate.voteCount}</td>
                        <td>
                            <a class="btn btn-sm btn-info text-white mb-1"
                                href="/admin/edit-candidate/${candidate._id}">Edit</a>
                            <button class="btn btn-sm btn-danger delete_btn"
                                id="${candidate._id}">Delete</button>
                        </td>
                    </tr>`;
            s_no++;
        })
        data += `</tbody>
    </table>
    <div class="container d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li id="${pageNo}" class="page-item prev ${p_disabled}">
                            <a class="page-link"getParties aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>`;

        for (let i = 0; i < totalPages; i++) {
            data += `<li id="${i + 1}" class="page-item"><a class="page-link">${i + 1}</a></li>`;
        }
        data += `<li id="${pageNo}" class="page-item next ${n_disabled}">
                            <a class="page-link"getParties aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>`;

        return res.json({ message: data })
    } else {
        return res.json({ message: "No Candidates Yet!" })
    }

}

async function getParties(req, res) {
    var totalparties = await party.countDocuments();

    let pageNo = req.query.page_no;
    let totalRecords = totalparties;
    let limit = 3;
    let offset = (pageNo - 1) * limit;
    let totalPages = Math.ceil(totalRecords / limit);
    let p_disabled;
    let n_disabled;

    let parties = await party.find().limit(limit).skip(offset).exec();

    if (pageNo <= 1) {
        p_disabled = "disabled";
    } else {
        p_disabled = "";
    }

    if (pageNo >= totalPages) {
        n_disabled = "disabled";
    } else {
        n_disabled = "";
    }

    if (totalparties > 0) {
        let s_no = 1;

        let data = `<table class="table my-4 border border-dark table-info table-striped">
        <thead>
            <tr>
                <th scope="col">#</th>
                <th scope="col">Party Name</th>
                <th scope="col">Party Motive</th>
                <th scope="col">Total Candidates</th>
                <th scope="col">Actions</th>
            </tr>
        </thead>
        <tbody>`;

        parties.forEach(party => {
            data += `<tr>
                    <th scope="row">${s_no}</th>
                    <td>${party.partyName}</td>
                    <td>${party.motive.slice(0, 80)}...</td>
                    <td>${party.totalCandidates}</td>
                    <td class="">
                        <a class="btn btn-sm btn-info text-white mb-1"
                            href="/admin/edit/${party._id}">Edit</a>
                        <button class="btn btn-sm btn-danger delete_btn"
                            id="${party._id}">Delete</button>
                    </td>
                </tr>`;
            s_no++;
        });
        data += `</tbody>
    </table>
    <div class="container d-flex justify-content-center">
                <nav aria-label="Page navigation example">
                    <ul class="pagination">
                        <li id="${pageNo}" class="page-item prev ${p_disabled}">
                            <a class="page-link"getParties aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                            </a>
                        </li>`;

        for (let i = 0; i < totalPages; i++) {
            data += `<li id="${i + 1}" class="page-item"><a class="page-link">${i + 1}</a></li>`;
        }
        data += `<li id="${pageNo}" class="page-item next ${n_disabled}">
                            <a class="page-link"getParties aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>`;


        return res.json({ message: data });
    } else {
        return res.json({ message: "No Candidates Yet!" })
    }

}

module.exports = { addParty, index, deleteParty, editParty, addCandidate, allCandidate, deleteCandidate, editCandidate, getCandidates, getParties };
