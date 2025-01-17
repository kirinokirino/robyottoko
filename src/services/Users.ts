import Db, { WhereRaw } from "../DbPostgres"

const TABLE = 'robyottoko.user'

export interface User {
  id: number
  name: string
  pass: string
  salt: string
  email: string
  status: string // 'verification_pending' |
  tmi_identity_username: string
  tmi_identity_password: string
  tmi_identity_client_id: string
  tmi_identity_client_secret: string
}

export interface UpdateUser {
  id: number
  name?: string
  pass?: string
  salt?: string
  email?: string
  status?: string // 'verification_pending' |
  tmi_identity_username?: string
  tmi_identity_password?: string
  tmi_identity_client_id?: string
  tmi_identity_client_secret?: string
}

export interface CreateUser {
  name: string
  pass: string
  salt: string
  email: string
  status: string // 'verification_pending' |
  tmi_identity_username: string
  tmi_identity_password: string
  tmi_identity_client_id: string
  tmi_identity_client_secret: string
}

class Users {
  private db: Db
  constructor(db: Db) {
    this.db = db
  }

  async get(by: WhereRaw): Promise<User | null> {
    return await this.db.get(TABLE, by) || null
  }

  async all(): Promise<User[]> {
    return await this.db.getMany(TABLE)
  }

  async getById(id: number): Promise<User | null> {
    return await this.get({ id })
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.get({ email })
  }

  async getByName(name: string): Promise<User | null> {
    return await this.get({ name })
  }

  async save(user: UpdateUser): Promise<void> {
    await this.db.upsert(TABLE, user, { id: user.id })
  }

  async getGroups(id: number): Promise<string[]> {
    const rows: { name: string }[] = await this.db._getMany(`
select g.name from robyottoko.user_group g
inner join robyottoko.user_x_user_group x on x.user_group_id = g.id
where x.user_id = $1`, [id])
    return rows.map(r => r.name)
  }

  async createUser(user: CreateUser): Promise<number> {
    return (await this.db.insert(TABLE, user)) as number
  }

  async countVerifiedUsers(): Promise<number> {
    const rows = await this.db.getMany(TABLE, { status: 'verified' })
    return rows.length
  }
}

export default Users
