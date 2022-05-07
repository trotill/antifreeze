'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
    }
  };
  Event.init({
    ts: DataTypes.INTEGER,
    id:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true,
      allowNull: false,
    },
    eventId:DataTypes.STRING,
    status: DataTypes.BOOLEAN,//start/stop
    read: DataTypes.BOOLEAN,//readed/no read
    deviceId: DataTypes.STRING,
    value: DataTypes.JSON,
    prio: DataTypes.INTEGER//prio 0-99 alarm,100 - 200 warning
  }, {
    sequelize,
    modelName: 'event',
  });
  return Event;
};
