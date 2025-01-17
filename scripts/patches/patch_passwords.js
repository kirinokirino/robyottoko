import config from './../../src/config'
import Db from './../../src/Db'
import fn from './../../src/fn'

const db = new Db(config.db)
const users = db.getMany('user')
users.forEach(user => {
  if (!user.salt) {
    // if user doesnt have salt set yet, it means in this case that there
    // is still a plain pw in db >< with introduction of salt, we also
    // only store pw hashes
    const salt = fn.passwordSalt()
    const plainPass = user.pass
    const pass = fn.passwordHash(plainPass, salt)
    db.update('user', { salt, pass }, { id: user.id })
  }
})
