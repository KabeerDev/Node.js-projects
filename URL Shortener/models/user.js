const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

userSchema.pre("save", async function (next) {
  let person = this;
  if (!person.isModified("password")) return next();
  try {
    let salt = await bcrypt.genSalt(8);
    let pass = await bcrypt.hash(person.password, salt);

    this.password = pass;
  } catch (err) {
    console.log(err);
  }
});

const user = mongoose.model("user", userSchema);

module.exports = user;
