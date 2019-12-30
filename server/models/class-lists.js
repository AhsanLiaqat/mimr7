module.exports = function(sequelize, DataTypes) {
    var class_list = sequelize.define("class_list", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'class_lists',
        classMethods: {
            associate: function(models) {
                class_list.belongsTo(models.user_accounts);
                class_list.belongsTo(models.organization);
                class_list.hasMany(models.content_plan_template);
                class_list.belongsToMany(models.user, {through: 'class_lists_users'});
            }
        }
    });
    return class_list;
}
