module.exports = async (ctx) => {
  const reply = 'Скинь мне файл с расширением .torrent и выбери нужную категорию для начала загрузки.';
  return ctx.reply(reply);
};
