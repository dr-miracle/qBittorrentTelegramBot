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
            await sequelize.sync();
            await this.populateDb();
        }catch(e){
            console.error(e);
        }
    }
    async populateDb(){
        const adminData = { 
            userId: process.env.ADMINID,
            hasAuth: true
        };
        let admin = await this.getUserBy(adminData.userId);
        if (admin){
            return;
        }
        await this.addUser(userData);
    }
    async addUser(data){
        const user = User.build(data);
        await user.save();
        return user;
    }
    async getUserBy(id){
        const user = await User.findByPk(id);
        return user;
    }
}


exports.Database = Database;