module.exports = function(sequelize, DataTypes) {
    var game_plan_template_rounds = sequelize.define("game_plan_template_round", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        timeSpan: DataTypes.INTEGER,
        messageIndex: DataTypes.INTEGER,
        resume_date: DataTypes.DATE,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        timeleft: {type: DataTypes.INTEGER}

    },{
        tableName: 'game_plan_template_rounds',
        classMethods: {
            associate: function(models) {
                // game_plan_template_rounds.belongsTo(models.template_plan_message);
                game_plan_template_rounds.belongsTo(models.game_plan_template);

            }
        }
    });

    return game_plan_template_rounds;
};
