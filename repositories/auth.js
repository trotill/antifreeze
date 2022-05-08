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
  async createUser(data){
    const {login,password,firstName='anonymous',lastName='anonymous',email=''}=data
    return this.model.create({
      login,
      group:'user',
      password,
      firstName,
      lastName,
      email
    })
  }
  async changeUserData({login,password='',firstName='',lastName='',email=''}){
    const updated={}
    password&&(updated.password=password)
    firstName&&(updated.firstName=firstName)
    lastName&&(updated.lastName=lastName)
    email&&(updated.email=email)
    return this.model.update(updated,{where:{login}})
  }
  async changeUserGroup({login,group}){
    return this.model.update({group},{where:{login}})
  }
}
