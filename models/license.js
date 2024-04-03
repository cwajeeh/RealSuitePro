// license.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const license = sequelize.define("license", {
    licenseName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  });

  // Define associations within the associate method
  license.associate = (models) => {
    models.user.hasMany(license);
    license.belongsTo(models.user);
  };

  return license;
};
