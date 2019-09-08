const TelegramBot = require('node-telegram-bot-api');

const token = require('./token');
const server = require('./config/express');
const logger = require('./utils/logger');
const getEvent = require('./events');

const groups = [];

const bot = new TelegramBot(token, {
  polling: {
    params: {
      timeout: 1,
    },
  },
});

bot.on('message', (message) => {
  if (message.text === '/start' && message.chat.type === 'group') {
    groups.push(message.chat.id);
    logger.info(`Added to group ${message.chat.title} (id = ${message.chat.id})`);
  }
});

server.post('/api', async (req, res) => {
  res.sendStatus(200);
  console.log(req.body);
  const message = getEvent(req.body);
  await Promise.all(groups.map((group) => bot.sendMessage(group, message, { parse_mode: 'Markdown' })));
});

server.listen(3000, () => {
  logger.info('Bot server started on port 3000...');
});
