const dotenv = require('dotenv')

dotenv.config({ path: './../.env' });
const { Sequelize } = require('sequelize');

const env = process.env.NODE_ENV || 'development';
const config = require('./config');
/*
// const sequelize = new Sequelize(config[env]);
const sequelize = new Sequelize(process.env.POSTGRES_URL)

module.exports = sequelize;


console.log(process.env.POSTGRES_URL)
const { Pool } = require('pg')
require('dotenv').config()

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL
})

pool.connect((err) => {
if (err) throw err
console.log("connected to PostgreSQL successfully")})

module.exports = pool
*/


const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.POSTGRES_URL,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
    }

)

module.exports = sequelize