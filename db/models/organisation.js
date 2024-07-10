
'use strict';

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');
const User = require('./user'); // Import User model

class Organisation extends Model {
  static associate(models) {
    // Define associations
    Organisation.belongsToMany(models.User, {
      through: 'UserOrganisation', 
      foreignKey: 'orgId',
    });
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
    timestamps: true, // Add timestamps if needed
    paranoid: true, // Enable soft deletes if needed
  }
);

module.exports = Organisation;


/*


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
*/
