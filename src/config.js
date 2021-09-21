const path = require('path');

const userStoragePath = './users.json';
const config = { path: path.join(__dirname, '/../config.env') };
require('dotenv').config(config);
require('./helpers/config')(config.path, userStoragePath);

module.exports = {
  telegramApiKey: process.env.TOKEN,
  storagePath: process.env.STORAGE,
  usersStoragePath: userStoragePath,
  categories: (() => process.env.CATEGORIES.split(','))(),
  port: process.env.PORT,
  rutracker: {
    login: process.env.T_LOGIN,
    password: process.env.T_PASS,
  },
};
