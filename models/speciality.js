// speciality.js

const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const speciality = sequelize.define('speciality', {
    // Define the attributes of the speciality model
    specialityName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // You can define more attributes here if needed
  });

  // Define associations within the associate method
  speciality.associate = (models) => {

    models.user.hasMany(speciality);
    speciality.belongsTo(models.user);
  };

  return speciality;
};
