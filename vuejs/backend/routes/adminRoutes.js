const express = require('express');
const { approveUserController, setUserRoleController } = require('../controllers/adminController');
const router = express.Router();

router.post('/approve-user', approveUserController);
router.post('/set-role', setUserRoleController);

module.exports = router;
