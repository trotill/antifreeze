
import { Sequelize } from 'sequelize'
import { reduceSequelizeResponse } from '../api/response.js'

export default class EventRepository {
  constructor (db) {
    this.model = db.eventModel
    this.sequelize = db.sequelize
  }

  async getList ({ where, limit, offset, order }) {
    const rawResponse = await this.model.findAll({
      where,
      limit,
      offset,
      order,
      raw: true,
      attributes: ['id', 'ts', 'eventId', 'status', 'read', 'deviceId', 'prio', 'value']
    })
    return reduceSequelizeResponse(rawResponse)
  }

  async addList ({ changedState }) {
    const eventFormat = changedState.map((item) => ({ ...item, read: false }))
    await this.model.bulkCreate(eventFormat)
  }

  async setReadStatus (id) {
    await this.model.update({ read: true }, { where: { id } })
  }

  async removeOldest (limit) {
    console.log('event remove oldest data from DB')
    const SQL = `
      DELETE FROM event where id <= (
          SELECT id
          FROM event
          ORDER BY id DESC
          LIMIT 1
      ) - ${limit}`
    return this.sequelize.query(SQL, {
      type: Sequelize.QueryTypes.DELETE
    })
  }
}
