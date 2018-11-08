module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        number: DataTypes.INTEGER,
        type: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'questions',
        classMethods: {
            associate: function(models) {
                question.belongsTo(models.message);
            }
        }
    });
    return question;
}
