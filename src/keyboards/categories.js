const { MenuTemplate, deleteMenuFromContext} = require("telegraf-inline-menu");

module.exports = (torrentFs, categories) => {
    const categoriesMenu = new MenuTemplate("Категория торрента?");
    categoriesMenu.choose("category", categories, {
        do: async(ctx, categoryKey) => {
            const result = ctx.update.callback_query.message;
            const fsPromise = torrentFs.save(ctx.torrent.link, ctx.torrent.filename, categoryKey);
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
    return categoriesMenu;
}