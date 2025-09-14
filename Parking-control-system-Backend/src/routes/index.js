const express = require('express');
const router = express.Router();

router.use("/sessions", require("./admin.routes"))
router.use("/occupancy", require("./occupancy.routes"))

module.exports = router;