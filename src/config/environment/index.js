import * as dotenv from 'dotenv'
dotenv.config()

export default {
  PORT: process.env.PORT || 3000,
  TG_BOT_TOKEN: process.env.TG_BOT_TOKEN,
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
}
