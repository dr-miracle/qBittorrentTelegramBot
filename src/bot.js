const { Telegraf } = require("telegraf");
const categories = (() => process.env.CATEGORIES.split(","))();
const TorrentsFilesystem = require("./helpers/fs");
const torrentFs = new TorrentsFilesystem(process.env.STORAGE, categories);

const Auth = require("./helpers/auth");
const userAuth = new Auth("./users.json");
const authMiddleware = require("./middleware/auth")(userAuth);
const torrentMenuMiddleware = require("./middleware/torrentMenu")(torrentFs);
const { documentHandler, startHandler } = require("./handlers");

const bot = new Telegraf(process.env.TOKEN);
bot.use(authMiddleware);
bot.use(torrentMenuMiddleware.middleware());
bot.on("document", documentHandler);
bot.start(startHandler);

const start = async() => {
    await torrentFs.initFs();
    bot.context.menu = { 
        torrentMenuMiddleware
     };
     bot.context.torrent = {
         messageId: null,
         torrentId: null,
         filename: null
     }
    bot.catch((err, ctx) =>{
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });
    bot.startPolling();
}
const stop = () => {
    userAuth.save();
    bot.stop();
}

const report = async (body) => {
    const date = new Date().toISOString()
        .split(".")[0]
        .replace("T", " ");
    const message = `${body.filename} скачан. ${date}`;
    const chatIds = userAuth.chats();
    for(const chatId of chatIds){
        await bot.telegram.sendMessage(chatId, message)
    }
}

module.exports = {
    start,
    stop,
    report
};