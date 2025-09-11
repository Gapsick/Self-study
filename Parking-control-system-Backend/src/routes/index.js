const express = require('express');
const router = express.Router();

router.use("/sessions", require("./admin.routes"))

module.exports = router;