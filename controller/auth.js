
import { responseFormat } from '../api/response.js'
import { error } from '../api/error.js'

export async function login (ctx) {
  const { authService } = ctx.inject
  console.log('login', ctx.request.body)
  const { login } = ctx.request.body
  let token = null
  const err = !await authService.checkLogin({ password: ctx.request.body.password, login: ctx.request.body.login })
  if (!err) {
    token = await authService.regenJwtPairByLogin({ login })
  }
  ctx.response.body = responseFormat({
    error: err ? error.loginError : null,
    token,
    data: null
  })
  ctx.status = (!err) ? 200 : 511
};

export async function doAuth (ctx, next) {
  const { authService } = ctx.inject
  const { access, accept } = ctx.request.header
  if (access) {
    const { error, login } = await authService.checkToken({ token: access })
    if (error) {
      ctx.status = 511
    } else {
      ctx.inject.login = login
      await next()
      if (accept !== 'text/event-stream') {
        if (!ctx.response?.body?.meta) {
          ctx.response.body = {
            meta: {
              token: {}
            }
          }
        }

        ctx.response.body.meta.token = await authService.regenJwtPairByLogin({ login })
      }
    }
  } else { ctx.status = 401 }
}
export async function whoAmi (ctx) {
  const { login, authService } = ctx.inject

  const result = await authService.getUserInfo({ login })
  ctx.response.body = responseFormat({
    data: {
      login,
      group: result.group
    }
  })
  ctx.status = 200
}

export async function regenToken (ctx) {
  const { authService } = ctx.inject
  const { refresh } = ctx.request.header
  const result = await authService.regenJwtPairByRefresh({ refresh })
  if (result) {
    ctx.response.body = result
    ctx.status = 200
  } else {
    ctx.status = 401
  }
}
