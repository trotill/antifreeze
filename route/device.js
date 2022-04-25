import Joi from 'joi'
import { sendDataMQ } from '../controller/device.js'
import { doAuth } from '../controller/auth.js'
import { postSetDevDataBodyOut } from '../schema/schema.js'

const deviceRoute = [
  {
    method: 'post',
    path: '/api/setDevData',
    validate: {
      type: 'json',
      body: Joi.object(),
      output: {
        200: {
          body: postSetDevDataBodyOut
        }
      }
    },
    handler: [doAuth, sendDataMQ]
  }]

export { deviceRoute }
