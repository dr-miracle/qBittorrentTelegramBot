require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { Database } = require("./db.js");

const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) => {
    if (ctx.from.is_bot){
        return ctx.reply("You came to wrong door buddy, bot camp two block down");
    }
    let userData = {
        userId: ctx.from.id,
        chatId: ctx.chat.id,
        nickname: ctx.from.username
    }
    db.addUser(userData);
    ctx.reply("User added");
});
const db = new Database();

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
