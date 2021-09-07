const fs = require('fs');
///синхронное сохранение из-за использования только в функции exit
module.exports = class AuthTelegramUser{
    constructor(jsonPath){
        this.jsonPath = jsonPath;
        const { phrase, users } = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        this.phrase = phrase;
        this.users = users;
    }
    addUser(userId, userChatId, phrase){
        if (phrase !== this.phrase){
            return false;
        }
        if (isNaN(userId) || isNaN(userChatId)){
            return false;
        }
        this.users[userId] = userChatId;
        return true;
    }
    hasUser(userId){
        return this.users[userId] ? true : false;
    }
    save(){
        const json = JSON.stringify({
            "phrase": this.phrase,
            "users": this.users
        },
        null,
        "\t");
        fs.writeFileSync(this.jsonPath, json);
    }
}