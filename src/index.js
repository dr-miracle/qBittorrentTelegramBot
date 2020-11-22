require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const { Database } = require("./db.js");

const getNonAuthUsersList = async (ctx) =>{
    let users = await db.getAllUsers();
    if (users.length === 0){
        return ctx.reply("Список пользователей пуст!");
    }
    let userAuthList = users
        .filter(u => !u.hasAuth)
        .map(u => u.toString())
        .join("\\n");
    await ctx.reply("Список пользователей для одобрения:");
    await ctx.reply(userAuthList);
    return false;
}

const getUserData = (ctx) => {
    const userData = {
        userId: ctx.from.id,
        chatId: ctx.chat.id,
        nickname: ctx.from.username
    }
    return userData;
}
const isAdmin = (userData) => userData.userId === process.env.ADMINID;

const adminMenuTemplate = new MenuTemplate(ctx => `Hey ${ctx.from.first_name}!`);
adminMenuTemplate.interact('NonAuthUsers', 'a', {
    do: getNonAuthUsersList
  });
const menuMiddleware = new MenuMiddleware('/', adminMenuTemplate);

const bot = new Telegraf(process.env.TOKEN);
const db = new Database();
bot.use(menuMiddleware.middleware());
bot.on("document", (ctx) => {
    const isTorrentExtension = (filename) => {
        const fileExtension = filename.split(".").pop();
        return fileExtension === "torrent";
    }
    const filename = ctx.message.document.file_name;
    if(!isTorrentExtension(filename)){
        return;
    }
    //show keyboard categories
    //fs logic

    // if (isTorrentExtension(filename)){
    //     ctx.reply("Add torrent!");
    // }else{
    //     ctx.reply("It's not a torrent!");
    // }
})
bot.start(async (ctx) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    const userData = getUserData(ctx);
    let user = await db.getUserBy(userData.userId);
    if (!user){
        await db.addUser(userData);
        return ctx.reply("Жди ответного гудка");
    }
    if (!user.hasAuth){
        return ctx.reply("Сказано же, жди ответного гудка!");
    }
    await ctx.reply("С возвращением, " + userData.nickname);
    if (!isAdmin){
        return;
    }
    menuMiddleware.replyToContext(ctx);
});

const start = async() => {
    await db.init()
        .then(bot.startPolling())
        .catch((e) => console.error(e));
}

start()
    .then(() => console.log("Bot started"))
    .catch((e) => console.log("Bot starting error: " + e));


// bot.launch()
// bot.telegram.sendMessage(process.env.CHATID, "Test message")
//     .then(() => {
//         process.exit(0);
//     })
//     .catch((e) => console.log(e));
