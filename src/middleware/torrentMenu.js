const { MenuTemplate, MenuMiddleware, deleteMenuFromContext} = require("telegraf-inline-menu")
const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");

module.exports = (torrentFs, categories) => {
    torrentCategoriesMenuTemplate.choose("torrentSelectButtons", categories, {
        do: async(ctx, categoryKey) => {
            const result = ctx.update.callback_query.message;
            const file = await ctx.telegram.getFile(ctx.torrent.torrentId);
            const filelink = await ctx.telegram.getFileLink(file.file_id);
            const fsPromise = torrentFs.save(filelink, ctx.torrent.filename, categoryKey);
            return fsPromise
                .then(_ => {
                    return ctx.telegram.deleteMessage(result.chat.id, ctx.torrent.messageId)
                })
                .then(_ => {
                    return deleteMenuFromContext(ctx);
                })
                .then(_ => {
                    return false;
                })
                .catch(err => {
                    console.log("Something going wrong when choose menu: ", err);
                    return false;
                });
        }
    });
    const torrentMenuMiddleware = new MenuMiddleware("/", torrentCategoriesMenuTemplate);
    return torrentMenuMiddleware;
}