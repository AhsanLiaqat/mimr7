module.exports = function(sequelize, DataTypes) {
    var student = sequelize.define("student", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        mobilePhone: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'students',
        classMethods: {
            associate: function(models) {
                student.belongsTo(models.organization);
            }
        }
    });
    return student;
};
