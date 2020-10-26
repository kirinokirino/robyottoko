const tmi = require('tmi.js')
const fn = require('../fn.js')

class TwitchClientManager {
  constructor(user, moduleManager) {
    this.logprefix = `${user.name}|`
    this.client = new tmi.client({
      identity: {
        username: user.tmi_identity_username,
        password: user.tmi_identity_password,
        client_id: user.tmi_identity_client_id,
      },
      channels: user.twitch_channels.split(','),
      connection: {
        reconnect: true,
      }
    });

    this.client.on('message', async (target, context, msg, self) => {
      if (self) { return; } // Ignore messages from the bot
      console.log(`${this.logprefix}${context.username}@${target}: ${msg}`)
      const rawCmd = fn.parseCommand(msg)

      for (const m of moduleManager.all(user.id)) {
        const commands = m.getCommands() || {}
        const cmdDef = commands[rawCmd.name] || null
        if (cmdDef && fn.mayExecute(context, cmdDef)) {
          console.log(`${this.logprefix}${target}| * Executing ${rawCmd.name} command`)
          const r = await cmdDef.fn(rawCmd, this.client, target, context, msg)
          if (r) {
            console.log(`${this.logprefix}${target}| * Returned: ${r}`)
          }
          console.log(`${this.logprefix}${target}| * Executed ${rawCmd.name} command`)
        }
        await m.onChatMsg(this.client, target, context, msg);
      }
    })

    // Called every time the bot connects to Twitch chat
    this.client.on('connected', (addr, port) => {
      console.log(`${this.logprefix} * Connected to ${addr}:${port}`)
    })
    this.client.connect();
  }

  getClient() {
    return this.client
  }
}

module.exports = TwitchClientManager