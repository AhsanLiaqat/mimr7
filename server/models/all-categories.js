module.exports = function(sequelize, DataTypes) {
    var all_category = sequelize.define("all_category", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.STRING,
        type: DataTypes.STRING,
        position: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'all_categories',
        classMethods: {
            associate: function(models) {
                all_category.belongsTo(models.user_accounts);
                all_category.hasMany(models.checkList);
                all_category.hasMany(models.task_list,{foreignKey: 'categoryId'});
                all_category.hasMany(models.agendaPoint);
            }
        }
    });

    return all_category;
};
