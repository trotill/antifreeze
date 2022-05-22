import mqtt from 'mqtt'

export default class MqttService {
  static afTopic = '/srv/antiFreeze'
  static wdTopic = '/srv/footerDog'
  static afDevTopic = '/dev/antiFreeze'
  static wdDevTopic = '/dev/footerDog'
  static eventBroadMessage = 'eventBroad'
  externalClient = []
  constructor (ctx) {
    this.ctx = ctx
  }

  run () {
    const { sensorService, eventService } = this.ctx

    this.client = mqtt.connect(`mqtt://${process.env.MQTT_URL}`)
    this.client.on('disconnect', () => {
      console.log('disconnect mqtt')
    })
    this.client.on('reconnect', () => {
      console.log('reconnect mqtt')
    })
    this.client.on('offline', () => {
      console.log('offline mqtt')
    })
    this.client.on('connect', () => {
      this.client.subscribe(MqttService.afTopic, (err) => {
        if (!err) { console.log('client subscribe to topic', MqttService.afTopic) } else {
          console.log('error subscribe to topic', MqttService.afTopic)
        }
      })
      this.client.subscribe(MqttService.wdTopic, (err) => {
        if (!err) { console.log('client subscribe to topic', MqttService.wdTopic) } else {
          console.log('error subscribe to topic', MqttService.wdTopic)
        }
      })
    })
    this.client.on('message', async (topic, payload) => {
      const strPayload = payload.toString()
      const jsonPayload = JSON.parse(strPayload)
      switch (true) {
        case (topic === MqttService.afTopic): {
          sensorService.addSensorData(jsonPayload)
          const changedState = await eventService.admEventAF(jsonPayload)
          if (changedState.length) {
            this.sendBroadcast({ payload: JSON.stringify(changedState) })
          }
          break
        }
        case (topic === MqttService.wdTopic): {
          eventService.admEventFD(jsonPayload)
          break
        }
      }
      this.sendBroadcast({ payload: strPayload, type: topic })
    })
  }

  sendBroadcast ({ payload, type = MqttService.eventBroadMessage }) {
    this.externalClient.forEach(({ send }) => {
      send({ msg: payload, type })
    })
  }

  linkClient ({ send, id }) {
    this.externalClient.push({ send, id })
  }

  unlinkClient ({ id }) {
    this.externalClient = this.externalClient.filter(({ id: extId }) => extId !== id)
  }

  async publishAf (data) {
    this.client.publish(MqttService.afDevTopic, data)
  }

  publishWd (data) {
    this.client.publish(MqttService.wdDevTopic, data)
  }
}
