const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const userRouter = express.Router();

userRouter.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
      return res.status(400).json({ error: "username and password required" });
    }

    const exists = await User.findOne({ username });
    if (exists) {
      return res.status(400).json({ error: "username taken" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await new User({ username, passwordHash });
    await user.save();
    res.status(201).send(user);
    console.log(user);
  } catch (err) {
    res.status(500).json({ error: "couldnt sighn up" });
    console.log(err);
  }
});

module.exports = userRouter;
