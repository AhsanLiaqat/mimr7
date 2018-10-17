module.exports = function(sequelize, DataTypes) {
    var incident_checkList_copy = sequelize.define("incident_checkList_copy", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        status: {
            type: DataTypes.STRING,
            defaultValue: 'incomplete'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'incident_checkList_copies',
        classMethods: {
            associate: function(models) {
                incident_checkList_copy.belongsTo(models.incident_checkList,{foreignKey: 'incident_checkListId'});
                incident_checkList_copy.belongsTo(models.task_list,{foreignKey: 'taskId'});
            }
        }
    });
    return incident_checkList_copy;
}
