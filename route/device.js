import Joi from 'joi'
import {sendDataMQ} from "../controller/device.js";
import {needToken} from "../controller/auth.js";
import { postSetDevDataBodyOut} from "../schema/schema.js";

let deviceRoute=[
    {
        method: 'post',
        path: '/setDevData',
        validate: {
            type:'json',
            body: Joi.object(),
            output: {
                200: {
                    body: postSetDevDataBodyOut
                },
            }
        },
        handler: [needToken,sendDataMQ]
    }]

export {deviceRoute};
