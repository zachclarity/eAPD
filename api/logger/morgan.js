const morgan = require('morgan')
const { logger } = require('./winston')

// https://www.npmjs.com/package/morgan#tokens
morgan.token('id', req => req.id)
morgan.token('ip', req => req.ip)
morgan.token('uid', req => req.user && req.user.id)

// output morgan http request data as json
// https://www.loggly.com/ultimate-guide/node-logging-basics/#:~:text=Logging%20in%20JSON%20Format
const tokenString = [
  'id',
  'ip',
  'method',
  'status',
  'total-time',
  'uid',
  'url',
  // 'http-version',
  // 'user-agent',
].map(token => `"${token}": ":${token}"`)
.join(', ');

const format = `{${tokenString}, "content-length": ":res[content-length]"}`

const requestLoggerMiddleware = morgan(format, { stream: logger.stream });

module.exports = { requestLoggerMiddleware }
