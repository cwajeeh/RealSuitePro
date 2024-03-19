const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const team = sequelize.define('team', {
    teamName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formationDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    specialization: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    targetMarket: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  });

  team.associate = (models) => {
    team.hasMany(models.user,{ foreignKey: 'teamId', as: 'Agents' });
    models.user.belongsTo(models.user,{ foreignKey: 'teamId', as: 'Agents' });

    models.user.hasOne(team,{ as: 'TeamLeader', foreignKey: 'teamLeaderId' });
    team.belongsTo(models.user, { as: 'TeamLeader', foreignKey: 'teamLeaderId' });
};

  return team;
};
