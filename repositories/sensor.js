
import { Sequelize } from 'sequelize'

export default class SensorRepository {
  constructor (db) {
    this.model = db.sensorModel
    this.sequelize = db.sequelize
  }

  async write ({ voltage, power, current, temp, humidity }) {
    const ts = Date.now()
    await this.model.create({
      ts,
      voltage: voltage.toFixed(2),
      power: power.toFixed(2),
      current: current.toFixed(2),
      temp: temp.toFixed(2),
      humidity: humidity.toFixed(2)
    })
  }

  async read ({ where, limit = 1000, offset = 0, order = 'asc' }) {
    return this.model.findAll({ where, limit, offset, order: [['id', order]] }).then(r => r.map(item => item.toJSON()))
  }

  async removeOldest (limit) {
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
