const RutrackerApi = require('rutracker-api');
const { rutracker } = require('../config');

class TorrentsSearch {
  constructor(username, password) {
    this.rutracker = new RutrackerApi();
    this.username = username;
    this.password = password;
  }

  async find(keyword) {
    const { username, password } = this;
    return this.rutracker.login({ username, password })
      .then(() => this.rutracker.search({ query: keyword, sort: 'size' }))
      .catch((err) => {
        console.error(err);
        return [];
      });
  }
}
const search = new TorrentsSearch(rutracker.login, rutracker.password);
module.exports = search;
