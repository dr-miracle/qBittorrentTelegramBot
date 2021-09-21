const path = require('path');

const config = { path: path.join(__dirname, '/../config.env') };
require('./helpers/config')(config.path, './users.json');
require('dotenv').config(config);
const http = require('http');
const express = require('express');
const bot = require('./bot');

const app = express();
app.set('port', process.env.PORT || 3000);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.post('/report', async (req, res) => {
  const data = req.body;
  await bot.report(data);
  return res.status(200).send({});
});
app.use((req, res) => res.status(404).send({}));

process.once('exit', (code) => {
  console.log('Exit code:', code);
  bot.stop();
});
process.once('SIGINT', () => {
  process.exit(1);
});
process.once('SIGTERM', () => {
  process.exit(1);
});

http.createServer(app).listen(process.env.PORT || 3000, () => {
  console.log(`Run server on localhost:${process.env.port || 3000}`);
  bot.startup()
    .then(() => console.log('Bot started'))
    .catch((e) => console.log(`Bot starting error: ${e}`));
});
