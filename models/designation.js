// designation.js

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const designation = sequelize.define("designation", {
    designationName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    orgnization: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  });

  // Define associations within the associate method
  designation.associate = (models) => {
    models.user.hasMany(designation);
    designation.belongsTo(models.user);
  };

  return designation;
};
