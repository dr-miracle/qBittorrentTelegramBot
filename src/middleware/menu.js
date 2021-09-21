const { MenuTemplate, MenuMiddleware } = require('telegraf-inline-menu');
const rutrackerMenu = require('../keyboards/rutracker');
const categoriesMenu = require('../keyboards/categories');

const menu = new MenuTemplate('');
menu.submenu('Категория торрента', 'category', categoriesMenu);
menu.submenu('Rutracker', 'rutracker', rutrackerMenu);
const menuMiddleware = new MenuMiddleware('/', menu);

module.exports = menuMiddleware;
