//TODO: возможно, перенести потом в отдельный модуль helper.js
const getUserData = (ctx) => {
    const userData = {
        userId: ctx.from.id,
        chatId: ctx.chat.id,
        nickname: ctx.from.username
    }
    return userData;
}
const isAdmin = (userData) => userData.userId === process.env.ADMINID;

module.exports = async(ctx) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    const userData = getUserData(ctx);
    let user = await ctx.db.getUserBy(userData.userId);
    if (!user){
        await ctx.db.addUser(userData);
        return ctx.reply("Жди ответного гудка");
    }
    if (!user.hasAuth){
        return ctx.reply("Сказано же, жди ответного гудка!");
    }
    await ctx.reply("С возвращением, " + userData.nickname);
    if (!isAdmin){
        return;
    }
    ctx.menu.replyToContext(ctx);
}