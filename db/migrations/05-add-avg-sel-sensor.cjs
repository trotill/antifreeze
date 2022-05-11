'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('sensor', 'avgSec10', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('sensor', 'avgMin', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('sensor', 'avgHour', {
      type: Sequelize.INTEGER
    })
    await queryInterface.addColumn('sensor', 'avgDay', {
      type: Sequelize.INTEGER
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('sensor', 'avgSec10')
    await queryInterface.removeColumn('sensor', 'avgMin')
    await queryInterface.removeColumn('sensor', 'avgHour')
    await queryInterface.removeColumn('sensor', 'avgDay')
  }
}
