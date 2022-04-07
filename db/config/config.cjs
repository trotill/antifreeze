require('dotenv').config({path: '.env'})

module.exports = {
  "development": {
    "username": "root",
    "password": null,
    "database": "database_development",
    "storage": process.env.DB_PATH,
    "dialect": "sqlite",
    define: {
      freezeTableName: true,
    }
  }
}
