const express = require("express");
const userModel = require("../models/user.model");
const userRouter = express.Router();
var bcrypt = require("bcryptjs");
const bcryptjs = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);
var jwt = require("jsonwebtoken");
const auth = require("../middleware/auth.middleware");
const access = require("../middleware/access.middleware");
userRouter.get("/", auth , access("admin")  , async (req, res) => {
  try {
    const users = await userModel.find();
    res.status(200).json({ Msg: "All users", users });
  } catch (error) {
    res.status(500).json({ Msg: error });
  }
});
userRouter.post("/register", async (req, res) => {
    try {
    const { username, password, role } = req.body;
    const checkUserName = await userModel.findOne({ username });
    if (checkUserName) {
      return res.status(400).send("User already exists");
    }
    var hashPassword = bcrypt.hashSync(password, salt);
    const user = new userModel({ username, password: hashPassword, role });
    await user.save();
    res.status(201).json({ Msg: `${username} is register sucesfully`, user });
  } catch (error) {
    res.status(500).json({ Msg: error });
  }
});

userRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if the user exists
    const findUser = await userModel.findOne({ username });
    if (!findUser) {
      return res
        .status(404)
        .send("Username is not registered. Please sign up.");
    }

    // Validate the password
    const isValidPassword = await bcryptjs.compare(password, findUser.password);
    if (!isValidPassword) {
      return res.status(401).json({ Msg: "Incorrect password. Try again." });
    }

    // Generate a token
    const token = jwt.sign(
      { _id: findUser._id, role: findUser.role },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Respond with success
    res.status(200).json({
      Msg: `${findUser.username} has logged in successfully.`,
      token,
      userId: findUser._id

    });
  } catch (error) {
    res.status(500).json({ Msg: error.message });
  }
});


module.exports = userRouter;
