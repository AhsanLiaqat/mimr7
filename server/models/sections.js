module.exports = function(sequelize, DataTypes) {
    var sections = sequelize.define("section", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        name: DataTypes.STRING,
        index: DataTypes.INTEGER,
        default: DataTypes.BOOLEAN,
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        tableName: 'sections',
        classMethods: {
            associate: function(models) {

                sections.belongsTo(models.action_plan);

                sections.hasMany(models.plan_activities);
                sections.belongsToMany(models.activity, {through: 'plan_activities'});
                sections.hasMany(models.incident_activity, {foreignKey: 'sectionId'});
            }
        }
    });
    return sections;
};
