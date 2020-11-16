require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);
bot.start((ctx) => ctx.reply('Welcome'))
bot.command('oldschool', (ctx) => ctx.reply('Hello'))
bot.command('modern', ({ reply }) => reply('Yo'))
bot.command('hipster', Telegraf.reply('λ'))
bot.launch()
