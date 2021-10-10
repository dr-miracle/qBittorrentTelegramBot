const { MenuTemplate } = require('telegraf-inline-menu');
const { pageProvider } = require('../helpers/search').rutracker;

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  // eslint-disable-next-line no-restricted-properties
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

const markdownFormatter = (torrent) => {
  const res = `${torrent.title}
    Seeds: ${torrent.seeds} | Leeches: ${torrent.leeches}
    ${formatBytes(torrent.size)}`;
  return res;
};

const menu = new MenuTemplate((ctx) => {
  const index = ctx.torrent.torrentsIndex - 1;
  const torrent = ctx.torrent.torrents[index];
  const text = markdownFormatter(torrent);
  return { text, parse_mode: 'Markdown' };
});
menu.url('Ссылка', ((ctx) => {
  const index = ctx.torrent.torrentsIndex - 1;
  const torrent = ctx.torrent.torrents[index];
  const { id } = torrent;
  const url = `${pageProvider.threadUrl}?t=${encodeURIComponent(id)}`;
  return url;
}));
// menu.interact('Скачать', 'download', {
//   do: async (ctx) => {
//     const index = ctx.torrent.torrentsIndex - 1;
//     const torrent = ctx.torrent.torrents[index];
//     const { id } = torrent;
//     const url = `${pageProvider.downloadUrl}?t=${encodeURIComponent(id)}`.replace('http', 'https');
//     console.log(url);
//     ctx.torrent.link = url;
//     ctx.torrent.filename = `${id}.torrent`;
//     return '/category/';
//   },
// });
menu.pagination('rutracker', {
  getTotalPages: (ctx) => ctx.torrent.torrents.length,
  getCurrentPage: (context) => context.torrent.torrentsIndex,
  setPage: (context, page) => {
    context.torrent.torrentsIndex = page;
    return context.torrent.torrentsIndex;
  },
});

module.exports = menu;
