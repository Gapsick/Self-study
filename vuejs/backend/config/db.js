const mysql = require('mysql2/promise');
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'gsc1234!@#$',
  database: process.env.DB_NAME || 'ss_vue_test'
});

module.exports = db;
