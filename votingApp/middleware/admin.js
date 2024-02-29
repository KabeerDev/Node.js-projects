const { verifyToken } = require("./../jwt")
const { user } = require("./../model/user");

async function restrictAdmin(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");

    const id = await verifyToken(token, process.env.JWT_SECRET);
    const userdata = await user.findOne({ _id: id.id });

    if (userdata.role != "admin") {
        return res.redirect("/")
    }

    req.user = userdata;
    next();
}

module.exports = restrictAdmin;