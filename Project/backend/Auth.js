const express = require('express');
const router = express.Router();
const { StatusCodes } = require('http-status-codes');
const { google } = require('googleapis');

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_SECRET_KEY;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;


