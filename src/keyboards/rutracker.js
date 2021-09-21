const { MenuTemplate } = require("telegraf-inline-menu");
const pageProvider = require("../helpers/search")().rutracker.pageProvider;

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
        const torr = torrents[index];
        const text = markdownFormatter(torr);
	    return { text, parse_mode: 'Markdown' }
    });
    menu.url('Ссылка', ((ctx) => {
        const id = ctx.torrent.torrents[ctx.torrent.torrentsIndex].id;
        const url = `${pageProvider.threadUrl}?t=${encodeURIComponent(id)}`;
        return url
    }));
    menu.interact('Скачать', 'download', {
        do: async ctx => {
            const id = ctx.torrent.torrents[ctx.torrent.torrentsIndex].id;
            const url = `${pageProvider.downloadUrl}?t=${encodeURIComponent(id)}`.replace("http", "https");
            ctx.torrent.link = url;
            ctx.torrent.filename = `${id}.torrent`;
            return '/category/';
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