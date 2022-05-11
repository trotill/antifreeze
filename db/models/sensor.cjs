'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Sensor extends Model {};
  Sensor.init({
    ts: DataTypes.INTEGER,
    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
      allowNull: false,
    },
    voltage:DataTypes.FLOAT,
    power: DataTypes.FLOAT,
    current: DataTypes.FLOAT,
    temp: DataTypes.FLOAT,
    humidity: DataTypes.FLOAT,
    avgSec10:DataTypes.INTEGER,
    avgMin:DataTypes.INTEGER,
    avgHour:DataTypes.INTEGER,
    avgDay:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'sensor',
  });
  return Sensor;
};
