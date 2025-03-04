const express = require("express");
const cors = require("cors");

module.exports = async (app) => {
  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.static(__dirname + "/public"));
};
