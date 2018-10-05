module.exports = function(sequelize, DataTypes) {
    var article = sequelize.define("article", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        text: DataTypes.TEXT,
        private: DataTypes.BOOLEAN,
        saleable: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
        // gamePlanId: DataTypes.INTEGER,
    }, {
        tableName: 'articles',
        classMethods: {
            associate: function(models) {
                article.belongsTo(models.user_accounts);
                article.hasMany(models.message);
                article.hasMany(models.article_library, {foreignKey: 'parentId'});
            }
        }
    });
    return article;
};
