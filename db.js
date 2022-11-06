const { Sequelize } = require('sequelize');
const db = new Sequelize('app', '', '',{
    storage: 'database.sqlite',
    dialect: 'sqlite',
    logging: false
  });

module.exports =db