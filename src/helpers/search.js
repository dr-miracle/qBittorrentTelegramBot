const RutrackerApi = require('rutracker-api');

class TorrentsSearch{
    constructor(username, password){
        this.rutracker = new RutrackerApi();
        this.username = username;
        this.password = password;
    }

    async find(keyword){
        const { username, password } = this;
        return await this.rutracker.login({ username, password })
            .then(()=> this.rutracker.search( { query: keyword, sort: "size" }))
            // .then(torr => console.log(torr))
            .catch(err => console.error(err));
        // const _ = new Promise((res, rej) => {
        //     setTimeout(() => {
        //         // res([]);
        //         res(["Biba", "Boba", "Soba", "Yaji", "Lola"]);
        //     }, 500);
        // })

        // return _;
    }
}
let search = null;
module.exports = (login, password) => {
    if (!search){
        search = new TorrentsSearch(login, password);
    }
    return search;
}