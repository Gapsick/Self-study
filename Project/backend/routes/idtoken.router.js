// idtoken.router.js
const express = require('express');

const idTokenRouter = express.Router();
const idTokenController = require('../controllers/idtoken.Controller');

idTokenRouter.post('/', idTokenController.idTokenController);

module.exports = idTokenRouter;