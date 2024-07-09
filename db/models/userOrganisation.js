// userOrganisation.js

const { Model, DataTypes } = require('sequelize');
const sequelize = require('../../config/database');

class UserOrganisation extends Model {
  static associate(models) {
    // Define associations
    UserOrganisation.belongsTo(models.User, { foreignKey: 'userId' });
    UserOrganisation.belongsTo(models.Organisation, { foreignKey: 'orgId' });
  }
}

UserOrganisation.init(
  {
    // Define attributes
    userId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'user', // Ensure this matches your User model name
          key: 'userId', // Ensure this matches your User model's primary key
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      orgId: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'organisation', // Ensure this matches your Organisation model name
          key: 'orgId', // Ensure this matches your Organisation model's primary key
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
  
  },
  {
    sequelize,
    modelName: 'UserOrganisation',
    tableName: 'user_organisation', // Define your preferred table name
    freezeTableName: true,
  }
);

module.exports = UserOrganisation;
