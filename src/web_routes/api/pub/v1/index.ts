'use strict'

import express, { Response, Router } from 'express'
import cors from 'cors'
import Tokens, { TokenType } from '../../../../services/Tokens'
import Users from '../../../../services/Users'
import Cache from '../../../../services/Cache'
import { TwitchConfig } from '../../../../types'
import TwitchHelixClient from '../../../../services/TwitchHelixClient'
import { getChatters } from '../../../../services/Chatters'
import Db from '../../../../DbPostgres'

export const createRouter = (
  db: Db,
  tokenRepo: Tokens,
  userRepo: Users,
  cache: Cache,
  configTwitch: TwitchConfig
): Router => {
  const router = express.Router()
  router.use(cors())
  router.get('/chatters', async (req, res: Response) => {
    if (!req.query.apiKey) {
      res.status(403).send({ ok: false, error: 'api key missing' })
      return
    }
    const apiKey = String(req.query.apiKey)
    const t = await tokenRepo.getByTokenAndType(apiKey, TokenType.API_KEY)
    if (!t) {
      res.status(403).send({ ok: false, error: 'invalid api key' })
      return
    }
    const user = await userRepo.getById(t.user_id)
    if (!user) {
      res.status(400).send({ ok: false, error: 'user_not_found' })
      return
    }
    if (!req.query.channel) {
      res.status(400).send({ ok: false, error: 'channel missing' })
      return
    }

    const channelName = String(req.query.channel)
    const helixClient = new TwitchHelixClient(
      configTwitch.tmi.identity.client_id,
      configTwitch.tmi.identity.client_secret,
      []
    )
    const channelId = await helixClient.getUserIdByName(channelName, cache)
    if (!channelId) {
      res.status(400).send({ ok: false, error: 'unable to determine channel id' })
      return
    }

    let dateSince: Date
    if (req.query.since) {
      try {
        dateSince = new Date(String(req.query.since))
      } catch (e) {
        res.status(400).send({ ok: false, error: 'unable to parse since' })
        return
      }
    } else {
      const stream = await helixClient.getStreamByUserId(channelId)
      if (!stream) {
        res.status(400).send({ ok: false, error: 'stream not online at the moment' })
        return
      }
      dateSince = new Date(stream.started_at)
    }
    const userNames = getChatters(db, channelId, dateSince)
    res.status(200).send({ ok: true, data: { chatters: userNames, since: dateSince } })
  })
  return router
}
