require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const { documentHandler, startHandler } = require("./handlers");
const { initFs } = require("./fs")


const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");
torrentCategoriesMenuTemplate.choose('torrentSelectButtons', ["TV", 'Film', "Book", "Anime"], {
    do: async(ctx, key) => {
        const result = ctx.update.callback_query.message;
        console.log(ctx.torrent);
        await ctx.telegram.deleteMessage(result.chat.id, result.message_id);
        await ctx.telegram.deleteMessage(result.chat.id, ctx.torrent.messageId);
        //fs logic
        // console.log(key);
        return false;
    }
})
const torrentMenuMiddleware = new MenuMiddleware("/", torrentCategoriesMenuTemplate);

const bot = new Telegraf(process.env.TOKEN);

bot.use(torrentMenuMiddleware.middleware());
bot.on("document", documentHandler);
bot.start(startHandler);

//todo
//1. удалить бд check
//2. вместо бд сделать json файл со списком доверенных пользователей check
//3. в json файл так же записать настройки - токен, id админа, добавить объект с списком категорий
//и путем к папке с торрентами check
//4. удалить мусор


const startBot = async() => {
    await initFs("../torrents");
    bot.context.menu = { 
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
