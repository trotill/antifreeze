export default class AuthRepository {
  constructor (db) {
    this.model = db.userModel
  }

  async findUserByLogin ({ login, disable = false }) {
    return this.model.findOne({
      where: {
        login,
        disable
      }
    }).then((v) => v.toJSON())
  }

  async getUserList () {
    return this.model.findAll({}).then((v) => v.map(u => u.toJSON()))
  }

  async createUser (data) {
    const { login, password, firstName = 'anonymous', lastName = 'anonymous', email = '', disable = false } = data
    return this.model.create({
      login,
      group: 'user',
      password,
      firstName,
      lastName,
      email,
      disable
    })
  }

  async changeUserData ({ login, password = '', firstName = '', lastName = '', email, disable }) {
    const updated = {}
    password && (updated.password = password)
    firstName && (updated.firstName = firstName)
    lastName && (updated.lastName = lastName)
    if (email !== undefined) updated.email = email
    if (disable !== undefined) updated.disable = disable

    return this.model.update(updated, { where: { login } })
  }

  async changeUserGroup ({ login, group }) {
    return this.model.update({ group }, { where: { login } })
  }
}
