require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const { Database } = require("./db.js");
const bot = new Telegraf(process.env.TOKEN);
const db = new Database();
db.init();
// bot.launch()
// bot.telegram.sendMessage(process.env.CHATID, "Test message")
//     .then(() => {
//         process.exit(0);
//     })
//     .catch((e) => console.log(e));
