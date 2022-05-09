require('dotenv').config({path: '.env'})

module.exports = {
  "development": {
    "username": "root",
    "password": null,
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
    "database": "database_mocha",
    "storage": `mocha_${process.env.DB_PATH}`,
    "dialect": "sqlite",
    define: {
      freezeTableName: true,
    }
  }
}
