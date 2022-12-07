import TelegramBot from 'node-telegram-bot-api'
import config from '../config/environment/index.js'
import { prisma } from './db/db.js'
import logger from './logger.js'

export const TGBot = new TelegramBot(config.TG_BOT_TOKEN, { polling: true })

TGBot.onText(/\/subscribe/, async (msg) => {
  const { chat } = msg
  const { id: chatId, username, first_name: name } = chat
  const user = await prisma.user.findFirst({
    where: { username }
  })

  if (user === null) {
    await prisma.user.create({
      data: {
        subscribed: true,
        username,
        name,
        tg_id: chatId
      }
    })
  } else
    await prisma.user.update({
      data: { subscribed: true },
      where: { tg_id: chatId }
    })

  TGBot.sendMessage(chatId, 'Succesfully subscribed to notifications ✔')
})

TGBot.onText(/\/unsubscribe/, async (msg) => {
  const { chat } = msg
  const { id: chatId, username } = chat
  const user = await prisma.user.findFirst({
    where: { username }
  })

  if (user !== null && user.subscribed) {
    await prisma.user.update({
      data: { subscribed: false },
      where: { tg_id: chatId }
    })
    TGBot.sendMessage(chatId, 'Succesfully unsubscribed from notifications')
  } else TGBot.sendMessage(chatId, 'You were not subscribed to notifications')
})

logger.info(`TGBot initialised`)
