module.exports = function(sequelize, DataTypes) {
    var outcomes = sequelize.define("outcome", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'outcomes',
        classMethods: {
            associate: function(models) {
                outcomes.belongsTo(models.activity, {as: 'decision_activity', foreignKey: 'decision_activity_id'});
                outcomes.belongsTo(models.activity, {as: 'outcome_activity', foreignKey: 'outcome_activity_id'});
            }
        }
    });
    return outcomes;
}
