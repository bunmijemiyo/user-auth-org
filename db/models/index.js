'use strict';

/*
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};
// const User = require('./user')
// const Organisation = require('./organisation')

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define associations between User and Organisation models
const User = db.user;
const Organisation = db.Organisation;

User.belongsToMany(Organisation, { through: 'UserOrganisation' });
Organisation.belongsToMany(User, { through: 'UserOrganisation' });
//

// Attach sequelize instance and Sequelize to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;
//
// db.User = User;
// db.Organisation = Organisation;




module.exports = db;
*/

'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../config/config.js')[env];
const db = {};

// Initialize Sequelize instance
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read all model files and import them into db object
fs.readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  });

// Import the UserOrganisation model
// const UserOrganisation = require('./userOrganisation');

// Execute associations for each model
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define associations between User and Organisation models
const User = db.User;
const Organisation = db.Organisation;
const UserOrganisation = db.UserOrganisation; // Import UserOrganisation model

User.belongsToMany(Organisation, { through: UserOrganisation, foreignKey: 'userId' });
Organisation.belongsToMany(User, { through: UserOrganisation, foreignKey: 'orgId' });


// Attach sequelize instance and Sequelize to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

