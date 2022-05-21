import chai from 'chai'
import AuthService from '../../service/auth.js'
import AuthRepository from '../../repositories/auth.js'
import dbService from '../../db/dbService.cjs'
import { Sequelize, Op } from 'sequelize'
import createUserMigration from '../../db/migrations/00-create-user.cjs'
import addUserDisable from '../../db/migrations/06-add-user-disable.cjs'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import jshashes from 'jshashes'
import { sleep } from '../../api/util.js'

const { expect } = chai

describe('auth service test', async function () {
  let queryInterface
  let authService
  let authRepository
  let adminToken
  let publicKey
  function generatePassword ({ login, password }) {
    return new jshashes.SHA1().b64(login + password)
  }
  before(async () => {
    const db = await dbService.init('mocha')
    const { sequelize } = db
    queryInterface = sequelize.getQueryInterface()
    await createUserMigration.up(queryInterface, Sequelize)
    await addUserDisable.up(queryInterface, Sequelize)
    authRepository = new AuthRepository(db)
    authService = new AuthService({ authRepository })
    publicKey = fs.readFileSync(path.resolve('key/public.pem')).toString()
  })

  it('createUser', async () => {
    await authRepository.createUser({
      login: 'admin',
      group: 'admin',
      disable: false,
      password: generatePassword({ login: 'admin', password: 'admin' }),
      firstName: 'first',
      lastName: 'last',
      email: 'first@last'
    })
    const result = await authService.getUserInfo({ login: 'admin' })
    expect(result.login).be.eql('admin')
  })
  it('changeUserGroup', async () => {
    await authRepository.changeUserGroup({ login: 'admin', group: 'admin' })
    const result = await authService.getUserInfo({ login: 'admin' })
    expect(result.group).be.eql('admin')
  })
  it('changeUserData', async () => {
    await authRepository.changeUserData({ login: 'admin', email: 'admin@admin' })
    const result = await authService.getUserInfo({ login: 'admin' })
    expect(result.email).be.eql('admin@admin')
  })
  it('regenJwtPairByLogin', async () => {
    adminToken = await authService.regenJwtPairByLogin({ login: 'admin' })

    const checkResult = await new Promise((resolve) => jwt.verify(adminToken.access, publicKey, function (err, decoded) {
      resolve({ err, decoded })
    }))
    expect(checkResult.decoded.login).be.eql('admin')
  })
  it('checkToken', async () => {
    const checkResult = await authService.checkToken({ token: adminToken.access })
    expect(checkResult.login).be.eql('admin')
  })
  it('regenJwtPairByRefresh', async () => {
    await sleep(1000)
    const checkResult = await authService.regenJwtPairByRefresh({ refresh: adminToken.refresh })
    expect(adminToken.refresh !== checkResult.refresh).be.eql(true)
    const tokenVerifyResult = await new Promise((resolve) => jwt.verify(adminToken.access, publicKey, function (err, decoded) {
      resolve({ err, decoded })
    }))
    expect(tokenVerifyResult.decoded.login).be.eql('admin')
  })
  it('checkLogin', async () => {
    const login = 'admin'
    const passwd = 'admin'
    const password = new jshashes.SHA1().b64(login + passwd)
    const trueResult = await authService.checkLogin({ password, login })
    expect(!!trueResult).be.eql(true)
    const falseResult = await authService.checkLogin({ password: ':)', login })
    expect(falseResult).be.eql(null)
  })
  after(async () => {
    await createUserMigration.down(queryInterface, Sequelize)
  })
})
