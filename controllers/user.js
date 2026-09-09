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
    const user = new User({ username, passwordHash, dailyStats: [] });
    await user.save();
    res.status(201).send(user);
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
    const { date, stats, totalTime } = req.body;
    const id = req.params.id;

    if (!date) {
      return res.status(400).json({ error: "date is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({ error: "user not found" });
    }

    const dayIndex = user.dailyStats.findIndex((d) => d.date === date);
    if (dayIndex !== -1) {
      user.dailyStats[dayIndex].stats = stats;
      user.dailyStats[dayIndex].totalTime = totalTime;
    } else {
      user.dailyStats.push({ date, stats, totalTime });
    }

    await user.save();
    res.status(201).send(user);
  } catch (error) {
    console.log("request body", req.body);
    console.log(error);
    res.status(500).json({ error: "coulndt update users stats" });
  }
});

userRouter.delete("/stats/:id/:date", async (req, res) => {
  try {
    const { id, date } = req.params;
    const { tabTitle } = req.body;

    if (!tabTitle) {
      return res.status(400).json({ error: "tabTitle is required" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "no user found" });
    }

    const day = user.dailyStats.find((d) => d.date === date);
    if (!day) {
      return res.status(404).json({ error: "no stats found for that date" });
    }

    day.stats = day.stats.filter((t) => t.active_tab_title !== tabTitle);
    day.totalTime = day.stats.reduce((acc, t) => acc + (t.time_spent || 0), 0);

    await user.save();
    res.status(200).send({ user, msg: "tab cleared" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "couldn't clear tab" });
  }
});

userRouter.delete("/stats/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if (user) {
      user.dailyStats = [];
      await user.save();
      res.send({ user: user, msg: "deleted" });
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.delete("/account/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "no user found" });
    }

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({ error: "failed try again later" });
  }
});

module.exports = userRouter;