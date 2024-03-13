const { candidate } = require("./../model/candidate");
const { user } = require("./../model/user");

async function vote(req, res) {
    if (req.method == "POST") {
        const user_info = req.user;
        const { voted_candidate } = req.body;
        const voted = await user.findByIdAndUpdate(user_info._id, { isVoted: true }, { new: true })

        req.user = voted;

        const can_info = await candidate.findByIdAndUpdate(
            voted_candidate,
            {
                $push: {
                    votes: { voted }
                },
                $inc: {
                    voteCount: 1
                }
            },
            { new: true }
        );
        console.log(can_info, voted, voted_candidate, req.user);

        return res.redirect("/");
    }

    const candidates = await candidate.find();

    return res.render("vote", {
        userData: req.user,
        candidates
    })
}

module.exports = { vote };