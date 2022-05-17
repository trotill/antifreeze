
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
    if (rawResponse.length) {
      const count = await this.model.count({
        where,
        order
      })

      const reducedList = reduceSequelizeResponse(rawResponse)
      return { list: reducedList, count }
    } else {
      return { list: null, count: 0 }
    }
  }

  async addList ({ changedState }) {
    const eventFormat = changedState.map((item) => ({ ...item, read: false }))
    await this.model.bulkCreate(eventFormat)
  }

  async setReadStatus (id) {
    await this.model.update({ read: true }, { where: { id } })
  }

  async getUnreadCount () {
    return await this.model.count({
      where: {
        read: false
      }
    })
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
