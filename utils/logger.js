const winston = require('winston');

module.exports = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.colorize(), winston.format.align(), winston.format.simple()),
  transports: [
    new winston.transports.Console(),
  ],
});
