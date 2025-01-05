const { sequelize } = require("../config/db");
const { DataTypes } = require("sequelize");

// Import các model ở đây
// Ví dụ:
// const User = require('./user.model');

const models = {
  // Khai báo các model ở đây
  // User,
};

// Thiết lập các relationships giữa các model (nếu có)
Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

module.exports = {
  sequelize,
  ...models,
};
