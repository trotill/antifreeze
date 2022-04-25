import { sse } from '../controller/sse.js'
import { doAuth } from '../controller/auth.js'

const sseRoute = [
  {
    method: 'post',
    path: '/api/sse',
    handler: [doAuth, sse]
  }]

export { sseRoute }
