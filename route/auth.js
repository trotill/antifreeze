import {
  login,
  doAuth,
  whoAmi,
  regenToken,
  createUser,
  changeUserData,
  changeUserGroup,
  getUser, isAdmin
} from '../controller/auth.js'

import {
  getRefreshToken, getUserIn, getUserOut,
  getWhoAmiBodyOut,
  postLoginBodyIn,
  postLoginBodyOut,
  postUserIn, putUserGroupIn,
  putUserIn
} from '../schema/schema.js'

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
  },

  {
    method: 'post',
    path: '/api/user',
    validate: {
      type: 'json',
      body: postUserIn
    },
    handler: [createUser]
  },
  {
    method: 'put',
    path: '/api/user',
    validate: {
      type: 'json',
      body: putUserIn
    },
    handler: [doAuth, changeUserData]
  },
  {
    method: 'put',
    path: '/api/userGroup',
    validate: {
      type: 'json',
      body: putUserGroupIn
    },
    handler: [doAuth, isAdmin, changeUserGroup]
  },
  {
    method: 'get',
    path: '/api/user',
    validate: {
      type: 'json',
      body: getUserIn,
      output: {
        200: {
          body: getUserOut
        }
      }
    },
    handler: [doAuth, isAdmin, getUser]
  }]

export { authRoute }
