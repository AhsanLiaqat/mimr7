module.exports = function(sequelize, DataTypes) {
    var student_message = sequelize.define("student_message", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        content: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
        setOffTime: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'student_messages',
        classMethods: {
            associate: function(models) {
                student_message.belongsTo(models.user);
            }
        }
    });
    return student_message;
}
