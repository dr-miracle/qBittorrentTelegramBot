const { MenuTemplate, MenuMiddleware, deleteMenuFromContext} = require("telegraf-inline-menu")
const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");

module.exports = (torrentFs) => {
    torrentCategoriesMenuTemplate.choose("torrentSelectButtons", ["TV", "Films", "Book", "Anime"], {
        do: async(ctx, key) => {
            const result = ctx.update.callback_query.message;
            const file = await ctx.telegram.getFile(ctx.torrent.torrentId);
            const filelink = await ctx.telegram.getFileLink(file.file_id);
            const fsPromise = torrentFs.save(filelink, ctx.torrent.filename, key);
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