let { Sequelize, DataTypes, Model } =require('sequelize');
let sequelizeConfig=require("./config/config.cjs");
const userModel=require("./models/user.cjs")
const eventModel=require("./models/event.cjs")
const lastEventModel=require("./models/lastEvent.cjs")
const sensorModel=require("./models/sensor.cjs")

class sequelizeService{
    async init(config='development') {
        this.sequelize=new Sequelize(sequelizeConfig[config]);
        try {
            await this.sequelize.authenticate()
            console.log('DB:run success!!!')
        } catch (e) {
            console.log('DB:run error', e)
        }

        this.userModel=userModel(this.sequelize,DataTypes);
        this.eventModel=eventModel(this.sequelize,DataTypes);
        this.lastEventModel=lastEventModel(this.sequelize,DataTypes);
        this.sensorModel=sensorModel(this.sequelize,DataTypes);
        return {
            userModel:this.userModel,
            eventModel:this.eventModel,
            lastEventModel:this.lastEventModel,
            sensorModel:this.sensorModel,
            sequelize:this.sequelize
        }
    }

}

const serv=new sequelizeService();

module.exports = {
    init:serv.init
}

