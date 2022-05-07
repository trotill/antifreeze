export default class AuthRepository {
  constructor (db) {
    this.model = db.userModel
  }

  async findUserByLogin ({ login }) {
    return this.model.findOne({
      where: {
        login
      }
    }).then((v) => v.toJSON())
  }
}
