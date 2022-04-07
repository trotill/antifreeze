import { PassThrough } from 'stream'

const eventWrap = (event, data) => {
  return `event:${event}\ndata: ${data}\n\n`
}

export async function sse (ctx) {
  const stream = new PassThrough()
  const { mqttService } = ctx.inject
  const send = ({ type = 'none', msg = '' }) => stream.write(eventWrap(type, msg))

  const id = Date.now()
  mqttService.linkClient({ send, id })

  const end = (event) => {
    console.log('sse', event)
    ctx.res.end()
    stream.end()
    mqttService.unlinkClient({ id })
  }
  ctx.req.on('close', () => end('close'))
  ctx.req.on('finish', () => end('finish'))
  ctx.req.on('error', () => end('error'))
  ctx.type = 'text/event-stream'
  ctx.body = stream
}
