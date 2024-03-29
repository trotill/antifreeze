import eventList from '../api/eventList.js'

export default class LastEventRepository {
  constructor (db) {
    this.model = db.lastEventModel
    this.sourceState = {}
  }

  async init () {
    const lastData = await this.model.findAll({}).then(r => r.map(item => item.toJSON()))
    lastData.forEach(({ eventId, value, status }) => {
      this.sourceState[eventId] = status
    })
  }

  async readLastEvent () {
    return this.model.findAll({

    }).then(r => r.map(item => item.toJSON()))
  }

  async addLastEvent ({ ts, state }) {
    const changedState = []
    for (const stateItem in state) {
      let status
      let json
      if (state[stateItem].state !== undefined) {
        status = (state[stateItem].state === null)
        json = state[stateItem].info
      } else {
        json = {}
        status = state[stateItem]
      }
      if (status === this.sourceState[stateItem]) continue

      this.sourceState[stateItem] = status

      const prepared = {
        ts,
        eventId: stateItem,
        status: !!status, // false - continue, true - term
        deviceId: eventList[stateItem]?.dev ?? 'af',
        value: json,
        prio: eventList[stateItem]?.prio ?? 100
      }
      await this.model.upsert(prepared).catch((e) => {
        console.log(e)
      })
      changedState.push(prepared)
    }
    return changedState
  }
}
