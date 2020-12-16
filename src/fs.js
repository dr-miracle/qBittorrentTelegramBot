const fs = require('fs');
const categories = ["TV", "Films", "Anime", "Book", "Other"]
const initFs = async (pathTo) =>{
    let dirs = [];
    
    categories.forEach(category => {
        const path = `${pathTo}\/${category}`;
        const dir = fs.mkdir(path, {recursive: true}, () => {});
        dirs.push(dir);
    });
    return await Promise.all(dirs);
}

exports.initFs = initFs;
//put