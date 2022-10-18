import Koa from 'koa'
import serve from 'koa-static'
import router from 'koa-joi-router'
import { authRoute } from './route/auth.js'
import { sseRoute } from './route/sse.js'
import { deviceRoute } from './route/device.js'
import dbService from './db/dbService.cjs'
import http2 from 'http2'
import fs from 'fs'
import MqttService from './service/mq.js'
import deviceServiceFactory from './service/device.js'
import AuthRepository from './repositories/auth.js'
import SensorRepository from './repositories/sensor.js'
import EventRepository from './repositories/event.js'
import LastEventRepository from './repositories/lastEvent.js'
import AuthService from './service/auth.js'
import SensorService from './service/sensor.js'
import EventService from './service/event.js'
import { JobService } from './service/job.js'
import cors from '@koa/cors'

async function run () {
  const modelDb = await dbService.init()
  const context = {
    sensorRepository: new SensorRepository(modelDb),
    eventRepository: new EventRepository(modelDb),
    lastEventRepository: new LastEventRepository(modelDb),
    authRepository: new AuthRepository(modelDb)
  }
  context.mqttService = new MqttService(context)
  context.sensorService = new SensorService(context)
  context.authService = new AuthService(context)
  context.eventService = new EventService(context)

  context.deviceService = deviceServiceFactory(context)

  const jobService = new JobService(context)
  const { PORT = 8080, HTTP2_MODE, DISABLE_CORS } = process.env
  const pubRouter = router()
  const app = new Koa()
  pubRouter.route(authRoute)
  pubRouter.route(sseRoute)
  pubRouter.route(deviceRoute)
  if (DISABLE_CORS === 'true') { app.use(cors()) }
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (err) {
      // will only respond with JSON
      ctx.status = err.statusCode || err.status || 500
      ctx.body = {
        message: err.message
      }
    }
  })

  app.use(serve('front'))
  app.use(async (ctx, next) => {
    ctx.inject = context

    await next()
  })

  app.use(pubRouter.middleware())

  if (HTTP2_MODE === 'true') {
    const options = {
      key: fs.readFileSync('./key/http2_private.key'),
      cert: fs.readFileSync('./key/http2_cert.crt')
    }

    http2.createSecureServer(options, app.callback())
      .listen(PORT, () => console.log('listening on port %i', PORT))
  } else { app.listen(PORT, () => console.log('listening on port %i', PORT)) }

  jobService.start()
  context.eventService.init()
  context.mqttService.run()
}
run()
