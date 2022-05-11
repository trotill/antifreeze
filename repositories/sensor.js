
import { Sequelize } from 'sequelize'
import { reduceSequelizeResponse } from '../api/response.js'

export default class SensorRepository {
  constructor (db) {
    this.model = db.sensorModel
    this.sequelize = db.sequelize
  }

  async addOne ({ voltage, power, current, temp, humidity }) {
    const ts = Date.now()
    const avgSec10 = Math.trunc(ts / 1000 / 10)
    const avgMin = Math.trunc(ts / 1000 / 60)
    const avgHour = Math.trunc(ts / 1000 / 3600)
    const avgDay = Math.trunc(ts / 1000 / 86400)
    await this.model.create({
      ts,
      voltage: voltage.toFixed(2),
      power: power.toFixed(2),
      current: current.toFixed(2),
      temp: temp.toFixed(2),
      humidity: humidity.toFixed(2),
      avgSec10,
      avgMin,
      avgHour,
      avgDay
    })
  }

  async getList ({ where, limit = 1000, offset = 0, order = 'asc', group, fieldList = [] }) {
    let attributes
    if (fieldList.length) {
      attributes = fieldList.map((fieldName) => {
        // eslint-disable-next-line no-return-assign
        return (group && fieldName.includes('$'))
          ? (fieldName = fieldName.replace('$', ''), [Sequelize.fn('AVG', Sequelize.col(fieldName)), fieldName])
          : fieldName
      })
    }
    const result = await this.model.findAll({
      where,
      attributes,
      limit,
      offset,
      order: [['id', order]],
      group,
      raw: true
    })
    return reduceSequelizeResponse(result)
  }

  async removeOldest (limit) {
    console.log('sensor remove oldest data from DB')
    const SQL = `
      DELETE FROM sensor where id <= (
          SELECT id
          FROM sensor
          ORDER BY id DESC
          LIMIT 1
      ) - ${limit}`
    return this.sequelize.query(SQL, {
      type: Sequelize.QueryTypes.DELETE
    })
  }
}
