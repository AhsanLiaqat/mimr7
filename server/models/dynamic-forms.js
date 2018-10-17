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
		refrenceTable: DataTypes.STRING,
        refrenceId: DataTypes.INTEGER,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'dynamic_forms',
        classMethods: {
            //any assosiation will be define here
            associate: function (models) {
                dynamic_forms.hasMany(models.player_form_detail);
                dynamic_forms.belongsTo(models.user_accounts);
                dynamic_forms.belongsTo(models.formType);
            }
        }
    });
    return dynamic_forms;
};
