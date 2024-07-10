const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');

const sequelize = new Sequelize(config[env]);

module.exports = sequelize;



const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL + "?sslmode=require"
})

pool.connect((err) => {
if (err) throw err
console.log("connected to PostgreSQL successfully")})

module.exports = pool