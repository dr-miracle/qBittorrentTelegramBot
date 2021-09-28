// todo: проверку доступности рутрекера
// todo: при запуске stop если бот не запущен, кидается исключение. нужно пофиксить это
const { Telegraf } = require('telegraf');
const config = require('./config');

const torrentFs = require('./helpers/fs');
const usersStorage = require('./helpers/usersStorage');

const authMiddleware = require('./middleware/auth');
const torrentMenu = require('./middleware/menu');
const {
  document, start, help, text,
} = require('./handlers');

const bot = new Telegraf(config.telegramApiKey);
bot.use(authMiddleware);
bot.use(torrentMenu.middleware());
bot.on('text', text);
bot.on('document', document);
bot.help(help);
bot.start(start);

const startup = async () => {
  await torrentFs.init();
  bot.context.menu = {
    torrentMenu,
  };
  bot.context.torrent = {
    messageId: null,
    link: null,
    filename: null,
    torrents: [],
    torrentsIndex: 1,
  };
  bot.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
  });
  bot.launch();
};
const stop = () => {
  usersStorage.save();
  bot.stop();
};

const report = async (body) => {
  const date = new Date().toISOString()
    .split('.')[0]
    .replace('T', ' ');
  const message = `${body.filename} скачан. ${date}`;
  const p = usersStorage.chats.map((chatId) => bot.telegram.sendMessage(chatId, message));
  return Promise.all(p);
};

module.exports = {
  startup,
  stop,
  report,
};
