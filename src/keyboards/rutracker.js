const { MenuTemplate, deleteMenuFromContext} = require("telegraf-inline-menu");

module.exports = () => {
    const menu = new MenuTemplate((ctx) => {
        const torrents = ctx.torrent.torrents;
        const index = ctx.torrent.torrentsIndex - 1;
        console.log('rutracker: ', torrents, index);
        const text = `Torrent: ${torrents[index]}`;
	    return { text, parse_mode: 'Markdown' }
    });
    menu.interact('Скачать', 'download', {
        do: async ctx => {
            console.log(ctx.torrent.torrentsIndex);
            return false;
        }
    });
    menu.pagination("rutracker", {
        getTotalPages: (ctx) => ctx.torrent.torrents.length,
        getCurrentPage: (context) => {
            return context.torrent.torrentsIndex;
        },
        setPage: (context, page) => {
            console.log('setPage', page);
            return context.torrent.torrentsIndex = page;
        }
    });
    return menu;
}