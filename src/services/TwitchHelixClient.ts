import { RequestInit } from 'node-fetch'
import { logger } from '../common/fn'
import { postJson, getJson, asJson, withHeaders, asQueryArgs, requestText } from '../net/xhr'

const log = logger('TwitchHelixClient.ts')

const API_BASE = 'https://api.twitch.tv/helix'

type TwitchHelixSubscription = any

interface TwitchHelixOauthTokenResponseData {
  access_token: string
  refresh_token: string
  expires_in: number
  scope: string[]
  token_type: string
}

interface TwitchHelixUserSearchResponseDataEntry {
  id: string
  login: string
  display_name: string
  type: string
  broadcaster_type: string
  description: string
  profile_image_url: string
  offline_image_url: string
  view_count: number
  email: string
  created_at: string
}

interface TwitchHelixUserSearchResponseData {
  data: TwitchHelixUserSearchResponseDataEntry[]
}

interface TwitchHelixStreamSearchResponseDataEntry {
  id: string
  user_id: string
  user_login: string
  user_name: string
  game_id: string
  game_name: string
  type: string
  title: string
  viewer_count: number
  started_at: string
  language: string
  thumbnail_url: string
  tag_ids: string[]
  is_mature: boolean
}

interface TwitchHelixStreamSearchResponseData {
  data: TwitchHelixStreamSearchResponseDataEntry[]
  pagination: {
    cursor: string
  }
}

class TwitchHelixClient {
  private clientId: string
  private clientSecret: string

  constructor(
    clientId: string,
    clientSecret: string,
  ) {
    this.clientId = clientId
    this.clientSecret = clientSecret
  }

  async withAuthHeaders(opts = {}): Promise<RequestInit> {
    const accessToken = await this.getAccessToken()
    return withHeaders({
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${accessToken}`,
    }, opts)
  }

  // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
  async getAccessToken(scopes: string[] = []): Promise<string> {
    const url = `https://id.twitch.tv/oauth2/token` + asQueryArgs({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: scopes.join(' '),
    })
    const json = (await postJson(url)) as TwitchHelixOauthTokenResponseData
    return json.access_token
  }

  _url(path: string): string {
    return `${API_BASE}${path}`
  }

  // https://dev.twitch.tv/docs/api/reference#get-users
  async _getUserBy(query: any): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    const url = this._url(`/users${asQueryArgs(query)}`)
    const json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixUserSearchResponseData
    try {
      return json.data[0]
    } catch (e) {
      log.error(json)
      return null
    }
  }

  async getUserById(userId: string): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    return await this._getUserBy({ id: userId })
  }

  async getUserByName(userName: string): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    return await this._getUserBy({ login: userName })
  }

  async getUserIdByName(userName: string): Promise<string> {
    const user = await this.getUserByName(userName)
    return user ? user.id : ''
  }

  // https://dev.twitch.tv/docs/api/reference#get-streams
  async getStreams(userId: string): Promise<TwitchHelixStreamSearchResponseData> {
    const url = this._url(`/streams${asQueryArgs({ user_id: userId })}`)
    const json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixStreamSearchResponseData
    return json
  }

  async getSubscriptions() {
    const url = this._url('/eventsub/subscriptions')
    return await getJson(url, await this.withAuthHeaders())
  }

  async deleteSubscription(id: string) {
    const url = this._url(`/eventsub/subscriptions${asQueryArgs({ id: id })}`)
    return await requestText('delete', url, await this.withAuthHeaders())
  }

  async createSubscription(subscription: TwitchHelixSubscription) {
    const url = this._url('/eventsub/subscriptions')
    return await postJson(url, await this.withAuthHeaders(asJson(subscription)))
  }
}

export default TwitchHelixClient
