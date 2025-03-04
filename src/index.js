const express = require("express");
const { ServerConfig } = require("./config");
const apiRoutes = require("./routes");
const expressConfig = require("./config/express.config");
const app = express();

// middlewares
await expressConfig(app);

// routes
app.use("/api", apiRoutes);

app.listen(ServerConfig.PORT, () =>
  console.log(`Server is running on Port ${ServerConfig.PORT}`)
);
