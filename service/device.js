class DeviceService {
  constructor (mqttService) {
    this.mqttService = mqttService
  }

  sendMqtt (devData, devType) {
    const devDataStr = JSON.stringify(devData)
    if (devType === 'antifreeze') { this.mqttService.publishAf(devDataStr) } else { this.mqttService.publishWd(devDataStr) }
  }
}

let devService
export default ({ mqttService }) => devService || (devService = new DeviceService(mqttService))
