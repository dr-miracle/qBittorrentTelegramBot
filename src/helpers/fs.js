const fs = require('fs');
const axios = require('axios');

module.exports = class TorrentsFilesystem {
  constructor(pathTo, categories) {
    this.pathTo = pathTo;
    this.categories = categories;
    this.request = axios;
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
};
