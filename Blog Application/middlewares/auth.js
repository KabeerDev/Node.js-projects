const { verifyToken } = require("./../services/auth");

function checkForAuth(cookieName) {
  return async (req, res, next) => {
    const tokenVal = req.cookies[cookieName];
    if (!tokenVal) return next();

    try {
      const userPayload = await verifyToken(tokenVal);
      req.user = userPayload;
    } catch (err) {
      console.log(err);
    }
    return next();
  };
}

module.exports = { checkForAuth };
