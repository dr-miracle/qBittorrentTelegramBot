const authMiddleware = async (ctx, next) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    let hasUser = userAuth.hasUser(ctx.from.id);
    if (hasUser){
        return next();
    }
    const text = ctx.message.text;
    const isAdded = userAuth.addUser(ctx.from.id, ctx.chat.id, text);
    console.log(text, isAdded);
    if (isAdded){
        return next();
    }else{
        return ctx.reply("Incorrect passphrase");
    }
}

module.exports = (userAuth) => {
        return async(ctx, next) => {
            if (ctx.from.is_bot){
                return ctx.reply("You came to wrong door buddy, bot camp two block down");
            }
            let hasUser = userAuth.hasUser(ctx.from.id);
            if (hasUser){
                return next();
            }
            const text = ctx.message.text;
            const isAdded = userAuth.addUser(ctx.from.id, ctx.chat.id, text);
            console.log(text, isAdded);
            if (isAdded){
                return next();
            }else{
                return ctx.reply("Incorrect passphrase");
            }
        }
};