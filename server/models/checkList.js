module.exports = function(sequelize, DataTypes) {
    var checkList = sequelize.define("checkList", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        responsibilityLevel: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'checkLists',
        classMethods: {
            associate: function(models) {
                checkList.belongsTo(models.user_accounts);
                checkList.belongsTo(models.all_category);
                checkList.belongsToMany(models.task_list, {as: 'tasks', through: 'check_list_tasks', foreignKey: 'checkListId'});
                checkList.belongsToMany(models.incident, {as: 'incidents', through: models.incident_checkList, foreignKey: 'checkListId'});
                checkList.belongsToMany(models.category, {through: 'incident_types_checklists'});

            }
        }
    });

    return checkList;
};
