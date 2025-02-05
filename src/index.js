const express = require("express");
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () =>
  console.log(`Server is running on Port ${ServerConfig.PORT}`)
);
