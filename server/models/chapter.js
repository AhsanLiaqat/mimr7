module.exports = function(sequelize, DataTypes) {
    var chapter = sequelize.define("chapter",{
        id: {type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true},
        name : DataTypes.STRING,
        text: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'chapters',
        classMethods: {
            associate: function(models) {
                chapter.belongsTo(models.article);
            }
        }
    });
    return chapter;
};
