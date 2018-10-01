module.exports = function(sequelize, DataTypes) {
    var article = sequelize.define("article", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
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
                article.belongsTo(models.user);
                article.hasMany(models.article_library);
            }
        }
    });
    return article;
};
