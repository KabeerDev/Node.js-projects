const user = require("./../models/user");
const conn = require("./../config");
const { verifyUser, generateToken } = require("./../services/auth");

async function handleRegistrarion(req, res) {
  let data = req.body;
  let name = data.fullname;
  let email = data.email;
  let password = data.password;
  if (name != "" && email != "" && password != "") {
    if (password.length >= 4 && password.length <= 12) {
      let newUser = new user(data);
      let save = await newUser.save();
      if (save) {
        var success = "user registered.You can Login now!";
      } else {
        var error = "Please try again!";
      }
    } else {
      var error = "password can be 4 to 12 characters long";
    }
  } else {
    var error = "Fill all the feilds!";
  }

  if (success) {
    req.flash("success", success);
    res.redirect("/user/login");
  }
  if (error) {
    req.flash("error", error);
    res.redirect("/user/register");
  }
}

async function handleLogin(req, res) {
  let data = req.body;
  let email = data.email;
  let password = data.password;
  if (email != "" && password != "") {
    let userData = await verifyUser(email, password);
    if (!userData) {
      req.flash("error", "user not found.Try again!");
      return res.redirect("/user/register");
    }
    let token = await generateToken(
      userData._id,
      userData.fullname,
      email,
      password
    );
    if (!token) {
      req.flash("error", "Something went wrong.Try again!");
      return res.redirect("/user/login");
    }
    var success = "user logged in!";
    res.cookie("token", token);
  } else {
    var error = "Fill all the feilds!";
  }

  if (success) {
    req.flash("success", success);
    return res.redirect("/");
  }
  if (error) {
    req.flash("error", error);
    return res.redirect("/user/login");
  }
}

module.exports = { handleRegistrarion, handleLogin };
