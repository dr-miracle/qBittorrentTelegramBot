require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { MenuTemplate, MenuMiddleware, deleteMenuFromContext} = require('telegraf-inline-menu')
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

const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");
torrentCategoriesMenuTemplate.choose('torrentSelectButtons', ["TV", 'Film', "Book", "Anime"], {
    do: async(ctx, key) => {
        const result = ctx.update.callback_query.message;
        console.log(ctx.torrent);
        await ctx.telegram.deleteMessage(result.chat.id, result.message_id);
        await ctx.telegram.deleteMessage(result.chat.id, ctx.torrent.messageId);
        //fs logic
        // deleteMenuFromContext(ctx);
        // console.log(key);
        return false;
    }
})
// const adminMenuMiddleware = new MenuMiddleware('/', adminMenuTemplate);
const torrentMenuMiddleware = new MenuMiddleware("/", torrentCategoriesMenuTemplate);

const bot = new Telegraf(process.env.TOKEN);
const db = new Database();
// bot.use(adminMenuMiddleware.middleware());
// bot.use((ctx, next) => {
//     let documentChoises
//     if (ctx.callbackQuery) {
//         console.log('ctx:', ctx);
//         console.log('callback query:', ctx.callbackQuery);
// 		console.log('callback data just happened', ctx.callbackQuery.data)
// 	}
//     return next();
// });

bot.use(torrentMenuMiddleware.middleware());
bot.on("document", documentHandler);
bot.start(startHandler);

const startBot = async() => {
    await db.init();
    bot.context.db = db;
    bot.context.menu = { 
        // adminMenuMiddleware,
        torrentMenuMiddleware
     };
     bot.context.torrent = {
         messageId: null,
         torrentId: null
     }
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
