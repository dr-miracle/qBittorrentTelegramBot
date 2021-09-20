const { MenuTemplate, deleteMenuFromContext} = require("telegraf-inline-menu");

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const markdownFormatter = (torrent) => {
    const res = `${torrent.title}
    Seeds: ${torrent.seeds} | Leeches: ${torrent.leeches}
    ${formatBytes(torrent.size)}`;
    return res; 
}

module.exports = () => {
    const menu = new MenuTemplate((ctx) => {
        const torrents = ctx.torrent.torrents;
        const index = ctx.torrent.torrentsIndex - 1;
        console.log('rutracker: ', torrents, index);
        const torr = torrents[index];
        const text = markdownFormatter(torr);
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