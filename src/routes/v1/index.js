const { Router } = require("express");
const { InfoController } = require("../../controller");
const router = Router();

router.get("/info", InfoController.handleInfoController);

module.exports = router;
