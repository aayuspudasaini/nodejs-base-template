const express = require("express");

const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const expressConfig = require("./config/express.config");
const connectDB = require("./config/db.config");
const serverConfig = require("./config/server.config");
const { default: mongoose } = require("mongoose");
const app = express();

// middlewares
expressConfig(app);

// database connection
mongoose
  .connect(ServerConfig.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB", error);
  });

// routes
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () =>
  console.log(`Server is running on Port ${ServerConfig.PORT}`)
);
