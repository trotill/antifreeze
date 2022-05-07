import chai from 'chai'
import Event from '../event.js'
import EventRepository from '../../repositories/event.js'
import LastEventRepository from '../../repositories/lastEvent.js'
import dbService from '../../db/dbService.cjs'
import { Sequelize } from 'sequelize'
import createLastEventMigration from '../../db/migrations/03-create-lastEvent.cjs'
import createEventMigration from '../../db/migrations/04-create-event.cjs'

const { expect } = chai

const mockData = [
  {
    relay: { heater: 0, pump: 0 },
    powerLoss: 0,
    ac0: { voltage: 217.2, current: 0, power: 0, energy: 24467, freq: 49.9, powerFact: 0, alarm: 0 },
    device: { relayHeaterAvail: 1, relayPumpAvail: 1, acAvail: 1, pumpWorkTime: 1300, heaterWorkTime: 3700, pumpMaxPower: 1200 },
    autoMode: { mode: 0, state: 0 },
    pumpWork: 0
  }
]
describe('event service test', async function () {
  let queryInterface
  let eventInstance
  before(async () => {
    const db = await dbService.init('mocha')
    const { sequelize } = db
    queryInterface = sequelize.getQueryInterface()
    await createLastEventMigration.up(queryInterface, Sequelize)
    await createEventMigration.up(queryInterface, Sequelize)
    const ctx = {
      eventRepository: new EventRepository(db),
      lastEventRepository: new LastEventRepository(db)
    }

    eventInstance = new Event(ctx)
    eventInstance.init()
  })

  it('add events (addEventAF)', async () => {
    await eventInstance.addEventAF(mockData[0])
    mockData[0].ac0.voltage = 180
    await eventInstance.addEventAF(mockData[0])
  })
  it('read events from db (readEvent)', async () => {
    const result = await eventInstance.readEvent({
      where: {
        status: 0
      },
      offset: 1,
      limit: 3,
      order: 'asc'
    })
    expect(result.length).be.eql(3)
    expect(result[0].eventId).be.eql('lowVolt')
    console.log(result)
  })
  it('read last events (readLastEvent)', async () => {
    const result = await eventInstance.readLastEvent()
    expect(result[1]).be.deep.include({
      eventId: 'lowVolt',
      status: true
    })
  })
  it('set readed status (setReadEvent)', async () => {
    await eventInstance.markEventRead({ id: 1 })
    const result = await eventInstance.readEvent({
      where: {
        read: 1
      }
    })
    expect(result[0]).be.deep.include({
      eventId: 'highVolt',
      read: true
    })
  })
  it('remove obsolete (removeOldest)', async () => {
    await eventInstance.removeOldest(5)
    const result = await eventInstance.readEvent({})
    expect(result.length).be.eql(5)
  })
  after(async () => {
    await createLastEventMigration.down(queryInterface, Sequelize)
    await createEventMigration.down(queryInterface, Sequelize)
  })
})
