const express = require("express");
const multer = require("multer");
const blog = require("./../models/blog");
const comment = require("./../models/comment");
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./public/uploads`);
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${req.user._id}-${file.originalname}`;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  res.render("addblog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blogDetail = await blog.findById(req.params.id).populate("createdBy");
  const commentDetail = await comment
    .find({ blogId: req.params.id })
    .populate("createdBy");
  console.log(commentDetail);
  return res.render("blog", {
    blogDetail,
    commentDetail,
    user: req.user,
  });
});

router.post("/", upload.single("c_img"), async (req, res) => {
  const { title, body } = req.body;
  const newBlog = await blog.create({
    title,
    body,
    coverImg: `uploads/${req.file.filename}`,
    createdBy: req.user._id,
  });

  return res.redirect(`/`);
});

router.post("/comment/:blogId", async (req, res) => {
  comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });

  return res.redirect(`/blog/${req.params.blogId}`);
});

module.exports = router;
