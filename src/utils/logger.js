import config from '../config/environment/index.js'
import log4js from 'log4js'
const logger = log4js.getLogger()
logger.level = config.LOG_LEVEL
export default logger
