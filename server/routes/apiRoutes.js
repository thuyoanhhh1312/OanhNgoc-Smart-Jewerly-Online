const express = require("express");
const app = express();
const roleRoutes = require("./roleRoutes");

app.use(express.json());

app.use("/role", roleRoutes);

module.exports = app;