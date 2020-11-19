const { Model } = require('sequelize');

exports.createModel = (sequelize, DataTypes) => {
    class User extends Model {}
    User.init({
        firstName: {
          type: DataTypes.STRING,
          allowNull: false
        },
        lastName: {
          type: DataTypes.STRING
          // allowNull defaults to true
        }
      }, {
        // Other model options go here
        sequelize, // We need to pass the connection instance
        modelName: 'User' // We need to choose the model name
      });
    return User;
}