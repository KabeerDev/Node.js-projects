const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    unique: true,
  },
  mobile: {
    type: String,
  },
  address: {
    type: String,
    required: true,
  },
  naIdCardNo: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  p_img: {
    type: String,
  },
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter",
  },
  isVoted: {
    type: Boolean,
    default: false,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const data = this;
  const salt = await bcrypt.genSalt(12);
  const h_pass = await bcrypt.hash(data.password, salt);
  this.password = h_pass;
  return next()
});

async function comparePassword(pass, hpass) {
  const result = await bcrypt.compare(pass, hpass);
  return result;
}

const user = mongoose.model("user", userSchema);

module.exports = { user, comparePassword };
