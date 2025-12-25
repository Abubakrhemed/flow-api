const express = require("express");
const app = express();
const userRouter = require("./controllers/user");
const loginRouter = require("./controllers/login");
const cors = require("cors");
app.use(express.json());

app.use(cors());
app.use("/api/user", userRouter);
app.use("/api/login", loginRouter);
module.exports = app;
