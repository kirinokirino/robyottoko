import { Bot, CommandFunction, RawCommand, TwitchChatClient, TwitchChatContext } from '../types'
import fn from './../fn'
import { logger } from './../common/fn'
import { User } from '../services/Users'
import { getChatters } from '../services/Chatters'

const log = logger('chatters.ts')

const chatters = (
  bot: Bot,
  user: User
): CommandFunction => async (
  _command: RawCommand | null,
  client: TwitchChatClient | null,
  target: string | null,
  context: TwitchChatContext | null,
  ) => {
    const helixClient = bot.getUserTwitchClientManager(user).getHelixClient()
    if (!client || !context || !helixClient) {
      log.info('client', client)
      log.info('context', context)
      log.info('helixClient', helixClient)
      log.info('unable to execute chatters command, client, context, or helixClient missing')
      return
    }

    const say = fn.sayFn(client, target)

    const stream = await helixClient.getStreamByUserId(context['room-id'])
    if (!stream) {
      say(`It seems this channel is not live at the moment...`)
      return
    }

    const userNames = await getChatters(bot.getDb(), context['room-id'], new Date(stream.started_at))
    if (userNames.length === 0) {
      say(`It seems nobody chatted? :(`)
      return
    }

    say(`Thank you for chatting!`)
    fn.joinIntoChunks(userNames, ', ', 500).forEach(msg => {
      say(msg)
    })
  }

export default chatters
