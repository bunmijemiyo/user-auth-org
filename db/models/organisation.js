'use strict';
// const {
//   Model
// } = require('sequelize');
// module.exports = (sequelize, DataTypes) => {
//   class organisation extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   }
//   organisation.init({
//     orgId: DataTypes.STRING,
//     name: DataTypes.STRING,
//     description: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'organisation',
//   });
//   return organisation;
// };



// The working one

// const { Model, Sequelize, DataTypes } = require('sequelize');
// const bcrypt = require('bcrypt');

// const sequelize = require('../../config/database');
// const AppError = require('../../utils/appError');


// const Organisation = sequelize.define('Organisation', {
//   orgId: {
//     type: DataTypes.STRING,
//     primaryKey: true,
//     allowNull: false,
//     unique: true,
//   },
//     name: {
//         type: DataTypes.STRING,
//         allowNull: false,
//     },
//     description: {
//         type: DataTypes.STRING,
//     },
// });

// module.exports = Organisation;





const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user'); // Import User model

class Organisation extends Model {
  static associate(models) {
    // Define associations
    Organisation.belongsToMany(models.User, { through: 'UserOrganisation', foreignKey: 'orgId', });
    
  }
}

Organisation.init(
  {
    orgId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: 'Organisation',
    tableName: 'organisation',
    freezeTableName: true,
  }
);

module.exports = Organisation;

