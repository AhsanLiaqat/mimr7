"use strict";

module.exports = function(sequelize, DataTypes) {
    var form_type = sequelize.define("formType", {
        id: {
            type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        multiple : DataTypes.BOOLEAN
    }, {
        tableName: 'form_types',
        classMethods: {
            //any assosiation will be define here
            associate: function (models) {
                form_type.hasMany(models.dynamic_form);
            }
        }
    });
    return form_type;
}
