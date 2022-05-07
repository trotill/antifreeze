import eventList from '../api/eventList.js'
import { Sequelize } from 'sequelize'

export default class EventRepository {
  constructor (db) {
    this.model = db.eventModel
    this.sequelize = db.sequelize
  }

  /*
 ts: DataTypes.INTEGER,
    eventNameId:DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,//start/stop
    read: DataTypes.BOOLEAN,//readed/no read
    deviceId: DataTypes.INTEGER,
    value: DataTypes.JSON,
    type: DataTypes.INTEGER//pr
 */
  async adccdEvent ({ ts, state, sourceState }) {
    for (const stateItem in state) {
      let status
      let json
      if (state[stateItem].state !== undefined) {
        status = state[stateItem].state
        json = state[stateItem].info
      } else {
        json = {}
        status = state[stateItem]
      }
      if (status === sourceState[stateItem]) continue

      sourceState[stateItem] = status
      console.log(ts, stateItem, status, !!status, JSON.stringify(json), eventList[stateItem]?.prio ?? 100, 0, 0)
      await this.model.create({
        ts,
        eventId: stateItem,
        status: !!status,
        deviceId: eventList[stateItem]?.dev ?? 'af',
        value: json,
        read: false,
        prio: eventList[stateItem]?.prio ?? 100
      }).catch((e) => {
        console.log(e)
      })
    }
  }

  async readEvent ({ where, limit, offset, order }) {
    return this.model.findAll({ where, limit, offset, order }).then(r => r.map(item => item.toJSON()))
  }

  async addEvent ({ changedState }) {
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
