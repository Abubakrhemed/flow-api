const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app.js");

const PORT = process.env.PORT || 3004;
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log("connected to Mongodb");
    app.listen(PORT, () => {
      console.log("server running on ", PORT);
    });
  })

  .catch((error) => {
    console.error("error connecting to Mongodb", error.message);
  });
