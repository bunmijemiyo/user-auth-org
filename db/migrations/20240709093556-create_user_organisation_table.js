

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_organisation', {
      userId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'user',
          key: 'userId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      orgId: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'organisation',
          key: 'orgId',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    // Add unique constraint for userId and orgId
    await queryInterface.addConstraint('user_organisation', {
      type: 'unique',
      fields: ['userId', 'orgId'],
      name: 'user_organisation_unique_constraint'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_organisation');
  }
};

