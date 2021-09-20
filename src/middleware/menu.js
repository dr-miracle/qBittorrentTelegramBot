const { MenuTemplate, MenuMiddleware } = require("telegraf-inline-menu");

module.exports = (torrentFs, categories) => {
    const categoriesMenu = require('../keyboards/categories')(torrentFs, categories);
    const rutrackerMenu = require('../keyboards/rutracker')();
    const menu = new MenuTemplate("");
    menu.submenu("Категория торрента", "category", categoriesMenu);
    menu.submenu("Rutracker", "rutracker", rutrackerMenu);
    const menuMiddleware = new MenuMiddleware("/", menu);
    return menuMiddleware;
}