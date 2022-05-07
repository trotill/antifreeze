'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('lastEvent', {
      ts: {
        type: Sequelize.INTEGER
      },
      eventId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      status: {
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
    await queryInterface.dropTable('lastEvent');
  }
};
