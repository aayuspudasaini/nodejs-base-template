import express from "express";
import { config } from "./config";
const app = express();

// console.log(config.PORT);

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

startServer(Number(8000));
