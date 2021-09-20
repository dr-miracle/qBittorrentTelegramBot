module.exports = (userStorage) => {
        return async(ctx, next) => {
            if (ctx.from.is_bot){
                ctx.reply("You came to wrong door buddy, bot camp two block's down");
                return ctx.leaveChat();
            }
            let hasUser = userStorage.hasUser(ctx.from.id);
            if (hasUser){
                return next();
            }
            const text = ctx.message.text;
            const isAdded = userStorage.addUser(ctx.from.id, ctx.chat.id, text);
            if (isAdded){
                userStorage.save();
                await ctx.reply('Welcome to the club, buddy');
                return next();
            }else{
                return ctx.reply("Parole?");
            }
        }
};