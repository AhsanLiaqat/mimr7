module.exports = function(sequelize, DataTypes) {
    var highlight = sequelize.define("highlight", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: DataTypes.STRING,
        description: DataTypes.STRING,
        order: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'highlights',
        classMethods: {
            associate: function(models) {
                highlight.belongsTo(models.user_accounts);
                highlight.belongsTo(models.collection);
                highlight.hasMany(models.highlights_library , {foreignKey: 'parentId'});
                highlight.hasMany(models.message);
            }
        }
    });
    return highlight;
}
