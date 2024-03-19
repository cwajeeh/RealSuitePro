module.exports = (sequelize, DataTypes) => {
    const office = sequelize.define('office',    {
        franchiseName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        officeName: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        officeRosterLink: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        employeeCapacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        complianceWithFranchiseStandards: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        franchiseNetwork: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        dateEstablished: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        officeHistory: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
      });

    office.associate = (models) => {
        office.hasMany(models.user);
        models.user.belongsTo(office);

        models.user.hasOne(office, { as: 'franchiseOwner', foreignKey: 'franchiseOwnerId' });
        office.belongsTo(models.user, { as: 'franchiseOwner', foreignKey: 'franchiseOwnerId' });


        office.hasMany(models.addressDBS);
        models.addressDBS.belongsTo(office);
        // Add additional associations as needed
    };

    return office;
};

