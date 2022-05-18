
import { responseFormat } from '../api/response.js'
import { error } from '../api/error.js'

export async function login (ctx) {
  const { authService } = ctx.inject
  const { login } = ctx.request.body
  let token = null
  const result = await authService.checkLogin({ password: ctx.request.body.password, login: ctx.request.body.login })
  if (result) {
    token = await authService.regenJwtPairByLogin({ login, group: result.group })
  }
  ctx.response.body = responseFormat({
    error: !result ? error.loginError : null,
    token,
    data: null
  })
  ctx.status = (result) ? 200 : 511
};

export async function doAuth (ctx, next) {
  const { authService } = ctx.inject
  const { access, accept } = ctx.request.header
  if (access) {
    const { error, login, group } = await authService.checkToken({ token: access })
    if (error) {
      ctx.status = 511
    } else {
      ctx.inject.login = login
      ctx.inject.group = group
      await next()
      if (accept !== 'text/event-stream') {
        if (!ctx.response?.body) {
          ctx.response.body = {
            meta: {
              token: {}
            }
          }
        }
        if (!ctx.response.body?.meta) {
          ctx.response.body.meta = {}
        }
        ctx.response.body.meta.token = await authService.regenJwtPairByLogin({ login, group })
      }
    }
  } else { ctx.status = 401 }
}
export async function isAdmin (ctx, next) {
  const { group } = ctx.inject
  const { access } = ctx.request.header
  if (access) {
    if (group === 'admin') {
      await next()
      return
    }
  }
  ctx.status = 405
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

export async function createUser (ctx) {
  const { authRepository } = ctx.inject
  await authRepository.createUser(ctx.request.body).then(() => {
    ctx.status = 204
  }).catch(() => {
    ctx.status = 406
  })
}

export async function changeUserData (ctx) {
  const { authRepository, group, login } = ctx.inject
  if (group !== 'admin') {
    ctx.request.body.login = login
  }
  await authRepository.changeUserData(ctx.request.body).then(() => {
    ctx.status = 204
  }).catch(() => {
    ctx.status = 406
  })
}

export async function changeUserGroup (ctx) {
  const { authRepository } = ctx.inject
  await authRepository.changeUserGroup(ctx.request.body).then(() => {
    ctx.status = 204
  }).catch(() => {
    ctx.status = 406
  })
}

export async function getUser (ctx) {
  const { authRepository, login } = ctx.inject
  try {
    const result = await authRepository.findUserByLogin({ login })
    ctx.status = 200
    ctx.response.body = responseFormat({ data: result })
  } catch (e) {
    console.log(e)
    ctx.status = 406
  }
}

export async function getUserList (ctx) {
  const { authRepository } = ctx.inject
  try {
    const result = (await authRepository.getUserList()).map(({ password, ...all }) => all)
    ctx.status = 200
    ctx.response.body = responseFormat({ data: result })
  } catch (e) {
    console.log(e)
    ctx.status = 406
  }
}
