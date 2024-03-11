const { party } = require("../model/party");

async function loadParties(req, res) {
    const totalRecords = await party.countDocuments();

    const limit = 5;
    const totalPages = Math.ceil(totalRecords / limit);
    let pageNo = parseInt(req.query.page);
    const offset = (pageNo - 1) * limit;

    const parties = await party.find().limit(limit).skip(offset);

    let data = "";

    parties.forEach(party => {
        data += `<a href="/party-detail/${party._id}" class="text-decoration-none d-flex mb-4 border text-body-secondary pt-3">
    <img class="mx-3" src="p_flag_image/${party.flag}" alt="party flag image" width="45px"
        height="30px">
    <p class="pb-3 mb-0 small lh-sm border-bottom">
        <strong class="d-block text-gray-dark">@${party.partyName}</strong>
        ${party.motive.slice(0, 130)}...
    </p>
  </a>`;
    });

    if (pageNo != totalPages) {
        data += `<div id="${pageNo + 1}" class="loadMore text-center text-secondary" style="cursor: pointer;">Load More...</div>`;
    }

    return res.json({ message: data });
}

async function partyDetail(req, res) {
    const id = req.params.p_id;
    const partyData = await party.find({ _id: id });

    res.render("partyDetail", {
        userData: req.user,
        partyData: partyData[0]
    });
}

module.exports = { loadParties, partyDetail };