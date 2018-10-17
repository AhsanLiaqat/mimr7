module.exports = function(sequelize, DataTypes) {
    var map_images = sequelize.define("map_image", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        path: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'map_images',
        classMethods: {
            associate: function(models) {

                map_images.belongsTo(models.incident);
                map_images.belongsTo(models.user_accounts);
            }

        }
    });
    return map_images;
}
