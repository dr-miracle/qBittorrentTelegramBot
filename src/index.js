require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const { Database } = require("./db.js");
const { documentHandler, startHandler } = require("./handlers");

const getNonAuthUsersList = async (ctx) =>{
    let users = await ctx.db.getAllUsers();
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

const adminMenuTemplate = new MenuTemplate("Доступные действия");
adminMenuTemplate.interact('Пользователи', 'usersButton', {
    do: getNonAuthUsersList
  });
const menuMiddleware = new MenuMiddleware('/', adminMenuTemplate);

const bot = new Telegraf(process.env.TOKEN);
const db = new Database();
bot.use(menuMiddleware.middleware());
bot.on("document", documentHandler);
bot.start(startHandler);

const startBot = async() => {
    await db.init();
    bot.context.db = db;
    bot.context.menu = menuMiddleware;
    bot.catch((err, ctx) =>{
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });
    bot.startPolling();
}

startBot()
    .then(() => console.log("Bot started"))
    .catch((e) => console.log("Bot starting error: " + e));


// bot.launch()
// bot.telegram.sendMessage(process.env.CHATID, "Test message")
//     .then(() => {
//         process.exit(0);
//     })
//     .catch((e) => console.log(e));
