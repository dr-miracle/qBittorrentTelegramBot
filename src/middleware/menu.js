const { MenuTemplate, MenuMiddleware } = require('telegraf-inline-menu');
const rutrackerMenu = require('../keyboards/rutracker')();

module.exports = (torrentFs, categories) => {
  // eslint-disable-next-line global-require
  const categoriesMenu = require('../keyboards/categories')(torrentFs, categories);
  const menu = new MenuTemplate('');
  menu.submenu('Категория торрента', 'category', categoriesMenu);
  menu.submenu('Rutracker', 'rutracker', rutrackerMenu);
  const menuMiddleware = new MenuMiddleware('/', menu);
  return menuMiddleware;
}