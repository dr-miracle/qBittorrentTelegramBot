const { Sequelize, DataTypes } = require('sequelize');
const userModel = require("./entity/user.js");

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite'
});
const User = userModel.init(sequelize, DataTypes);

class Database{
    async init(){
        try{
            await sequelize.authenticate();
            console.log('Connection has been established successfully.');
        }catch(e){
            console.error(e);
        }
        await sequelize.sync();
        await this.populateDb();
    }
    async populateDb(){
        const userData = { 
            userId: process.env.ADMINID,
            hasAuth: true
        };
        let users = await this.getUser(userData.userId);
        if (users.length > 0){
            return;
        }
        await this.addUser(userData);
    }
    async addUser(data){
        const user = User.build(data);
        await user.save();
    }
    async getUser(id){
        const user = await User.findAll({
            where: {
                userId: id
            }
        });
        return user;
    }
}


exports.Database = Database;