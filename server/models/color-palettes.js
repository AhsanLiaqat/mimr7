module.exports = function(sequelize, DataTypes) {
    var colorPaletts = sequelize.define("color_palette", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        color: DataTypes.STRING,
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'color_palettes',
        classMethods: {
            associate: function(models) {
                colorPaletts.belongsTo(models.user_accounts);
                colorPaletts.belongsToMany(models.user, {through: 'user_colors'});
            }
        }
    });
    return colorPaletts;
};
