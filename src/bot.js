const { Telegraf } = require("telegraf");
require("./helpers/search")(process.env.T_LOGIN, process.env.T_PASS);
const categories = (() => process.env.CATEGORIES.split(","))();
const TorrentsFilesystem = require("./helpers/fs");
const torrentFs = new TorrentsFilesystem(process.env.STORAGE, categories);


const TelegramUsersStorage = require("./helpers/usersStorage");
const usersStorage = new TelegramUsersStorage("./users.json");
const authMiddleware = require("./middleware/auth")(usersStorage);
const torrentMenu = require("./middleware/menu")(torrentFs, categories);
const { document, start: startHandler, help, text } = require("./handlers");
//todo: проверку на корректность заполнения/существования файла конфигурации и users.json
//todo: отдельный метод для удаления сообщений через некоторое время
//todo: проверку на сущестование файла в fs. сравнивать по имени или MD5 хэшу

const bot = new Telegraf(process.env.TOKEN);
bot.use(authMiddleware);
bot.use(torrentMenu.middleware());
bot.on("text", text);
bot.on("document", document);
bot.help(help);
bot.start(startHandler);

const start = async() => {
    await torrentFs.initFs();
    bot.context.menu = { 
        torrentMenu: torrentMenu
     };
     bot.context.torrent = {
         messageId: null,
         link: null,
         filename: null,
         torrents: [],
         torrentsIndex: 1,
     }
    bot.catch((err, ctx) =>{
        console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
    });
    bot.launch();
}
const stop = () => {
    usersStorage.save();
    bot.stop();
}

const report = async (body) => {
    const date = new Date().toISOString()
        .split(".")[0]
        .replace("T", " ");
    const message = `${body.filename} скачан. ${date}`;
    const chatIds = usersStorage.chats;
    for(const chatId of chatIds){
        await bot.telegram.sendMessage(chatId, message)
    }
}

module.exports = {
    start,
    stop,
    report
};