module.exports = function(sequelize, DataTypes) {
    var dynamic_forms = sequelize.define("dynamic_form", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        heading: DataTypes.TEXT,
        fields: DataTypes.JSON,
        page_link: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'dynamic_forms',
        classMethods: {
            //any assosiation will be define here
            associate: function (models) {
                dynamic_forms.belongsTo(models.user_accounts);
                dynamic_forms.hasMany(models.survey);
                dynamic_forms.hasMany(models.content_plan_template);
                dynamic_forms.hasOne(models.submission);
            }
        }
    });
    return dynamic_forms;
};
