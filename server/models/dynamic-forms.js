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
                
            }
        }
    });
    return dynamic_forms;
};
