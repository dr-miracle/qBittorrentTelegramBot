const fs = require('fs');
const https = require('https');

module.exports = class TorrentsFilesystem{
    constructor(pathTo, categories){
        this.pathTo = pathTo;
        this.categories = categories;
    }

    async initFs(){
        let dirs = [];
        this.categories.forEach(category => {
            const path = this.getFullPath(category);
            if (!fs.existsSync(path)){
                const dir = fs.mkdir(path, {recursive: true}, () => {});
                dirs.push(dir);
            }
        });
        return await Promise.all(dirs);
    }

    save(filelink, filename, category){
        const filepath = this.getFullPath(category);
        let stream = fs.createWriteStream(`${filepath}\/${filename}`);
        const fsPromise = new Promise( (resolve, reject) => {
            const request = https.get(filelink, resp => {
                if (resp.statusCode !== 200){
                    reject(new Error(`Failed to get '${filelink}' (${response.statusCode})`));
                }
                return resp.pipe(stream);
            })
            stream.on("finish", () => resolve(filename));
            stream.on('error', err => {
                fs.unlink(filepath, () => reject(err));
              });
            request.on('error', err => {
                fs.unlink(filepath, () => reject(err));
              });
        })
        return fsPromise;
    }

    getFullPath(category){
        return`${this.pathTo}\/${category}`;
    }
}