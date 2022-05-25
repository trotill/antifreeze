export class JobService {
  constructor (ctx) {
    Object.assign(this, ctx)
    this.cleanDbSensorCount = parseInt(process.env.JOB_CLEAN_DB_SENSOR_COUNT ?? 100000)
    this.cleanDbEventCount = parseInt(process.env.JOB_CLEAN_DB_EVENT_COUNT ?? 100000)
    this.cleanDbInterval = parseInt(process.env.JOB_CLEAN_DB_INTERVAL ?? 86400) * 1000
  }

  start () {
    setInterval(async () => {
      this.eventIntervalHdlr = await this.eventRepository.removeOldest(this.cleanDbEventCount)
      this.sensorIntervalHdlr = await this.sensorRepository.removeOldest(this.cleanDbSensorCount)
    }, this.cleanDbInterval)
  }

  stop () {
    clearInterval(this.eventIntervalHdlr)
    clearInterval(this.sensorIntervalHdlr)
  }
}
