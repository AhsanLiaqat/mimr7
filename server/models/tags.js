module.exports = function(sequelize, DataTypes) {
    var tags = sequelize.define("tag", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        text: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'tags',
        classMethods: {
            associate: function(models) {
                tags.belongsTo(models.user_accounts);
                tags.belongsToMany(models.task_list, {as: 'tasks', through: 'task_tags', foreignKey: 'tagId'});
            }
        }
    });

    return tags;
};
