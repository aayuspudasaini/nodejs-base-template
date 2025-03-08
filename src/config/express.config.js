const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { config } = require("./app.config");

exports.config = (app) => {
  // middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(
    cors({
      credentials: true,
      origin: config.FRONTEND_URL,
    })
  );
  app.use(helmet());
  app.use(cookieParser());
};
