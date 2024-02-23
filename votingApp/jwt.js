const jwt = require("jsonwebtoken");

function generateToken(userdata) {
  return jwt.sign(userdata, process.env.JWT_SECRET);
}

function verifyToken(token) {
  jwt.verify(token, process.env.JWT_SECRET);
}

module.exports = { generateToken, verifyToken };
