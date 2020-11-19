const { Sequelize, DataTypes } = require('sequelize');
const userModel = require("./entity/user.js");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});
const User = userModel.createModel(sequelize, DataTypes);
console.log(User);
class Database{
    async init(){
        try{
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }catch(e){
            console.error(e);
        }
        await sequelize.sync();
    }
}


exports.Database = Database;