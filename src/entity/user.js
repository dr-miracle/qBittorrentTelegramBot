const { Model, DataTypes } = require('sequelize');
class User extends Model{
    getFullname() {
        return [this.firstname, this.lastname].join(' ');
    }
}

exports.createModel = (sequelize) => {
    User.init({
        firstname: DataTypes.TEXT,
        lastname: DataTypes.TEXT
      }, { sequelize });
    return User;
}

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