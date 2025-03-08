require("module-alias/register");

const express = require("express");

const { config, db, exp } = require("@config");

const app = express();

// express configuration
exp.config(app);

// database configuration
db.connect(config.MONGO_URI);

// server configuration
const startServer = (port) => {
  app
    .listen(port, () => {
      console.log(`Server is running on Port - ${port}`);
    })
    .on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port - ${port} is already in use`);
        startServer(port + 1);
      } else {
        console.log("App Error", err);
      }
    });
};

startServer(Number(config.PORT));
