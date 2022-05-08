import eventList from '../api/eventList.js'
import { Sequelize } from 'sequelize'

export default class EventRepository {
  constructor (db) {
    this.model = db.eventModel
    this.sequelize = db.sequelize
  }

  async getList ({ where, limit, offset, order }) {
    return this.model.findAll({ where, limit, offset, order }).then(r => r.map(item => item.toJSON()))
  }

  async addList ({ changedState }) {
    const eventFormat = changedState.map((item) => ({ ...item, read: false }))
    await this.model.bulkCreate(eventFormat)
  }

  async setReadStatus (id) {
    await this.model.update({ read: true }, { where: { id } })
  }

  async removeOldest (limit) {
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
