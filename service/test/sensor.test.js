import chai from 'chai'
import SensorRepository from '../../repositories/sensor.js'
import dbService from '../../db/dbService.cjs'
import { Sequelize, Op } from 'sequelize'
import createSensorMigration from '../../db/migrations/01-create-sensor.cjs'
import addAvgSelSensor from '../../db/migrations/05-add-avg-sel-sensor.cjs'

const { expect } = chai

describe('sensor repo test', async function () {
  let queryInterface
  let sensorRepository
  this.timeout(25000)
  before(async () => {
    const db = await dbService.init('mocha')
    const { sequelize } = db
    queryInterface = sequelize.getQueryInterface()
    await createSensorMigration.up(queryInterface, Sequelize)
    await addAvgSelSensor.up(queryInterface, Sequelize)
    sensorRepository = new SensorRepository(db)
  })

  it('add sensor data  (write)', async () => {
    const voltage = 180
    const power = 100
    const current = 1
    const temp = 0
    const humidity = 0
    for (let n = 0; n < 100; n++) {
      await sensorRepository.addOne({ voltage: voltage + n, power: power + n, current: current + (n * 0.01), temp: temp + (n * 0.01), humidity: humidity + n })
    }
    const result = await sensorRepository.getList({
      offset: 0,
      limit: 1,
      order: 'desc'
    })
    expect(result.voltage[0]).be.eql(279)
  })
  it('read sensor data (read)', async () => {
    const result = await sensorRepository.getList({
      where: {
        voltage: {
          [Op.gte]: 250
        }
      },
      offset: 1,
      limit: 3,
      order: 'asc'
    })
    expect(result.voltage.length).be.eql(3)
    expect(result.voltage[0]).be.eql(251)
    console.log(result)
  })

  it('remove obsolete (removeOldest)', async () => {
    await sensorRepository.removeOldest(50)
    const result = await sensorRepository.getList({})
    expect(result.ts.length).be.eql(50)
  })
  after(async () => {
    await createSensorMigration.down(queryInterface, Sequelize)
  })
})
