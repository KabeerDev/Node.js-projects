const { verifyToken } = require("./../services/auth");

async function restrictUser(req, res, next) {
  let token = req.cookies?.token;
  if (!token) return res.redirect("/user/login");

  let userData = await verifyToken(token);
  if (!userData) return res.redirect("/user/login");

  req.user = userData;
  next();
}

module.exports = { restrictUser };
