module.exports = function(sequelize, DataTypes) {
    var survey = sequelize.define("survey", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        offset: {type: DataTypes.INTEGER, defaultValue: 0},
        repeatTime: {type: DataTypes.INTEGER, defaultValue: 0},
        type: {type : DataTypes.BOOLEAN,defaultValue : false},
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'surveys',
        classMethods: {
            associate: function(models) {
                survey.belongsTo(models.user_accounts);
                survey.belongsTo(models.article);
                survey.belongsTo(models.dynamic_form);
            }
        }
    });
    return survey;
}

