const jwt = require("jsonwebtoken");
const secret = "$secret@123";

function generateToken(user) {
  const payload = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    profileImg: user.profileImg,
    role: user.role,
  };

  const token = jwt.sign(payload, secret);
  return token;
}

function verifyToken(token) {
  const payload = jwt.verify(token, secret);
  return payload;
}

module.exports = { generateToken, verifyToken };
