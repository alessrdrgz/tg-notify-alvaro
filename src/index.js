import config from './config/environment/index.js'
import logger from './utils/logger.js'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import cors from 'cors'
import { TGBot } from './utils/bot.js'
import { prisma } from './utils/db/db.js'
import dedent from 'dedent'
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(
  morgan('dev', {
    stream: {
      write: (s) => logger.info(s)
    }
  })
)

app.get('/', async (req, res) => {
  res.send('Hello world!')
})

app.post('/message', async (req, res) => {
  const { name, phone, date, message } = req.body
  const tgMessage = dedent`Nombre: ${name}
                    Móvil: ${phone}
                    Fecha: ${new Date(date).toLocaleDateString('ES')}

                    ${message}
  `
  const users = await prisma.user.findMany({ where: { subscribed: true } })
  for (const user of users) {
    await TGBot.sendMessage(user.tg_id, tgMessage)
  }
  res.send()
})

app.listen(config.PORT)
logger.info(`APP listening on port: ${config.PORT}`)
