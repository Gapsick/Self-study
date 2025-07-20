const express = require('express');

const authRouter = express.Router();
const authController = require('../controllers/auth.controller');
const authCallback = require('../controllers/callback.controller');

authRouter.get('/login', authController.authGet);
authRouter.get('/google/callback', authCallback.callback);

module.exports = authRouter;