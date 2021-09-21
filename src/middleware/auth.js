const usersStorage = require('../helpers/usersStorage');

const authMiddleware = async (ctx, next) => {
  if (ctx.from.is_bot) {
    ctx.reply('You came to wrong door buddy, bot camp two block\'s down');
    return ctx.leaveChat();
  }
  const hasUser = usersStorage.hasUser(ctx.from.id);
  if (hasUser) {
    return next();
  }
  const { text } = ctx.message;
  const isAdded = usersStorage.addUser(ctx.from.id, ctx.chat.id, text);
  if (isAdded) {
    usersStorage.save();
    await ctx.reply('Welcome to the club, buddy');
    return next();
  }
  return ctx.reply('Parole?');
};

module.exports = authMiddleware;
