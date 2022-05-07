'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class LastEvent extends Model {};
  LastEvent.init({
    ts: DataTypes.INTEGER,
    eventId:{
      allowNull: false,
      primaryKey: true,
      type:DataTypes.INTEGER
    },
    status: DataTypes.BOOLEAN,//start/stop
    deviceId: DataTypes.INTEGER,
    value: DataTypes.JSON,
    prio: DataTypes.INTEGER//prio 0-99 alarm,100 - 200 warning
  }, {
    sequelize,
    modelName: 'lastEvent',
  });
  return LastEvent;
};
