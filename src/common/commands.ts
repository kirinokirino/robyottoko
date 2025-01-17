import { getProp, mustParseHumanDuration, nonce } from "../common/fn"
import {
  Command, CommandAction, CommandTrigger, CommandTriggerType,
  CountdownAction, CountdownActionType, FunctionCommand,
  MediaCommandData, MediaFile, MediaTwitchClip, SoundMediaFile,
} from "../types"
import { MOD_OR_ABOVE } from './permissions'

export const newText = () => ''

const newSoundMediaFile = (obj: any = null): SoundMediaFile => ({
  filename: getProp(obj, ['filename'], ''),
  file: getProp(obj, ['file'], ''),
  urlpath: getProp(obj, ['urlpath'], ''),
  volume: getProp(obj, ['volume'], 100),
})

const newMediaFile = (obj: any = null): MediaFile => ({
  filename: getProp(obj, ['filename'], ''),
  file: getProp(obj, ['file'], ''),
  urlpath: getProp(obj, ['urlpath'], ''),
})

const newTwitchClip = (obj: any = null): MediaTwitchClip => ({
  // twitch clip identified by url
  url: getProp(obj, ['url'], ''),
  volume: getProp(obj, ['volume'], 100),
})

export const newMedia = (obj: any = null): MediaCommandData => ({
  widgetIds: getProp(obj, ['widgetIds'], []),
  sound: newSoundMediaFile(obj?.sound),
  image: newMediaFile(obj?.image),
  image_url: getProp(obj, ['image_url'], ''), // image identified by url only
  twitch_clip: newTwitchClip(obj?.twitch_clip),
  minDurationMs: getProp(obj, ['minDurationMs'], '1s'),
})

export const newCountdownDelay = (): CountdownAction => ({ type: CountdownActionType.DELAY, value: "1s" })
export const newCountdownText = (): CountdownAction => ({ type: CountdownActionType.TEXT, value: newText() })
export const newCountdownMedia = (): CountdownAction => ({ type: CountdownActionType.MEDIA, value: newMedia() })

export const newTrigger = (type: CommandTriggerType): CommandTrigger => ({
  type,
  data: {
    // for trigger type "command" (todo: should only exist if type is command, not always)
    command: '',
    commandExact: false, // true if the command must match exactly with the input

    // for trigger type "timer" (todo: should only exist if type is timer, not always)
    minInterval: 0, // duration in ms or something parsable (eg 1s, 10m, ....)
    minLines: 0,

    // for trigger type "first_chat"
    since: 'stream',
  },
})

export const newRewardRedemptionTrigger = (command: string = ''): CommandTrigger => {
  const trigger = newTrigger(CommandTriggerType.REWARD_REDEMPTION)
  trigger.data.command = command
  return trigger
}

export const newCommandTrigger = (command: string = '', commandExact: boolean = false): CommandTrigger => {
  const trigger = newTrigger(CommandTriggerType.COMMAND)
  trigger.data.command = command
  trigger.data.commandExact = commandExact
  return trigger
}

export const newFirstChatTrigger = (since: 'alltime' | 'stream'): CommandTrigger => {
  const trigger = newTrigger(CommandTriggerType.FIRST_CHAT)
  trigger.data.since = since
  return trigger
}

const triggersEqual = (a: CommandTrigger, b: CommandTrigger): boolean => {
  if (a.type !== b.type) {
    return false
  }
  if (a.type === CommandTriggerType.COMMAND) {
    if (a.data.command === b.data.command) {
      // no need to check for commandExact here (i think^^)
      return true
    }
  } else if (a.type === CommandTriggerType.REWARD_REDEMPTION) {
    if (a.data.command === b.data.command) {
      return true
    }
  } else if (a.type === CommandTriggerType.TIMER) {
    if (
      a.data.minInterval === b.data.minInterval
      && a.data.minLines === b.data.minLines
    ) {
      return true
    }
  } else if (a.type === CommandTriggerType.FIRST_CHAT) {
    return true
  }
  return false
}

export const commandHasAnyTrigger = (
  command: FunctionCommand,
  triggers: CommandTrigger[],
): boolean => {
  for (const cmdTrigger of command.triggers) {
    for (const trigger of triggers) {
      if (triggersEqual(cmdTrigger, trigger)) {
        return true
      }
    }
  }
  return false
}

export const getUniqueCommandsByTriggers = (
  commands: FunctionCommand[],
  triggers: CommandTrigger[],
): FunctionCommand[] => {
  const tmp = commands.filter((command) => commandHasAnyTrigger(command, triggers))
  return tmp.filter((item, i, ar) => ar.indexOf(item) === i)
}

export const isValidTrigger = (trigger: CommandTrigger): boolean => {
  if (trigger.type === CommandTriggerType.COMMAND) {
    if (!trigger.data.command) {
      return false;
    }
    return true;
  }

  if (trigger.type === CommandTriggerType.TIMER) {
    try {
      mustParseHumanDuration(trigger.data.minInterval);
    } catch (e) {
      return false;
    }
    const l = parseInt(`${trigger.data.minLines}`, 10);
    if (isNaN(l)) {
      return false;
    }
    return true;
  }

  return true;
}

interface CommandDef {
  Name: () => string
  Description: () => string
  NewCommand: () => Command
  RequiresAccessToken: () => boolean
}

export const commands: Record<CommandAction, CommandDef> = {
  add_stream_tags: {
    Name: () => "add_stream_tags command",
    Description: () => "Add streamtag",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.ADD_STREAM_TAGS,
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {
        tag: ''
      },
    }),
    RequiresAccessToken: () => true,
  },
  chatters: {
    Name: () => "chatters command",
    Description: () => "Outputs the people who chatted during the stream.",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.CHATTERS,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  countdown: {
    Name: () => "countdown",
    Description: () => "Add a countdown or messages spaced by time intervals.",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.COUNTDOWN,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {
        steps: 3,
        interval: '1s',
        intro: 'Starting countdown...',
        outro: 'Done!'
      },
    }),
    RequiresAccessToken: () => false,
  },
  dict_lookup: {
    Name: () => "dictionary lookup",
    Description: () => "Outputs the translation for the searched word.",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.DICT_LOOKUP,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {
        lang: 'ja',
        phrase: '',
      },
    }),
    RequiresAccessToken: () => false,
  },
  madochan_createword: {
    Name: () => "madochan",
    Description: () => "Creates a word for a definition.",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.MADOCHAN_CREATEWORD,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {
        // TODO: use from same resource as server
        model: '100epochs800lenhashingbidirectional.h5',
        weirdness: 1,
      },
    }),
    RequiresAccessToken: () => false,
  },
  media: {
    Name: () => "media command",
    Description: () => "Display an image and/or play a sound.",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.MEDIA,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: newMedia(),
    }),
    RequiresAccessToken: () => false,
  },
  media_volume: {
    Name: () => "media volume command",
    Description: () => `Sets the media volume to <code>&lt;VOLUME&gt;</code> (argument to this command, min 0, max 100).
    <br />
    If no argument is given, just outputs the current volume`,
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.MEDIA_VOLUME,
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  text: {
    Name: () => "command",
    Description: () => "Send a message to chat",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.TEXT,
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {
        text: [newText()],
      },
    }),
    RequiresAccessToken: () => false,
  },
  remove_stream_tags: {
    Name: () => "remove_stream_tags command",
    Description: () => "Remove streamtag",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.REMOVE_STREAM_TAGS,
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {
        tag: ''
      },
    }),
    RequiresAccessToken: () => true,
  },
  set_channel_game_id: {
    Name: () => "change stream category command",
    Description: () => "Change the stream category",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.SET_CHANNEL_GAME_ID,
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {
        game_id: ''
      },
    }),
    RequiresAccessToken: () => true,
  },
  set_channel_title: {
    Name: () => "change stream title command",
    Description: () => "Change the stream title",
    NewCommand: (): Command => ({
      id: nonce(10),
      triggers: [newCommandTrigger()],
      action: CommandAction.SET_CHANNEL_TITLE,
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {
        title: ''
      },
    }),
    RequiresAccessToken: () => true,
  },
  sr_current: {
    Name: () => "sr_current",
    Description: () => "Show what song is currently playing",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_CURRENT,
      triggers: [newCommandTrigger('!sr current', true)],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_undo: {
    Name: () => "sr_undo",
    Description: () => "Remove the song that was last added by oneself.",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_UNDO,
      triggers: [newCommandTrigger('!sr undo', true)],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_good: {
    Name: () => "sr_good",
    Description: () => "Vote the current song up",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_GOOD,
      triggers: [newCommandTrigger('!sr good', true)],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_bad: {
    Name: () => "sr_bad",
    Description: () => "Vote the current song down",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_BAD,
      triggers: [newCommandTrigger('!sr bad', true)],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_stats: {
    Name: () => "sr_stats",
    Description: () => "Show stats about the playlist",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_STATS,
      triggers: [newCommandTrigger('!sr stats', true), newCommandTrigger('!sr stat', true)],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_prev: {
    Name: () => "sr_prev",
    Description: () => "Skip to the previous song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_PREV,
      triggers: [newCommandTrigger('!sr prev', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_next: {
    Name: () => "sr_next",
    Description: () => "Skip to the next song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_NEXT,
      triggers: [newCommandTrigger('!sr next', true), newCommandTrigger('!sr skip', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_jumptonew: {
    Name: () => "sr_jumptonew",
    Description: () => "Jump to the next unplayed song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_JUMPTONEW,
      triggers: [newCommandTrigger('!sr jumptonew', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_clear: {
    Name: () => "sr_clear",
    Description: () => "Clear the playlist",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_CLEAR,
      triggers: [newCommandTrigger('!sr clear', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_rm: {
    Name: () => "sr_rm",
    Description: () => "Remove the current song from the playlist",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_RM,
      triggers: [newCommandTrigger('!sr rm', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_shuffle: {
    Name: () => "sr_shuffle",
    Description: () => `Shuffle the playlist (current song unaffected).
    <br />
    Non-played and played songs will be shuffled separately and non-played
    songs will be put after currently playing song.`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_SHUFFLE,
      triggers: [newCommandTrigger('!sr shuffle', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_reset_stats: {
    Name: () => "sr_reset_stats",
    Description: () => "Reset all statistics of all songs",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_RESET_STATS,
      triggers: [newCommandTrigger('!sr resetStats', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_loop: {
    Name: () => "sr_loop",
    Description: () => "Loop the current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_LOOP,
      triggers: [newCommandTrigger('!sr loop', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_noloop: {
    Name: () => "sr_noloop",
    Description: () => "Stop looping the current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_NOLOOP,
      triggers: [newCommandTrigger('!sr noloop', true), newCommandTrigger('!sr unloop', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_pause: {
    Name: () => "sr_pause",
    Description: () => "Pause currently playing song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_PAUSE,
      triggers: [newCommandTrigger('!sr pause', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_unpause: {
    Name: () => "sr_unpause",
    Description: () => "Unpause currently paused song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_UNPAUSE,
      triggers: [newCommandTrigger('!sr nopause', true), newCommandTrigger('!sr unpause', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_hidevideo: {
    Name: () => "sr_hidevideo",
    Description: () => "Hide video for current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_HIDEVIDEO,
      triggers: [newCommandTrigger('!sr hidevideo', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_showvideo: {
    Name: () => "sr_showvideo",
    Description: () => "Show video for current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_SHOWVIDEO,
      triggers: [newCommandTrigger('!sr showvideo', true)],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_request: {
    Name: () => "sr_request",
    Description: () => `
    Search for <code>&lt;SEARCH&gt;</code> (argument to this command)
    at youtube (by id or by title)
    and queue the first result in the playlist (after the first found
    batch of unplayed songs).`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_REQUEST,
      triggers: [newCommandTrigger('!sr')],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_re_request: {
    Name: () => "sr_re_request",
    Description: () => `
    Search for <code>&lt;SEARCH&gt;</code> (argument to this command)
    in the current playlist and queue the first result in the playlist
    (after the first found batch of unplayed songs).`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_RE_REQUEST,
      triggers: [newCommandTrigger('!resr')],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_addtag: {
    Name: () => "sr_addtag",
    Description: () => "Add tag <code>&lt;TAG&gt;</code> (argument to this command) to the current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_ADDTAG,
      triggers: [newCommandTrigger('!sr tag'), newCommandTrigger('!sr addtag')],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {
        tag: "",
      },
    }),
    RequiresAccessToken: () => false,
  },
  sr_rmtag: {
    Name: () => "sr_rmtag",
    Description: () => "Remove tag <code>&lt;TAG&gt;</code> (argument to this command) from the current song",
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_RMTAG,
      triggers: [newCommandTrigger('!sr rmtag')],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_volume: {
    Name: () => "sr_volume",
    Description: () => `Sets the song request volume to <code>&lt;VOLUME&gt;</code> (argument to this command, min 0, max 100).
    <br />
    If no argument is given, just outputs the current volume`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_VOLUME,
      triggers: [newCommandTrigger('!sr volume')],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_filter: {
    Name: () => "sr_filter",
    Description: () => `Play only songs with the given tag <code>&lt;TAG&gt;</code> (argument to this command). If no tag
  is given, play all songs.`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_FILTER,
      triggers: [newCommandTrigger('!sr filter')],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_preset: {
    Name: () => "sr_preset",
    Description: () => `Switches to the preset <code>&lt;PRESET&gt;</code> (argument to this command) if it exists.
  If no arguments are given, outputs all available presets.`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_PRESET,
      triggers: [newCommandTrigger('!sr preset')],
      restrict_to: MOD_OR_ABOVE,
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
  sr_queue: {
    Name: () => "sr_queue",
    Description: () => `Shows the next 3 songs that will play.`,
    NewCommand: (): Command => ({
      id: nonce(10),
      action: CommandAction.SR_QUEUE,
      triggers: [newCommandTrigger('!sr queue')],
      restrict_to: [],
      variables: [],
      variableChanges: [],
      data: {},
    }),
    RequiresAccessToken: () => false,
  },
}

export default {
  commands,
}
