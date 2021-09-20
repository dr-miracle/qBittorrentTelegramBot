const { MenuTemplate, deleteMenuFromContext} = require("telegraf-inline-menu");
const { replyAndDelayedDelete } = require('../helpers/replyAndDelayedDelete');

module.exports = (torrentFs, categories) => {
    const categoriesMenu = new MenuTemplate("Категория торрента?");
    categoriesMenu.choose("category", categories, {
        do: async(ctx, categoryKey) => {
            try {
                const query = ctx.update.callback_query.message;
                const startDownloadMessage = await ctx.reply("Начинаю скачивание торрента...");
                const data = await torrentFs.download(ctx.torrent.link);
                await torrentFs.save(data, ctx.torrent.filename, categoryKey);
                await ctx.telegram.deleteMessage(startDownloadMessage.chat.id, startDownloadMessage.message_id);
                await ctx.telegram.deleteMessage(query.chat.id, ctx.torrent.messageId);
                await deleteMenuFromContext(ctx);
                await replyAndDelayedDelete(ctx, "Торрент-файл скачан!", 1000);
            }catch (error) {
                console.error("Something going wrong when choose menu: ", error);
            }finally{
                return false;
            }
            // return fsPromise
            //     .then(_ => {
            //         return ctx.telegram.deleteMessage(query.chat.id, ctx.torrent.messageId)
            //     })
            //     .then(_ => {
            //         return deleteMenuFromContext(ctx);
            //     })
            //     .then(_ => {
            //         return false;
            //     })
            //     .catch(err => {
            //         console.log("Something going wrong when choose menu: ", err);
            //         return false;
            //     });
        }
    });
    return categoriesMenu;
}