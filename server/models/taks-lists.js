module.exports = function(sequelize, DataTypes) {
    var taskList = sequelize.define("task_list", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        author: DataTypes.STRING,
        description: DataTypes.STRING,
        links: DataTypes.STRING,
        filename: DataTypes.STRING,
        type: DataTypes.STRING,
        dateOfUpload : DataTypes.DATE,
        for_template: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'task_lists',
        classMethods: {
            associate: function(models) {
                taskList.belongsTo(models.user_accounts);
                taskList.belongsTo(models.department);
                taskList.belongsTo(models.all_category,{foreignKey: 'categoryId'});
                taskList.hasMany(models.activity);
                taskList.hasMany(models.incident_agenda_activity, {foreignKey: 'taskListId'});
                taskList.hasMany(models.incident_activity, {foreignKey: 'taskListId'});
                taskList.belongsToMany(models.tag, {through: 'task_tags', foreignKey: 'taskId'});
                taskList.belongsTo(models.library_reference, {foreignKey: 'libId'});
                taskList.belongsToMany(models.checkList, {as: 'checklists', through: 'check_list_tasks', foreignKey: 'taskId'});


            }
        }
    });

    return taskList;
};
