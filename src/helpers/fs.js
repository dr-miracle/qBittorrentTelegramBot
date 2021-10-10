const fs = require('fs');
// const axios = require('axios');
const { pageProvider } = require('../helpers/search').rutracker;
const { storagePath, categories } = require('../config');

class TorrentsFilesystem {
  constructor(pathTo, torrentCategories) {
    this.pathTo = pathTo;
    this.categories = torrentCategories;
    this.request = pageProvider.request;
  }

  async init() {
    const dirs = [];
    this.categories.forEach((category) => {
      const path = this.getFullPath(category);
      if (!fs.existsSync(path)) {
        const dir = fs.mkdir(path, { recursive: true }, () => {});
        dirs.push(dir);
      }
    });
    return Promise.all(dirs);
  }

  async download(url) {
    return this.request({
      url,
      method: 'GET',
      responseType: 'stream',
    }).then((response) => response.data);
  }

  async save(data, filename, category) {
    const filepath = this.getFullPath(category);
    const fsPromise = new Promise((resolve, reject) => {
      const stream = fs.createWriteStream(`${filepath}/${filename}`);
      stream.on('finish', () => resolve(filename));
      stream.on('error', (err) => {
        fs.unlink(filepath, () => reject(err));
      });
      data.pipe(stream);
    });
    return fsPromise;
  }

  getFullPath(category) {
    return `${this.pathTo}/${category}`;
  }
}
const fileSystem = new TorrentsFilesystem(storagePath, categories);

module.exports = fileSystem;
