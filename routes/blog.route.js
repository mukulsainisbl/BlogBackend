const express = require("express");
const blogModel = require("../models/blog.model");
const auth = require("../middleware/auth.middleware");
const access = require("../middleware/access.middleware");
const ROLES = require("../constant/role");
const blogRouter = express.Router();

blogRouter.get("/", async (req, res) => {
  try {
    const blogs = await blogModel.find().populate("author", "username");
    res.status(200).json({ Blogs: "All blog", blogs });
  } catch (error) {
    res.status(500).json({ Msg: error });
  }
});

blogRouter.post("/create", auth, access(["author", "admin"]), async (req, res) => {
  try {
    const blog = new blogModel({
      ...req.body,
      author: req.user._id,
    });

    await blog.save();
    res.status(201).json({ Blog: blog });
  } catch (error) {
    res.status(500).json({ Msg: error });
  }
});

blogRouter.put("/update/:id", auth, access("author"), async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    // Find the blog first to check if the current user is the author
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the logged-in user is the author
    if (blog.author.toString() !== authorId.toString()) {
      return res
        .status(403)
        .json({ message: "You can only update your own blog" });
    }

    // Update the blog
    const updateBlog = await blogModel.findByIdAndUpdate(blogId, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Blog updated", updateBlog });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

blogRouter.delete('/delete/:id', auth, access([ROLES.ADMIN, ROLES.AUTHOR]), async (req, res) => {
  try {
    const blogId = req.params.id;
    const authorId = req.user._id;

    // Find the blog first to check if the current user is the author
    const blog = await blogModel.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Check if the logged-in user is the author or has admin rights
    if (blog.author.toString() !== authorId.toString() && req.user.role !== ROLES.ADMIN) {
      return res.status(403).json({ message: "You can only delete your own blog" });
    }

    // Delete the blog
    await blogModel.findByIdAndDelete(blogId);

    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


module.exports = blogRouter;
