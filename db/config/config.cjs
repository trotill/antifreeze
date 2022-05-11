require('dotenv').config({path: '.env'})
const { Op } = require("sequelize");

operatorsAliases= {
  $gte: Op.gte,//>=
  $lte: Op.lte,//<=
  $notIn:Op.notIn,//not in
  $between:Op.between,
  $notBetween:Op.notBetween
}

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    operatorsAliases,
    "database": "database_development",
    "storage": process.env.DB_PATH,
    "dialect": "sqlite",
    logging:false,
    define: {
      freezeTableName: true,
    }
  },
  "mocha": {
    "username": "root",
    "password": null,
    operatorsAliases,
    "database": "database_mocha",
    "storage": `mocha_${process.env.DB_PATH}`,
    "dialect": "sqlite",
    define: {
      freezeTableName: true,
    }
  }
}
