const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

const token = require('./token');
const server = require('./config/express');
const logger = require('./utils/logger');
const getEvent = require('./events');

const safeJsonParse = (values) => {
  try {
    return JSON.parse(values);
  } catch (error) {
    return undefined;
  }
};

const groups = safeJsonParse(fs.readFileSync(path.resolve(__dirname, './groups.json'), (err) => {
  if (err) logger.error(err);
})) || [];

const bot = new TelegramBot(token, {
  polling: {
    params: {
      timeout: 1,
    },
  },
});

bot.on('message', (message) => {
  if (message.text === '/start' && ['group', 'supergroup'].includes(message.chat.type) && !groups.includes(message.chat.id)) {
    groups.push(message.chat.id);
    fs.writeFileSync(path.resolve(__dirname, './groups.json'), JSON.stringify(groups, null, 4), (err) => {
      if (err) logger.error(err);
    });
    bot.sendMessage(message.chat.id, 'Кожаные мешки, вы успешно активировали бота');
    logger.info(`Added to group ${message.chat.title} (id = ${message.chat.id})`);
  } else if (message.text === '/stop' && groups.includes(message.chat.id)) {
    const index = groups.indexOf(message.chat.id);
    if (index !== -1) groups.splice(index, 1);
    fs.writeFileSync(path.resolve(__dirname, './groups.json'), JSON.stringify(groups, null, 4), (err) => {
      if (err) logger.error(err);
    });
    bot.sendMessage(message.chat.id, 'Бот отключен');
  } else if (message.text === 'нет') {
    bot.sendMessage(message.chat.id, 'Ковидора ответ');
  }
});

process.on('unhandledRejection', () => {
  logger.error('unhandeled rejection');
});

server.post('/api', async (req, res) => {
  res.sendStatus(200);
  try {
    const message = getEvent(req.body);
    await Promise.all(groups.map((group) => bot.sendMessage(group, message, { parse_mode: 'Markdown' })));
  } catch (error) {
    logger.error(error);
  }
});

server.listen(3000, () => {
  logger.info('Bot server started on port 3000...');
});
