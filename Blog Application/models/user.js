const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { error } = require("console");

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImg: {
      type: String,
      default: "/img/default.jpg",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  const salt = randomBytes(16).toString();
  const h_pass = createHmac("sha256", salt).update(user.password).digest("hex");

  this.salt = salt;
  this.password = h_pass;
  next();
});

userSchema.static("matchPassword", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new error("user not found!");

  const salt = user.salt;
  const h_pass = user.password;
  const userProvided_pass = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (h_pass === userProvided_pass) {
    return user;
  } else {
    throw new error("Incorrect Password");
  }
});

const user = mongoose.model("user", userSchema);
module.exports = user;
