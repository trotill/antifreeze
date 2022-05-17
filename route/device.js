import Joi from 'joi'
import {
  getLastEvent,
  getListEvent,
  getListSensor,
  sendDataMQ,
  markEventRead,
  getUnreadCount
} from '../controller/device.js'
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
  // await eventInstance.markEventRead
  {
    method: 'post',
    path: '/api/eventRead/:id',
    handler: [doAuth, isAdmin, markEventRead]
  },
  {
    method: 'get',
    path: '/api/eventUnreadCount',
    handler: [doAuth, getUnreadCount]
  },
  {
    method: 'post',
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
    method: 'post',
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
    method: 'post',
    path: '/api/sensorList',
    validate: {
      type: 'json',
      body: getSensorListIn
    },
    handler: [doAuth, getListSensor]
  }]

export { deviceRoute }
