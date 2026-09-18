// MySQL connection pool setup using mysql2
const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_manager',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Use the promise-based wrapper so we can use async/await in controllers
const promisePool = pool.promise();

module.exports = promisePool;
