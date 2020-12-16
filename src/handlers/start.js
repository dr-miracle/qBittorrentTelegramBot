//TODO: возможно, перенести потом в отдельный модуль helper.js
const getUserData = (ctx) => {
    const userData = {
        userId: ctx.from.id,
        chatId: ctx.chat.id,
        nickname: ctx.from.username
    }
    return userData;
}

const users = (() => process.env.USERS.split(","))();

module.exports = async(ctx) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    const userData = getUserData(ctx);
    let user = users.includes(userData.userId.toString());
    console.log(user);
    console.log(userData.userId);
    if (!user){
        return ctx.reply("Move along, stranger");
    }
    await ctx.reply("С возвращением, " + userData.nickname);
    if (!isAdmin){
        return;
    }
}