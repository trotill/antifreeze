import { responseFormat } from '../api/response.js'

export async function sendDataMQ (ctx) {
  const { deviceService } = ctx.inject
  const { type = 'watchdog' } = ctx.query

  deviceService.sendMqtt(ctx.request.body, type)
  ctx.response.body = responseFormat({
    error: null,
    token: null,
    data: null
  })
  ctx.status = 200
}
export async function markEventRead (ctx) {
  const { eventService } = ctx.inject
  const { id } = ctx.params
  ctx.response.body = responseFormat({ data: await eventService.markEventRead({ id }) })
  ctx.status = 204
}
export async function markEventReadAll (ctx) {
  const { eventService } = ctx.inject
  ctx.response.body = responseFormat({ data: await eventService.markEventRead({ id: { $ne: null } }) })
  ctx.status = 204
}
export async function getUnreadCount (ctx) {
  const { eventService } = ctx.inject
  ctx.response.body = responseFormat({ data: await eventService.getUnreadCount() })
  ctx.status = 200
}

export async function getLastEvent (ctx) {
  const { eventService } = ctx.inject
  ctx.response.body = responseFormat({ data: await eventService.readLastEvent() })
  ctx.status = 200
}

export async function getListEvent (ctx) {
  const { eventService } = ctx.inject
  ctx.response.body = responseFormat({ data: await eventService.readEvent(ctx.request.body) })
  ctx.status = 200
}

export async function getListSensor (ctx) {
  const { sensorRepository } = ctx.inject
  ctx.response.body = responseFormat({ data: await sensorRepository.getList(ctx.request.body) })
  ctx.status = 200
}
