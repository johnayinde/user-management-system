const path = require("path");

module.exports = {
  development: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../../database.sqlite"),
    migrationStorageTableName: "sequelize_meta",
    seederStorageTableName: "sequelize_data",
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    migrationStorageTableName: "sequelize_meta",
    seederStorageTableName: "sequelize_data",
  },
  production: {
    dialect: "sqlite",
    storage: path.join(__dirname, "../../database.sqlite"),
    migrationStorageTableName: "sequelize_meta",
    seederStorageTableName: "sequelize_data",
  },
};
