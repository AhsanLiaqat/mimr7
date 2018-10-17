module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define("external_user", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        email: DataTypes.STRING,
        avatar: DataTypes.STRING,
        firstName: DataTypes.STRING,
        middleName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        password: DataTypes.STRING,
        role: DataTypes.STRING,
        lastLogin: DataTypes.DATE,
        title: DataTypes.STRING,
        officePhone: DataTypes.STRING,
        mobilePhone: DataTypes.STRING,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    },{
        tableName: 'external_users',
        classMethods: {
            associate: function(models) {
            }

        }
    });
    return users;
}
