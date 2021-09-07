const { Telegraf } = require("telegraf");

require("dotenv").config({path: __dirname + "/../config.env"});
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
bot.use(torrentMenuMiddleware);
bot.on("document", documentHandler);
bot.start(startHandler);
const startBot = async() => {
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

startBot()
    .then(() => console.log("Bot started"))
    .catch((e) => console.log("Bot starting error: " + e));

process.on("exit", (code) => {
    userAuth.save();
})
process.on("SIGINT", () => {
    process.exit(1);
})
