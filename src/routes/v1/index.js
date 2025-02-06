const { Router } = require("express");
const router = Router();

router.use(require("./auth.route"));

module.exports = router;
