const { Sequelize, DataTypes, Model } = require('sequelize');
const userModel = require("./entity/user.js");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});
const User = userModel.createModel(sequelize);

class Database{
    async init(){
        try{
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }catch(e){
            console.error(e);
        }
        await sequelize.sync();
        const user = User.build({ firstname: 'Jane', lastname: 'Doe' });
        console.log(user.getFullname()); // 'Jane Doe'
    }
}


exports.Database = Database;