const { MenuTemplate, MenuMiddleware, deleteMenuFromContext} = require("telegraf-inline-menu");

module.exports = (torrentFs, categories) => {
    // const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");

    // torrentCategoriesMenuTemplate.choose("torrentSelectButtons", categories, {
    //     do: async(ctx, categoryKey) => {
    //         const result = ctx.update.callback_query.message;
    //         const fsPromise = torrentFs.save(ctx.torrent.link, ctx.torrent.filename, categoryKey);
    //         return fsPromise
    //             .then(_ => {
    //                 return ctx.telegram.deleteMessage(result.chat.id, ctx.torrent.messageId)
    //             })
    //             .then(_ => {
    //                 return deleteMenuFromContext(ctx);
    //             })
    //             .then(_ => {
    //                 return false;
    //             })
    //             .catch(err => {
    //                 console.log("Something going wrong when choose menu: ", err);
    //                 return false;
    //             });
    //     }
    // });
    // const rutrackerSubmenu = new MenuTemplate('RutrackerPagination');
    // rutrackerSubmenu.pagination("rutracker", {
    //     getTotalPages: () => 42,
    //     getCurrentPage: (context) => {
    //         const text = `_Hey_ *there*!`;
	//         return {text, parse_mode: 'Markdown'}
    //     },
    //     setPage: (context, page) => {
    //         return page;
    //     }
    // });
    // torrentCategoriesMenuTemplate.submenu('RutrackerPagination', 'rutracker', rutrackerSubmenu);
    const categoriesMenu = require('../keyboards/categories')(torrentFs, categories);
    const rutrackerMenu = require('../keyboards/rutracker')();
    const menu = new MenuTemplate("");
    menu.submenu("Категория торрента", "category", categoriesMenu);
    menu.submenu("Rutracker", "rutracker", rutrackerMenu);
    const menuMiddleware = new MenuMiddleware("/", menu);
    console.log(menuMiddleware.tree());
    return menuMiddleware;
}