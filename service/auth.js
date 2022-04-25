import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { error } from '../api/error.js'

export default new class {
  constructor () {
    this.publicKey = fs.readFileSync(path.resolve('../back/key/public.pem')).toString()
    this.privateKey = fs.readFileSync(path.resolve('../back/key/private.pem')).toString()
  }

  async checkLogin ({ password, login, modelDb }) {
    const findUser = await modelDb.userModel.findAll({
      where: {
        login: login
      }
    }).then((result) => {
      return result.map(item => item.toJSON())
    })
    await new Promise(resolve => setTimeout(resolve, 100))

    if (findUser.length === 0) { return false }

    if (findUser[0].password !== password) { console.log('incorrect password') }

    return (findUser[0].password === password)
  }

  async checkToken ({ token }) {
    const tokenDec = await this.checkJWT({ token })

    if (!tokenDec.decoded) {
      return {
        login: null,
        error: error.tokenError
      }
    } else {
      console.log('good tokens')
      return {
        login: tokenDec.decoded.login,
        error: null
      }
    }
  }

  async getUserInfo ({ login, modelDb }) {
    return modelDb.userModel.findOne({
      where: {
        login
      }
    }).then((v) => v.toJSON())
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

  async regenJwtPairByLogin ({ login }) {
    const accessToken = jwt.sign({ login, type: 'access' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.ACCESS_TIMEOUT })
    const refreshToken = jwt.sign({ login, type: 'refresh' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.REFRESH_TIMEOUT })
    return {
      access: accessToken,
      refresh: refreshToken
    }
  }

  async regenJwtPairByRefresh ({ refresh }) {
    const refreshDec = await this.checkJWT({ token: refresh })
    if (refreshDec.decoded) {
      const { login } = refreshDec.decoded
      console.log('good refresh token')
      const accessToken = jwt.sign({ login, type: 'access' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.ACCESS_TIMEOUT })
      const refreshToken = jwt.sign({ login, type: 'refresh' }, this.privateKey, { algorithm: 'RS256', expiresIn: process.env.REFRESH_TIMEOUT })
      return {
        access: accessToken,
        refresh: refreshToken
      }
    }
    return null
  }
}()
