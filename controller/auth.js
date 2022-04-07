import authService from '../service/auth.js'
import { responseFormat } from '../api/response.js'
import { error } from '../api/error.js'

export async function login (ctx) {
  console.log('login', ctx.request.body)
  let token = null
  const err = !await authService.checkLogin({ password: ctx.request.body.password, login: ctx.request.body.login, modelDb: ctx.inject.modelDb })
  if (!err) {
    token = await authService.regenJWT(ctx.request.body)
  }
  ctx.response.body = responseFormat({
    error: err ? error.loginError : null,
    token,
    data: null
  })
  ctx.status = (!err) ? 200 : 511
};

export async function needToken (ctx, next) {
  if (ctx.request.header.token) {
    const { modelDb } = ctx.inject
    const tokenFromClient = JSON.parse(ctx.request.header.token)
    const { error } = await authService.checkToken({ token: tokenFromClient, modelDb })
    if (error) {
      ctx.status = 511
    } else {
      next()
    }
  } else { ctx.status = 401 }
}
export async function whoAmi (ctx) {
  // if (await AuthService.checkLogin(ctx.request.body)){
  // console.log(ctx.request.header)

  if (ctx.request.header.token) {
    const tokenFromClient = JSON.parse(ctx.request.header.token)
    const { token, login, error } = await authService.checkToken({ token: tokenFromClient, modelDb: ctx.inject.modelDb })

    if (!error) {
      ctx.response.body = responseFormat({
        error,
        token,
        data: {
          login
        }
      })
    } else {
      ctx.response.body = responseFormat({
        error,
        token: null,
        data: null
      })
    }
  }

  ctx.status = 200
}
