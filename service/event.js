import constData from '../api/const.js'

export default class {
  constructor (ctx) {
    Object.assign(this, ctx)
  }

  /* |*
  ts: DataTypes.INTEGER,
    eventNameId:DataTypes.INTEGER,
    status: DataTypes.BOOLEAN,//start/stop
    read: DataTypes.BOOLEAN,//readed/no read
    deviceId: DataTypes.INTEGER,
    value: DataTypes.JSON,
    type: DataTypes.INTEGER//pr
   */
  /*
{"relay":{"heater":0,"pump":0},"stat":{"ts":1651524827,"pwrLStart":1651442671,"pwrLStop":1651442672,"pwrLIter":9827,"pwrLTotal":1,"pumpStart":1651512796,"pumpStop":1651512996,"pumpIter":1045,"pumpTotal":200,"heatStart":1651309897,"heatStop":1651309900,"heatIter":26,"heatTotal":0},"powerLoss":0,"ac0":{"voltage":217.2,"current":0,"power":0,"energy":24467,"freq":49.9,"powerFact":0,"alarm":0},"md02Main":{"temp":9.6,"humi":59.2},"device":{"relayHeaterAvail":1,"relayPumpAvail":1,"acAvail":1,"pumpWorkTime":1300,"heaterWorkTime":3700,"pumpMaxPower":1200},"wifi":{"rssi":-72,"ch":1},"autoMode":{"mode":0,"state":0},"freeMem":166740,"msgId":0,"rebootCntr":27137,"message":"220V [05-02 01:04] Pump [05-02 20:36] Heater [04-30 12:11] Src [05-02 23:53]","ip":"192.168.88.253","v":"Fri Mar 25 00:23:21 2022","pumpWork":0}
   highVolt
lowVolt
highPower
lostRH
lostRP
lostPM
lost220V
swOnPump
swOnHeater
algoState
rebootAF
rebootFD
   */
  addEventRebootAF () {

  }

  addEventRebootFD () {

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

  async readEvent ({ where = { }, limit = 1000, offset = 0, order = 'asc' }) {
    return this.eventRepository.readEvent({ where, limit, offset, order: [['id', order]] })
  }

  async removeOldest (limit) {
    return this.eventRepository.removeOldest(limit)
  }

  async addEventAF ({ relay, powerLoss, ac0, device, autoMode, pumpWork }) {
    const ts = Date.now()
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
      lostRH: !device.relayHeaterAvail,
      lostRP: !device.relayPumpAvail,
      lostRM: !device.acAvail,
      lost220V: powerLoss,
      swOnPump: pumpWork,
      swOnHeater: relay.heater,
      algoState: {
        state: autoMode.state,
        info: {
          value: autoMode.state
        }
      }
    }

    const changedState = await this.lastEventRepository.addLastEvent({ ts, state })
    await this.eventRepository.addEvent({ changedState })
  }
}
