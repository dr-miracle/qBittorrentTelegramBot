class TorrentsSearch{
    constructor(login, password){
        
    }

    async find(keyword){
        const _ = new Promise((res, rej) => {
            setTimeout(() => {
                // res([]);
                res(["Biba", "Boba", "Soba", "Yaji", "Lola"]);
            }, 500);
        })

        return _;
    }
}
let search = null;
module.exports = (login, password) => {
    if (!search){
        search = new TorrentsSearch(login, password);
    }
    return search;
}