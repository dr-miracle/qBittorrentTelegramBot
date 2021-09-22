const { replyAndDelayedDelete } = require('../helpers/replyAndDelayedDelete');

const isTorrentExtension = (filename) => {
  const fileExtension = filename.split('.').pop();
  return fileExtension === 'torrent';
};

module.exports = async (ctx) => {
  const filename = ctx.message.document.file_name;
  ctx.torrent.messageId = ctx.message.message_id;
  ctx.torrent.filename = ctx.message.document.file_name;
  const filelink = await ctx.telegram.getFileLink(ctx.message.document.file_id);
  ctx.torrent.link = filelink.href;
  if (!isTorrentExtension(filename)) {
    replyAndDelayedDelete(ctx, 'Это не торрент! >.<', 1000);
  }
  await ctx.menu.torrentMenu.replyToContext(ctx, '/category/');
};
