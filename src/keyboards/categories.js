const { MenuTemplate, deleteMenuFromContext } = require('telegraf-inline-menu');
const { replyAndDelayedDelete } = require('../helpers/replyAndDelayedDelete');
const { categories } = require('../config');
const torrentFs = require('../helpers/fs');

const categoriesMenu = new MenuTemplate('Категория торрента?');
categoriesMenu.choose('category', categories, {
  do: async (ctx, categoryKey) => {
    try {
      const userMessage = ctx.update.callback_query.message;
      const chatId = userMessage.chat.id;
      await deleteMenuFromContext(ctx);
      if (!ctx.torrent.messageId || !ctx.torrent.link) {
        return await replyAndDelayedDelete(ctx, 'Скинь еще раз торрент файл, бот бы перезапущен');
      }
      const downloadStartedNotification = await ctx.reply('Начинаю скачивание торрента...');
      const data = await torrentFs.download(ctx.torrent.link);
      await torrentFs.save(data, ctx.torrent.filename, categoryKey);
      await ctx.telegram.deleteMessage(chatId, downloadStartedNotification.message_id);
      await ctx.telegram.deleteMessage(chatId, ctx.torrent.messageId);
      await replyAndDelayedDelete(ctx, 'Торрент-файл скачан!');
    } catch (error) {
      console.error('Something going wrong when choose menu: ', error);
    } finally {
      // eslint-disable-next-line no-unsafe-finally
      return false;
    }
  },
});

module.exports = categoriesMenu;
