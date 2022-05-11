import mqtt from 'mqtt'
import SensorRepository from '../repositories/sensor.js'

export default class MqttService {
    static afTopic='/srv/antiFreeze'
    static wdTopic='/srv/footerDog'
    static afDevTopic='/dev/antiFreeze'
    static wdDevTopic='/dev/footerDog'
    externalClient= []
    constructor (ctx) {
      this.sensorService = ctx.sensorService
      this.eventService = ctx.eventService
    }

    run () {
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
      this.client.on('message', (topic, payload) => {
        const strPayload = payload.toString()
        const jsonPayload = JSON.parse(strPayload)
        switch (true) {
          case (topic === MqttService.afTopic): {
            this.sensorService.addSensorData(jsonPayload)
            this.eventService.admEventAF(jsonPayload)
            break
          }
          case (topic === MqttService.wdTopic): {
            this.eventService.admEventFD(jsonPayload)
            break
          }
        }
        this.externalClient.forEach(({ send }) => {
          send({ msg: strPayload, type: topic })
        })
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
