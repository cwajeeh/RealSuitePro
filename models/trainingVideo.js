module.exports = (sequelize, DataTypes) => {
    const trainingVideo = sequelize.define('trainingVideo', {
        title: {
          type: DataTypes.STRING,
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        category: {
          type: DataTypes.STRING,
          allowNull: false
        },
        thumbnailUrl: {
          type: DataTypes.STRING,
          allowNull: false
        },
        videoUrl: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        pinned: {
          type: DataTypes.BOOLEAN,
          allowNull: false
        },
        supplementaryMaterials: {
          type: DataTypes.JSON 
        }
      });

      trainingVideo.associate = (models) => {
    };

    return trainingVideo;
};
