// register.router.js
const express = require('express');

const registerRouter = express.Router();
const registerController = require('../controllers/register.controller')

registerRouter.post('/', registerController.registerPost);