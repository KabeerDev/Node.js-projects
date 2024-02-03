const conn = require("./../config");
const urlModel = require("./../models/url");
const shortid = require("shortid");

async function shortUrl(req, res) {
  try {
    let data = req.body;
    const s_id = shortid();
    let redirectUrl = data.url;
    let user_id = data.user_id;
    if (redirectUrl != "") {
      if (
        redirectUrl.startsWith("https://") ||
        redirectUrl.startsWith("http://")
      ) {
        let newUrl = await urlModel.create({
          shortId: s_id,
          redirectUrl: redirectUrl,
          userId: user_id,
          visitHistory: [],
        });
        if (newUrl) {
          var success = "Short URL generated!";
        } else var error = "Something went wrong.Please try again";
      } else {
        var error = "Invalid URL";
      }
    } else {
      var error = "URL is required!";
    }

    if (error) {
      req.flash("error", error);
      res.redirect(`/`);
    }
    if (success) {
      req.flash("success", success);
      res.redirect(`/?s_id=${s_id}`);
    }
  } catch (err) {
    console.log(err);
    res.redirect("/");
  }
}

module.exports = { shortUrl };
