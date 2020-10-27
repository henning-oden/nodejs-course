const mysql = require('mysql2');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'Dr4G0n', {
    dialect: 'mysql',
    host: 'localhost'
    });

module.exports = sequelize;