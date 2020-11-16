require('dotenv').config({path: __dirname + '/../config.env'});
const { Telegraf } = require('telegraf');
const bot = new Telegraf(process.env.TOKEN);
bot.launch()
bot.telegram.sendMessage(process.env.CHATID, "Test message")
    .then(() => {
        process.exit(0);
    })
    .catch((e) => console.log(e));
// bot.stop();
// process.exit(0);
// bot.use(session());
// bot.reply("Fast reply!");
// bot.start((ctx) => ctx.reply('Welcome'))
// bot.context.reply("Fast reply!");
// bot.command('oldschool', (ctx) => ctx.reply('Hello'))
// bot.command('modern', ({ reply }) => reply('Yo'))
// bot.command('hipster', Telegraf.reply('λ'))
// bot.on('text', (ctx) => {
//     ctx.session.counter = ctx.session.counter || 0
//     ctx.session.counter++
//     return ctx.reply(`Message counter:${ctx.session.counter}`)
//   })

// bot.stop();
