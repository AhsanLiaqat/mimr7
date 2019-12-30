//change article model to collection
module.exports = function(sequelize, DataTypes) {
    var collection = sequelize.define("collection", {
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
        tableName: 'collections',
        classMethods: {
            associate: function(models) {
                collection.belongsTo(models.user_accounts);
                collection.hasMany(models.highlight);
                collection.hasMany(models.chapter);
                collection.hasMany(models.message);
                collection.hasMany(models.content_plan_template);
                collection.hasMany(models.collection_library, {foreignKey: 'parentId'});
                collection.hasMany(models.response);
                collection.hasMany(models.survey);
            }
        }
    });
    return collection;
};
