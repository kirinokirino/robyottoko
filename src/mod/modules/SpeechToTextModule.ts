import config from '../../config'
import Db from '../../Db'
import WebSocketServer, { Socket } from '../../net/WebSocketServer'
import { getText, asQueryArgs } from '../../net/xhr'
import Cache from '../../services/Cache'
import TwitchHelixClient from '../../services/TwitchHelixClient'
import { User } from '../../services/Users'
import Variables from '../../services/Variables'
import { TwitchChatClient, TwitchChatContext } from '../../types'
import WebServer from '../../WebServer'
import ModuleStorage from '../ModuleStorage'

export interface SpeechToTextModuleSettings {
  status: {
    enabled: boolean
  }
  styles: {
    // page background color
    bgColor: string
    // vertical align of text
    vAlign: 'bottom' | 'top' | 'bottom'

    // recognized text
    recognition: {
      fontFamily: string
      fontSize: string
      fontWeight: string
      strokeWidth: string
      strokeColor: string
      color: string
    }

    // translated text
    translation: {
      fontFamily: string
      fontSize: string
      fontWeight: string
      strokeWidth: string
      strokeColor: string
      color: string
    }
  }

  recognition: {
    display: boolean
    lang: string
    synthesize: boolean
    synthesizeLang: string
  }

  translation: {
    enabled: boolean
    langSrc: string
    langDst: string
    synthesize: boolean
    synthesizeLang: string
  }
}

interface SpeechToTextModuleData {
  settings: SpeechToTextModuleSettings
}

interface SpeechToTextTranslateEventData {
  text: string
  src: string
  dst: string
}

export interface SpeechToTextWsInitData {
  settings: SpeechToTextModuleSettings
  defaultSettings: SpeechToTextModuleSettings
}

interface SpeechToTextWsData {
  event: string
  data: SpeechToTextWsInitData
}


export interface SpeechToTextSaveEventData {
  event: "save"
  settings: SpeechToTextModuleSettings
}


class SpeechToTextModule {
  public name = 'speech-to-text'
  public variables: Variables

  private user: User
  private storage: ModuleStorage
  private wss: WebSocketServer
  private defaultSettings: SpeechToTextModuleSettings
  private data: SpeechToTextModuleData

  constructor(
    db: Db,
    user: User,
    variables: Variables,
    chatClient: TwitchChatClient,
    helixClient: TwitchHelixClient,
    storage: ModuleStorage,
    cache: Cache,
    ws: WebServer,
    wss: WebSocketServer,
  ) {
    this.user = user
    this.variables = variables
    this.storage = storage
    this.wss = wss
    this.defaultSettings = {
      status: {
        enabled: false,
      },
      styles: {
        // page background color
        bgColor: '#ff00ff',
        // vertical align of text
        vAlign: 'bottom', // top|bottom

        // recognized text
        recognition: {
          fontFamily: 'sans-serif',
          fontSize: '30',
          fontWeight: '400',
          strokeWidth: '8',
          strokeColor: '#292929',
          color: '#ffff00',
        },

        // translated text
        translation: {
          fontFamily: 'sans-serif',
          fontSize: '30',
          fontWeight: '400',
          strokeWidth: '8',
          strokeColor: '#292929',
          color: '#cbcbcb',
        }
      },
      recognition: {
        display: true,
        lang: 'ja',
        synthesize: false,
        synthesizeLang: '',
      },
      translation: {
        enabled: true,
        langSrc: 'ja',
        langDst: 'en',
        synthesize: false,
        synthesizeLang: '',
      },
    }
    this.data = this.reinit()
  }

  reinit() {
    const data = this.storage.load(this.name, {
      settings: this.defaultSettings
    })
    return data as SpeechToTextModuleData
  }

  saveCommands() {
    // pass
  }

  widgets() {
    return {
      'speech-to-text': async (req: any, res: any, next: Function) => {
        res.render('widget.spy', {
          title: 'Speech to Text Widget',
          page: 'speech-to-text',
          wsUrl: `${this.wss.connectstring()}/${this.name}`,
          widgetToken: req.params.widget_token,
        })
      },
    }
  }

  getRoutes() {
    return {}
  }

  wsdata(eventName: string): SpeechToTextWsData {
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
      'translate': async (ws: Socket, { text, src, dst }: SpeechToTextTranslateEventData) => {
        const scriptId = config.modules.speechToText.google.scriptId
        const query = `https://script.google.com/macros/s/${scriptId}/exec` + asQueryArgs({
          text: text,
          source: src,
          target: dst,
        })
        const respText = await getText(query)
        this.wss.notifyOne([this.user.id], this.name, {
          event: 'translated', data: {
            in: text,
            out: respText,
          }
        }, ws)
      },
      'conn': (ws: Socket) => {
        this.updateClient('init', ws)
      },
      'save': (ws: Socket, { settings }: { settings: SpeechToTextModuleSettings }) => {
        this.data.settings = settings
        this.storage.save(this.name, this.data)
        this.reinit()
        this.updateClients('init')
      },
    }
  }
  getCommands() {
    return {}
  }

  onChatMsg(
    client: TwitchChatClient,
    target: string,
    context: TwitchChatContext,
    msg: string,
  ) {
  }
}

export default SpeechToTextModule