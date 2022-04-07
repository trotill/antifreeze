import mqtt from 'mqtt'


class MqttService{
    static afTopic='/srv/antiFreeze'
    static wdTopic='/srv/footerDog'
    static afDevTopic='/dev/antiFreeze'
    static wdDevTopic='/dev/footerDog'
    externalClient=[]
    run(){
        this.client  = mqtt.connect(`mqtt://${process.env.MQTT_URL}`)
        this.client.on('disconnect', () => {
            console.log("disconnect mqtt");
        })
        this.client.on('reconnect', () => {
            console.log("reconnect mqtt");
        })
        this.client.on('offline', () => {
            console.log("offline mqtt");
        })
        this.client.on('connect', () => {
            this.client.subscribe(MqttService.afTopic,  (err)=> {
                if (!err)
                    console.log("client subscribe to topic",MqttService.afTopic);
                else{
                    console.log("error subscribe to topic",MqttService.afTopic);
                }
            })
            this.client.subscribe(MqttService.wdTopic,  (err)=> {
                if (!err)
                    console.log("client subscribe to topic",MqttService.wdTopic);
                else{
                    console.log("error subscribe to topic",MqttService.wdTopic);
                }
            })
        });
        this.client.on('message', (topic, payload) => {
            this.externalClient.forEach(({send})=>{
                send({msg:payload.toString(),type:topic})
            })
        });
    }
    linkClient({send,id}){
        this.externalClient.push({send,id})
    }
    unlinkClient({id}){
        this.externalClient=this.externalClient.filter(({id:extId})=>extId!==id)
    }
    publishAf(data){
        this.client.publish(MqttService.afDevTopic, data)
    }
    publishWd(data){
        this.client.publish(MqttService.wdDevTopic, data)
    }
}

let mqttService

export default mqttService||(mqttService=new MqttService())
