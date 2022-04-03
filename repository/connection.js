var mysql = require('mysql')
require('dotenv').config();

console.log(process.env.DB_PORT)
var connection = mysql.createPool({
  connectionLimit : 10,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
})

connection.connect()
connection.addListener

module.exports = connection