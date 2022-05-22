import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { error } from '../api/error.js'

export default class {
  constructor (ctx) {
    const { authRepository } = ctx

    this.authRepository = authRepository
    this.publicKey = fs.readFileSync(path.resolve('../back/key/public.pem')).toString()
    this.privateKey = fs.readFileSync(path.resolve('../back/key/private.pem')).toString()
  }

  async checkLogin ({ password, login }) {
    const findUser = await this.authRepository.findUserByLogin({ login })
    await new Promise(resolve => setTimeout(resolve, 100))

    if (!findUser) { return false }

    if (findUser.password !== password) { console.log('incorrect password') }

    return (findUser.password === password) ? findUser : null
  }

  async checkToken ({ token }) {
    const tokenDec = await this.checkJWT({ token })

    if (!tokenDec.decoded) {
      return {
        login: null,
        group: null,
        error: error.tokenError
      }
    } else {
      return {
        login: tokenDec.decoded.login,
        group: tokenDec.decoded.group,
        error: null
      }
    }
  }

  async getUserInfo ({ login, disable = false }) {
    return this.authRepository.findUserByLogin({ login, disable })
  }

  async checkJWT ({ token }) {
    return new Promise((resolve) => {
      try {
        jwt.verify(token, this.publicKey, function (err, decoded) {
          resolve({ err, decoded })
        })
      } catch (err) {
        resolve({ err: 'UNDEF_ERROR', decoded: {} })
      }
    })
  }

  async regenJwtPairByLogin ({ login, group = 'user' }) {
    const accessToken = jwt.sign({ login, group, type: 'access' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.ACCESS_TIMEOUT })
    const refreshToken = jwt.sign({ login, group, type: 'refresh' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.REFRESH_TIMEOUT })
    return {
      access: accessToken,
      refresh: refreshToken
    }
  }

  async regenJwtPairByRefresh ({ refresh }) {
    const refreshDec = await this.checkJWT({ token: refresh })
    if (refreshDec.decoded) {
      const { login, group = 'user' } = refreshDec.decoded
      const accessToken = jwt.sign({ login, group, type: 'access' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.ACCESS_TIMEOUT })
      const refreshToken = jwt.sign({ login, group, type: 'refresh' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.REFRESH_TIMEOUT })
      return {
        access: accessToken,
        refresh: refreshToken
      }
    }
    return null
  }
}
