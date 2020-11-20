const { Model } = require('sequelize');

module.exports = class User extends Model{
    static init(sequelize, DataTypes){
        return super.init({
            userId: {
                type: DataTypes.TEXT,
                primaryKey: true
            },
            chatId: DataTypes.TEXT,
            nickname: DataTypes.TEXT,
            hasAuth: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
            }, { sequelize });
    }
}

// exports.createModel = (sequelize) => {
//     User.init({
//         userId: {
//             type: DataTypes.TEXT,
//             primaryKey: true
//         },
//         chatId: DataTypes.TEXT,
//         nickname: DataTypes.TEXT,
//         hasAuth: {
//             type: DataTypes.BOOLEAN,
//             defaultValue: false
//         }
//       }, { sequelize });
//     return User;
// }

// exports.createModel = (sequelize, DataTypes) => {
//     class User extends Model {
//         getFullname() {
//             return [this.firstname, this.lastname].join(' ');
//           }
//     }
//     User.init({
//         firstname: DataTypes.TEXT,
//         lastname: DataTypes.TEXT
//       }, { sequelize });
//     return User;
// }