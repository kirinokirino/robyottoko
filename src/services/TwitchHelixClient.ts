import { RequestInit } from 'node-fetch'
import { logger } from '../common/fn'
import { findIdxFuzzy } from '../fn'
import { postJson, getJson, asJson, withHeaders, asQueryArgs, requestText, request } from '../net/xhr'
import Cache from './Cache'
import { TwitchChannel } from './TwitchChannels'

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

interface TwitchHelixCategorySearchResponseDataEntry {
  id: string
  name: string
  box_art_url: string
}

interface TwitchHelixCategorySearchResponseData {
  data: TwitchHelixCategorySearchResponseDataEntry[]
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

interface TwitchHelixClipSearchResponseDataEntry {
  id: string
  url: string
  embed_url: string
  broadcaster_id: string
  broadcaster_name: string
  creator_id: string
  creator_name: string
  video_id: string
  game_id: string
  language: string
  title: string
  view_count: number
  created_at: string
  thumbnail_url: string
  duration: number
}

interface TwitchHelixClipSearchResponseData {
  data: TwitchHelixClipSearchResponseDataEntry[]
  pagination: {
    cursor: string
  }
}

interface ModifyChannelInformationData {
  game_id?: string
  broadcaster_language?: string
  title?: string
  delay?: number
}

interface TwitchHelixGetChannelInformationResponseDataEntry {
  broadcaster_id: string
  broadcaster_login: string
  broadcaster_name: string
  broadcaster_language: string
  game_id: string
  game_name: string
  title: string
  delay: number
}

interface TwitchHelixGetChannelInformationResponseData {
  data: TwitchHelixGetChannelInformationResponseDataEntry[]
}

interface TwitchHelixGetStreamTagsResponseDataEntry {
  tag_id: string
  is_auto: boolean
  localization_names: Record<string, string>
  localization_descriptions: Record<string, string>
}

interface TwitchHelixGetStreamTagsResponseData {
  data: TwitchHelixGetStreamTagsResponseDataEntry[]
  pagination: {
    cursor: string
  }
}

interface TwitchHelixGetChannelPointsCustomRewardsResponseDataEntry {
  broadcaster_name: string
  broadcaster_login: string
  broadcaster_id: string
  id: string
  image: any
  background_color: string
  is_enabled: boolean
  cost: number
  title: string
  prompt: string
  is_user_input_required: boolean
  max_per_stream_setting: {
    is_enabled: boolean
    max_per_stream: number
  }
  max_per_user_per_stream_setting: {
    is_enabled: boolean
    max_per_user_per_stream: number
  }
  global_cooldown_setting: {
    is_enabled: boolean
    global_cooldown_seconds: number
  }
  is_paused: boolean
  is_in_stock: boolean
  default_image: {
    url_1x: string
    url_2x: string
    url_4x: string
  }
  should_redemptions_skip_request_queue: boolean
  redemptions_redeemed_current_stream: any
  cooldown_expires_at: any
}

interface TwitchHelixGetChannelPointsCustomRewardsResponseData {
  data: TwitchHelixGetChannelPointsCustomRewardsResponseDataEntry[]
}

interface ValidateOAuthTokenResponse {
  valid: boolean
  data: any // raw data
}

export function getBestEntryFromCategorySearchItems(
  searchString: string,
  resp: TwitchHelixCategorySearchResponseData,
): TwitchHelixCategorySearchResponseDataEntry | null {
  const idx = findIdxFuzzy(resp.data, searchString, (item) => item.name)
  return idx === -1 ? null : resp.data[idx]
}

class TwitchHelixClient {
  private clientId: string
  private clientSecret: string
  private twitchChannels: TwitchChannel[]

  constructor(
    clientId: string,
    clientSecret: string,
    twitchChannels: TwitchChannel[],
  ) {
    this.clientId = clientId
    this.clientSecret = clientSecret
    this.twitchChannels = twitchChannels
  }

  _authHeaders(accessToken: string) {
    return {
      'Client-ID': this.clientId,
      'Authorization': `Bearer ${accessToken}`,
    }
  }

  async withAuthHeaders(opts = {}, scopes: string[] = []): Promise<RequestInit> {
    const accessToken = await this.getAccessToken(scopes)
    return withHeaders(this._authHeaders(accessToken), opts)
  }

  _oauthAccessTokenByBroadcasterId(broadcasterId: string): string | null {
    for (const twitchChannel of this.twitchChannels) {
      if (twitchChannel.channel_id === broadcasterId) {
        return twitchChannel.access_token
      }
    }
    return null
  }

  // https://dev.twitch.tv/docs/authentication/getting-tokens-oauth/
  async getAccessToken(scopes: string[] = []): Promise<string> {
    const url = `https://id.twitch.tv/oauth2/token` + asQueryArgs({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials',
      scope: scopes.join(' '),
    })
    let json
    try {
      json = await postJson(url) as TwitchHelixOauthTokenResponseData
      return json.access_token
    } catch (e) {
      log.error(url, json, e)
      return ''
    }
  }

  _url(path: string): string {
    return `${API_BASE}${path}`
  }

  // https://dev.twitch.tv/docs/api/reference#get-users
  async _getUserBy(query: any): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    const url = this._url(`/users${asQueryArgs(query)}`)
    let json
    try {
      json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixUserSearchResponseData
      return json.data[0]
    } catch (e) {
      log.error(url, json, e)
      return null
    }
  }

  async getUserById(userId: string): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    return await this._getUserBy({ id: userId })
  }

  async getUserByName(userName: string): Promise<TwitchHelixUserSearchResponseDataEntry | null> {
    return await this._getUserBy({ login: userName })
  }

  async getUserIdByName(userName: string, cache: Cache): Promise<string> {
    const cacheKey = `TwitchHelixClient::getUserIdByName(${userName})x`
    let userId = await cache.get(cacheKey)
    if (userId === null) {
      userId = await this._getUserIdByNameUncached(userName)
      await cache.set(cacheKey, userId)
    }
    return `${userId}`
  }

  async _getUserIdByNameUncached(userName: string): Promise<string> {
    const user = await this.getUserByName(userName)
    return user ? String(user.id) : ''
  }

  // https://dev.twitch.tv/docs/api/reference#get-clips
  async getClipByUserId(
    userId: string,
    startedAtRfc3339: string,
    endedAtRfc3339: string,
    maxDurationSeconds: number,
  ) {
    const url = this._url(`/clips${asQueryArgs({
      broadcaster_id: userId,
      started_at: startedAtRfc3339,
      ended_at: endedAtRfc3339,
    })}`)
    let json
    try {
      json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixClipSearchResponseData
      const filtered = json.data.filter(item => item.duration <= maxDurationSeconds)
      return filtered[0]
    } catch (e) {
      log.error(url, json, e)
      return null
    }
  }

  // https://dev.twitch.tv/docs/api/reference#get-streams
  async getStreamByUserId(userId: string) {
    const url = this._url(`/streams${asQueryArgs({ user_id: userId })}`)
    let json
    try {
      json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixStreamSearchResponseData
      return json.data[0]
    } catch (e) {
      log.error(url, json, e)
      return null
    }
  }

  async getSubscriptions() {
    const url = this._url('/eventsub/subscriptions')
    try {
      return await getJson(url, await this.withAuthHeaders())
    } catch (e) {
      log.error(url, e)
      return null
    }
  }

  async deleteSubscription(id: string) {
    const url = this._url(`/eventsub/subscriptions${asQueryArgs({ id: id })}`)
    try {
      return await requestText('delete', url, await this.withAuthHeaders())
    } catch (e) {
      log.error(url, e)
      return null
    }
  }

  async createSubscription(subscription: TwitchHelixSubscription) {
    const url = this._url('/eventsub/subscriptions')
    try {
      return await postJson(url, await this.withAuthHeaders(asJson(subscription)))
    } catch (e) {
      log.error(url, e)
      return null
    }
  }

  // https://dev.twitch.tv/docs/api/reference#search-categories
  async searchCategory(searchString: string) {
    const url = this._url(`/search/categories${asQueryArgs({ query: searchString })}`)
    let json
    try {
      json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixCategorySearchResponseData
      return getBestEntryFromCategorySearchItems(searchString, json)
    } catch (e) {
      log.error(url, json)
      return null
    }
  }

  // https://dev.twitch.tv/docs/api/reference#get-channel-information
  async getChannelInformation(broadcasterId: string) {
    const url = this._url(`/channels${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    let json
    try {
      json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixGetChannelInformationResponseData
      return json.data[0]
    } catch (e) {
      log.error(url, json)
      return null
    }
  }

  // https://dev.twitch.tv/docs/api/reference#modify-channel-information
  async modifyChannelInformation(broadcasterId: string, data: ModifyChannelInformationData) {
    const accessToken = this._oauthAccessTokenByBroadcasterId(broadcasterId)
    if (!accessToken) {
      return null
    }

    const url = this._url(`/channels${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    try {
      return await request('patch', url, withHeaders(this._authHeaders(accessToken), asJson(data)))
    } catch (e) {
      log.error(url, e)
      return null
    }
  }

  async getAllTags() {
    const allTags: TwitchHelixGetStreamTagsResponseDataEntry[] = []
    let cursor: any = null
    const first = 100
    do {
      const url = cursor
        ? this._url(`/tags/streams${asQueryArgs({ after: cursor, first })}`)
        : this._url(`/tags/streams${asQueryArgs({ first })}`)
      const json = await getJson(url, await this.withAuthHeaders()) as TwitchHelixGetStreamTagsResponseData
      const entries = json.data
      allTags.push(...entries)
      cursor = json.pagination.cursor // is undefined when there are no more pages
    } while (cursor)
    return allTags
  }

  // https://dev.twitch.tv/docs/api/reference#get-stream-tags
  async getStreamTags(broadcasterId: string) {
    const url = this._url(`/streams/tags${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    try {
      return await getJson(url, await this.withAuthHeaders()) as TwitchHelixGetStreamTagsResponseData
    } catch (e) {
      log.error(url, e)
      return null
    }
  }

  // https://dev.twitch.tv/docs/api/reference#get-custom-reward
  async getChannelPointsCustomRewards(broadcasterId: string) {
    const accessToken = this._oauthAccessTokenByBroadcasterId(broadcasterId)
    if (!accessToken) {
      return null
    }

    const url = this._url(`/channel_points/custom_rewards${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    try {
      const json = await getJson(url, withHeaders(this._authHeaders(accessToken))) as any
      if (json.error) {
        return null
      }
      return json as TwitchHelixGetChannelPointsCustomRewardsResponseData
    } catch (e) {
      console.log(url, e)
      return null
    }
  }

  async getAllChannelPointsCustomRewards() {
    const rewards: Record<string, string[]> = {}
    for (const twitchChannel of this.twitchChannels) {
      const res = await this.getChannelPointsCustomRewards(twitchChannel.channel_id)
      if (res) {
        rewards[twitchChannel.channel_name] = res.data.map(entry => entry.title);
      }
    }
    return rewards
  }

  // https://dev.twitch.tv/docs/api/reference#replace-stream-tags
  async replaceStreamTags(broadcasterId: string, tagIds: string[]) {
    const accessToken = this._oauthAccessTokenByBroadcasterId(broadcasterId)
    if (!accessToken) {
      return null
    }

    const url = this._url(`/streams/tags${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    try {
      return await request('put', url, withHeaders(this._authHeaders(accessToken), asJson({ tag_ids: tagIds })))
    } catch (e) {
      console.log(url, e)
      return null
    }
  }

  async validateOAuthToken(broadcasterId: string, accessToken: string): Promise<ValidateOAuthTokenResponse> {
    const url = this._url(`/channels${asQueryArgs({ broadcaster_id: broadcasterId })}`)
    let json
    try {
      json = await getJson(url, withHeaders(this._authHeaders(accessToken))) as TwitchHelixGetChannelInformationResponseData
      return { valid: json.data[0] ? true : false, data: json }
    } catch (e) {
      return { valid: false, data: json }
    }
  }
}

export default TwitchHelixClient
