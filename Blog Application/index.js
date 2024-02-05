const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const auth = require("./routes/user");
const blog = require("./routes/blog");
const { checkForAuth } = require("./middlewares/auth");
const blogModel = require("./models/blog");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuth("token"));

app.get("/", async (req, res) => {
  const allBlogs = await blogModel.find({}).sort("createdAt");
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});
app.use("/user", auth);
app.use("/blog", blog);

app.listen(port, () => {
  console.log(`Server started at ${port}`);
});
