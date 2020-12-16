require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu')
const { documentHandler, startHandler } = require("./handlers");
const { initFs } = require("./fs")
const users = (() => process.env.USERS.split(","))();


const torrentCategoriesMenuTemplate = new MenuTemplate("Категория торрента?");
torrentCategoriesMenuTemplate.choose('torrentSelectButtons', ["TV", 'Film', "Book", "Anime"], {
    do: async(ctx, key) => {
        const result = ctx.update.callback_query.message;
        const file = await ctx.telegram.getFile(ctx.torrent.torrentId);
        const filelink = await ctx.telegram.getFileLink(file.file_id);

        // await ctx.telegram.deleteMessage(result.chat.id, result.message_id);
        // await ctx.telegram.deleteMessage(result.chat.id, ctx.torrent.messageId);
        //fs logic
        // console.log(key);
        return false;
    }
})
const torrentMenuMiddleware = new MenuMiddleware("/", torrentCategoriesMenuTemplate);

const bot = new Telegraf(process.env.TOKEN);
bot.use(async (ctx, next) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    let user = users.includes(ctx.chat.id.toString());
    if (!user){
        return ctx.reply("Move along, stranger");
    }
    next();
  })
bot.use(torrentMenuMiddleware.middleware());
bot.on("document", documentHandler);
bot.start(startHandler);

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
