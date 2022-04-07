import { login, whoAmi } from '../controller/auth.js'
import { getWhoAmiBodyOut, postLoginBodyIn, postLoginBodyOut } from '../schema/schema.js'

const authRoute = [
  {
    method: 'post',
    path: '/login',
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
    path: '/whoAmi',
    validate: {
      output: {
        200: {
          body: getWhoAmiBodyOut
        }
      }
    },
    handler: [whoAmi]
  }]

export { authRoute }
