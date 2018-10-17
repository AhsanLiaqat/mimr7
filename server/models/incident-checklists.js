module.exports = function(sequelize, DataTypes) {
    var incident_checkList = sequelize.define("incident_checkList", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'incident_checkLists',
        classMethods: {
            associate: function(models) {
                incident_checkList.belongsTo(models.incident,{foreignKey: 'incidentId'});
                incident_checkList.belongsTo(models.checkList,{foreignKey: 'checkListId'});
                incident_checkList.hasMany(models.incident_checkList_copy,{foreignKey: 'incident_checkListId'});
            }
        }
    });
    return incident_checkList;
}
