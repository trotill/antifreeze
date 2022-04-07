let { Sequelize, DataTypes, Model } =require('sequelize');
let sequelizeConfig=require("./config/config.cjs");
let userModel=require("./models/user.cjs")

class sequelizeService{
    async init() {
        this.sequelize=new Sequelize(sequelizeConfig.development);
        try {
            await this.sequelize.authenticate()
            console.log('DB:run success!!!')
        } catch (e) {
            console.log('DB:run error', e)
        }

        this.userModel=userModel(this.sequelize,DataTypes);
        return {
            userModel:this.userModel
        }
    }

}

const serv=new sequelizeService();

module.exports = {
    init:serv.init
}

