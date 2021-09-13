module.exports = (userAuth) => {
        return async(ctx, next) => {
            if (ctx.from.is_bot){
                ctx.reply("You came to wrong door buddy, bot camp two block's down");
                return ctx.leaveChat();
            }
            let hasUser = userAuth.hasUser(ctx.from.id);
            if (hasUser){
                return next();
            }
            const text = ctx.message.text;
            const isAdded = userAuth.addUser(ctx.from.id, ctx.chat.id, text);
            if (isAdded){
                await ctx.reply('Welcome to the club, buddy');
                return next();
            }else{
                return ctx.reply("Parole?");
            }
        }
};