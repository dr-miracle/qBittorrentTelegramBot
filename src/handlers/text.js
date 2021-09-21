const torrentSearch = require('../helpers/search')();

module.exports = async (ctx) => {
  const { text } = ctx.message;
  // может быть найти другой путь, без этого глупого экспорта сверху
  const rutrackerMessage = await ctx.reply('Начинаю поиск по Rutracker...');
  const torrents = await torrentSearch.find(text);
  if (torrents.length <= 0) {
    const message = `Ничего не найдено при запросе _${text}_!`;
    await ctx.telegram.deleteMessage(rutrackerMessage.chat.id, rutrackerMessage.message_id);
    return ctx.reply(message, { parse_mode: 'Markdown' });
  }
  ctx.torrent.torrents = torrents;
  ctx.torrent.messageId = ctx.message.message_id;
  await ctx.telegram.deleteMessage(rutrackerMessage.chat.id, rutrackerMessage.message_id);
  return ctx.menu.torrentMenu.replyToContext(ctx, '/rutracker/');
};
