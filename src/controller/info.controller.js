const { StatusCodes } = require("http-status-codes");

async function handleInfoController(req, res) {
  res.status(StatusCodes.OK).json({
    message: "Hello World",
  });
}

module.exports = { handleInfoController };
