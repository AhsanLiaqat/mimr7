module.exports = function(sequelize, DataTypes) {
    var question = sequelize.define("question", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        number: DataTypes.INTEGER,
        offset: DataTypes.INTEGER,
        type: DataTypes.STRING,
        hint: DataTypes.TEXT,
        solution: DataTypes.TEXT,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'questions',
        classMethods: {
            associate: function(models) {
                question.belongsTo(models.user_accounts);
                question.belongsTo(models.message);
                question.belongsTo(models.article);
                question.hasOne(models.answer);
                question.hasMany(models.question_scheduling);
                question.hasOne(models.response);
            }
        }
    });
    return question;
}
