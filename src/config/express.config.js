const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

module.exports = (app) => {
  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(cookieParser());
  app.use(express.static(__dirname + "/public"));

  // if (process.env.NODE_ENV === "development") {
  //   app.use(morgan("dev"));
  // }
};
