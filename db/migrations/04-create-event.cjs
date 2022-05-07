'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('event', {
      id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
        allowNull: false,
      },
      ts: {
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      read: {
        type: Sequelize.BOOLEAN
      },
      deviceId: {
        type: Sequelize.STRING
      },
      prio: {
        type: Sequelize.INTEGER
      },
      value: {
        type: Sequelize.JSON
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE(3),
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE(3),
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('event');
  }
};
