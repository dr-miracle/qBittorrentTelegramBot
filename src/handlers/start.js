// TODO: возможно, перенести потом в отдельный модуль helper.js
const getUserData = (ctx) => {
  const userData = {
    userId: ctx.from.id,
    chatId: ctx.chat.id,
    nickname: ctx.from.username,
  };
  return userData;
};

module.exports = async (ctx) => {
  const userData = getUserData(ctx);
  await ctx.reply(`С возвращением, ${userData.nickname}`);
};
