const { verifyToken } = require("./../jwt")
const { user } = require("./../model/user");

async function checkUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return next();
    const id = await verifyToken(token, process.env.JWT_SECRET);
    const userdata = await user.findOne({ _id: id.id });
    req.user = userdata;
    next();
}

async function restrictUser(req, res, next) {
    const token = req.cookies.token;
    if (!token) return res.redirect("/login");
    const id = await verifyToken(token, process.env.JWT_SECRET);
    const userdata = await user.findOne({ _id: id.id });
    req.user = userdata;
    next();
}

module.exports = { checkUser, restrictUser };
