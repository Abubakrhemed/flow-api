const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ error: "user not found create an account" });
    }

    const correctHash = await bcrypt.compare(password, user.passwordHash);
    if (!correctHash) {
      return res.status(400).json({ error: "incorrect password or username" });
    }
    const userForToken = {
      username: user.username,
      id: user._id,
    };
    const token = await jwt.sign(userForToken, process.env.SECRET, {
      expiresIn: 60 * 60,
    });
    res
      .status(200)
      .send({ useername: user.username, id: user._id, token: token });
  } catch (error) {
    res.status(500).json({ error: "failed to login try again later" });
    console.log(error);
  }
});

module.exports = loginRouter;
