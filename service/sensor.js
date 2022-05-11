export default class {
  constructor (ctx) {
    Object.assign(this, ctx)
  }

  addSensorData ({ ac0, md02Main }) {
    const voltage = ac0.voltage
    const power = ac0.power
    const current = ac0.current
    const temp = md02Main.temp
    const humidity = md02Main.humi
    this.sensorRepository.addOne({ voltage, power, current, temp, humidity })
  }
}
