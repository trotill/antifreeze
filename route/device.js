import Joi from 'joi'
import { getLastEvent, getListEvent, getListSensor, sendDataMQ } from '../controller/device.js'
import { doAuth, isAdmin } from '../controller/auth.js'
import {
  getEventLastOut,
  getEventListIn,
  getEventListOut,
  getSensorListIn,
  postSetDevDataBodyOut
} from '../schema/schema.js'

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
    handler: [doAuth, isAdmin, sendDataMQ]
  },
  {
    method: 'get',
    path: '/api/eventLast',
    validate: {
      output: {
        200: {
          body: getEventLastOut
        }
      }
    },
    handler: [doAuth, getLastEvent]
  },
  {
    method: 'get',
    path: '/api/eventList',
    validate: {
      type: 'json',
      body: getEventListIn,
      output: {
        200: {
          body: getEventListOut
        }
      }
    },
    handler: [doAuth, getListEvent]
  },
  {
    method: 'get',
    path: '/api/sensorList',
    validate: {
      type: 'json',
      body: getSensorListIn
    },
    handler: [doAuth, getListSensor]
  },
  {
    method: 'put',
    path: '/api/eventMark/:id',
    handler: [doAuth, sendDataMQ]
  },
  {
    method: 'get',
    path: '/api/sensorList',
    validate: {
      output: {
        200: {
          body: postSetDevDataBodyOut
        }
      }
    },
    handler: [doAuth, sendDataMQ]
  }]

export { deviceRoute }
