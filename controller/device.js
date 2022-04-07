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
