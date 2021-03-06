module.exports = function(sequelize, DataTypes) {
    var user_accounts = sequelize.define("user_accounts", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        organizationName: DataTypes.STRING,
        avatar: DataTypes.STRING,
        type: DataTypes.STRING,
        category_header: DataTypes.STRING,
        messages_font_size: DataTypes.STRING,
        messages_font_family: DataTypes.STRING,
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }

    },{
        tableName: 'user_accounts',
        classMethods: {
            associate: function(models) {
                user_accounts.hasMany(models.article);
                user_accounts.hasMany(models.article_library);
                user_accounts.hasMany(models.message_library);
            }
        }
    });
    return user_accounts;
}
