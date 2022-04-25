import { login, doAuth, whoAmi, regenToken } from '../controller/auth.js'
import { getRefreshToken, getWhoAmiBodyOut, postLoginBodyIn, postLoginBodyOut } from '../schema/schema.js'

const authRoute = [
  {
    method: 'post',
    path: '/api/login',
    validate: {
      type: 'json',
      body: postLoginBodyIn,
      output: {
        200: {
          body: postLoginBodyOut
        }
      }
    },
    handler: [login]
  }, {
    method: 'get',
    path: '/api/whoAmi',
    validate: {
      output: {
        200: {
          body: getWhoAmiBodyOut
        }
      }
    },
    handler: [doAuth, whoAmi]
  },
  {
    method: 'get',
    path: '/api/refresh',
    validate: {
      output: {
        200: {
          body: getRefreshToken
        }
      }
    },
    handler: [regenToken]
  }]

export { authRoute }
