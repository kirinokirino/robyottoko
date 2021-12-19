import Db from '../../Db'
import fn, { logger } from '../../fn'
import fs from 'fs'
import WebServer from '../../WebServer'
import WebSocketServer, { Socket } from '../../net/WebSocketServer'
import Tokens from '../../services/Tokens'
import Variables from '../../services/Variables'
import { ChatMessageContext, DrawcastSettings, TwitchChannelPointsRedemption } from '../../types'
import ModuleStorage from '../ModuleStorage'
import { User } from '../../services/Users'
import Cache from '../../services/Cache'
import TwitchClientManager from '../../net/TwitchClientManager'

const log = logger('AvatarModule.ts')

type int = number
type SlotName = string
type SlotUrl = string
type StateValue = string

export interface AvatarModuleAnimationFrameDefinition {
  url: SlotUrl
  duration: int
}

export interface AvatarModuleSlotItemStateDefinition {
  state: StateValue
  frames: AvatarModuleAnimationFrameDefinition[]
}

export interface AvatarModuleAvatarSlotItem {
  title: string
  states: AvatarModuleSlotItemStateDefinition[]
}

export interface AvatarModuleAvatarSlotDefinition {
  slot: SlotName
  defaultItemIndex: int
  items: AvatarModuleAvatarSlotItem[]
}

export interface AvatarModuleAvatarStateDefinition {
  value: StateValue
  deletable: boolean
}

export interface AvatarModuleAvatarDefinition {
  name: string
  stateDefinitions: AvatarModuleAvatarStateDefinition[]
  slotDefinitions: AvatarModuleAvatarSlotDefinition[]
}

export interface AvatarModuleSettings {
  avatarDefinitions: AvatarModuleAvatarDefinition[]
}

export interface AvatarModuleData {
  settings: AvatarModuleSettings
}

export interface AvatarModuleWsInitData {
  settings: AvatarModuleSettings
  defaultSettings: AvatarModuleSettings
}

export interface AvatarModuleWsSaveData {
  event: 'save'
  settings: AvatarModuleSettings
}

class AvatarModule {
  public name = 'avatar'
  public variables: Variables

  private user: User
  private wss: WebSocketServer
  private storage: ModuleStorage
  private ws: WebServer
  private tokens: Tokens

  private data: AvatarModuleData
  private defaultSettings: AvatarModuleSettings = {
    avatarDefinitions: []
  }

  constructor(
    db: Db,
    user: User,
    variables: Variables,
    clientManager: TwitchClientManager,
    storage: ModuleStorage,
    cache: Cache,
    ws: WebServer,
    wss: WebSocketServer,
  ) {
    this.variables = variables
    this.user = user
    this.wss = wss
    this.storage = storage

    this.ws = ws
    this.tokens = new Tokens(db)
    this.data = this.reinit()
  }

  saveCommands() {
    // pass
  }

  reinit(): AvatarModuleData {
    const data = this.storage.load(this.name, {
      settings: this.defaultSettings
    })

    // -start- fixes to old data structure
    for (let avatarDef of data.settings.avatarDefinitions) {
      for (let slotDef of avatarDef.slotDefinitions) {
        for (let item of slotDef.items) {
          // delete item.url
          // item.states = item.animation
          // delete item.animation
          // avatarDef.stateDefinitions.map((stateDefinition: AvatarModuleAvatarStateDefinition) => ({state: stateDefinition.value, frames: [] }))
        }
      }
    }
    // -end-   fixes to old data structure


    return {
      settings: data.settings
    }
  }

  widgets() {
    return {
      'avatar': (req: any, res: any, next: Function) => {
        return {
          title: 'Avatar Widget',
          page: 'avatar',
          wsUrl: `${this.wss.connectstring()}/${this.name}`,
          widgetToken: req.params.widget_token,
        }
      },
    }
  }

  getRoutes() {
    return {}
  }

  wsdata(eventName: string) {
    return {
      event: eventName,
      data: Object.assign({}, this.data, { defaultSettings: this.defaultSettings }),
    };
  }

  updateClient(eventName: string, ws: Socket) {
    this.wss.notifyOne([this.user.id], this.name, this.wsdata(eventName), ws)
  }

  updateClients(eventName: string) {
    this.wss.notifyAll([this.user.id], this.name, this.wsdata(eventName))
  }

  getWsEvents() {
    return {
      'conn': (ws: Socket) => {
        this.updateClient('init', ws)
      },
      'save': (ws: Socket, data: AvatarModuleWsSaveData) => {
        this.data.settings = data.settings
        this.storage.save(this.name, this.data)
        this.data = this.reinit()
        this.updateClients('init')
      },
    }
  }

  getCommands() {
    return {}
  }

  async onChatMsg(chatMessageContext: ChatMessageContext) {
  }

  async handleRewardRedemption(redemption: TwitchChannelPointsRedemption) {
  }
}

export default AvatarModule