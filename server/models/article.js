module.exports = function(sequelize, DataTypes) {
    var article = sequelize.define("article", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        title: DataTypes.STRING,
        description: DataTypes.STRING,
        type: DataTypes.STRING,
        text: DataTypes.TEXT,
        kind: DataTypes.STRING,
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
                article.hasMany(models.chapter);
                article.hasMany(models.question);
                article.hasMany(models.content_plan_template);
                article.hasMany(models.article_library, {foreignKey: 'parentId'});
                article.hasMany(models.response);
                article.hasMany(models.survey);
            }
        }
    });
    return article;
};
