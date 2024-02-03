const user = require("./../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let secret = "auth@40$";

async function verifyUser(email, password) {
  let person = await user.findOne({ email: email });
  if (person) {
    let v_pass = await bcrypt.compare(password, person.password);
    if (v_pass) {
      return person;
    }
  }
}

async function generateToken(id, fullname, email, password) {
  const token = jwt.sign({ id, fullname, email, password }, secret, {
    expiresIn: 60 * 60 * 24,
  });
  return token;
}

async function verifyToken(token) {
  const decode = await jwt.verify(token, secret);
  return decode;
}

module.exports = { verifyUser, generateToken, verifyToken };
