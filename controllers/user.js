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

userRouter.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "no user found" });
    }
    res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "coul'nt fetch user" });
  }
});

userRouter.put("/:id", async (req, res) => {
  try {
    const { stats } = req.body;
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }
    const incomingTitle = stats.active_tab_title;

    if (user.stats.some((t) => t.active_tab_title === incomingTitle)) {
      return res.status(400).json({ error: "no duplicate tabs aloud" });
    }

    user.stats.push(stats);
    await user.save();

    res.status(201).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "coulndt update users stats" });
  }
});

module.exports = userRouter;
