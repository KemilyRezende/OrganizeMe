// app.js
const express = require("express");
const cors = require("cors");
const database = require("./src/config/db");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const router = require("./src/routes/index");
app.use(router);

(async () => {
  await database.sync();
})();

module.exports = app;
