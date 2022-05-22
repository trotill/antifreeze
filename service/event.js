import constData from '../api/const.js'

export default class {
  constructor (ctx) {
    Object.assign(this, ctx)
    this.rebootCntrAF = null
    this.rebootCntrFD = null
  }

  async init () {
    await this.lastEventRepository.init()
  }

  async markEventRead ({ id }) {
    return this.eventRepository.setReadStatus(id)
  }

  async readLastEvent () {
    return this.lastEventRepository.readLastEvent()
  }

  async readEvent ({ where = { }, limit = 1000, offset = 0, order = [['id', 'asc']] } = {}) {
    return this.eventRepository.getList({ where, limit, offset, order })
  }

  async removeOldest (limit) {
    return this.eventRepository.removeOldest(limit)
  }

  async getUnreadCount () {
    return this.eventRepository.getUnreadCount()
  }

  async admEventFD ({ rebootCntr }) {
    const ts = Date.now()
    const rebootFD = !((rebootCntr !== this.rebootCntrFD) && (this.rebootCntrFD !== null))
    this.rebootCntrFD = rebootCntr
    const state = {
      rebootFD
    }
    const changedState = await this.lastEventRepository.addLastEvent({ ts, state })
    await this.eventRepository.addList({ changedState })
  }

  async admEventAF ({ relay, powerLoss, ac0, device, autoMode, pumpWork, rebootCntr }) {
    const ts = Date.now()
    const rebootAF = !((rebootCntr !== this.rebootCntrAF) && (this.rebootCntrAF !== null))
    this.rebootCntrAF = rebootCntr
    const state = {
      highVolt: {
        state: (ac0.voltage > constData.highVoltage) ? ac0.voltage : null,
        info: {
          value: ac0.voltage,
          max: constData.highVoltage
        }
      },
      lowVolt: {
        state: (ac0.voltage < constData.lowVoltage) ? ac0.voltage : null,
        info: {
          value: ac0.voltage,
          min: constData.lowVoltage
        }
      },
      highPower: {
        state: (ac0.power > constData.highPower) ? ac0.power : null,
        info: {
          value: ac0.power,
          max: constData.highPower
        }
      },
      lostRH: !!device.relayHeaterAvail,
      lostRP: !!device.relayPumpAvail,
      lostPM: !!device.acAvail,
      lost220V: !powerLoss,
      swOnPump: !pumpWork,
      swOnHeater: !relay.heater,
      algoState: {
        state: (autoMode.state > 0) ? autoMode.state : null,
        info: {
          value: autoMode.state
        }
      },
      rebootAF
    }

    const changedState = await this.lastEventRepository.addLastEvent({ ts, state })
    await this.eventRepository.addList({ changedState })
    return changedState
  }
}
