"use strict";
var Q = require('q');

module.exports = function(sequelize, DataTypes) {
    var incident = sequelize.define("incident", {
        id: {
            primaryKey: true,
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4
        },
        name: DataTypes.STRING,
        closed_time: DataTypes.STRING,
        active: {
            type: DataTypes.STRING,
            defaultValue: 'Active'
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        instanceMethods: {
            setIndex: function(){
                this.getClasses({order: [['createdAt', 'ASC']]}).then(function(classes){
                    classes.forEach(function(cls, idx){
                        cls.index = idx;
                        cls.save();
                    });
                });
            }
        },
        tableName: 'incidents',
        classMethods: {
            associate: function(models) {
                incident.belongsToMany(models.place, {as: 'locations', through: 'incident_locations' })
                incident.belongsTo(models.category);

                incident.belongsTo(models.incidents_team);
                incident.belongsTo(models.user, {as: 'reporter'});
                incident.hasMany(models.class, {as: 'classes'});
                incident.hasMany(models.status_report, {foreignKey: 'incidentId'});
                incident.belongsTo(models.user_accounts);
                incident.hasMany(models.incident_plan, {foreignKey: 'incidentId'});
                incident.hasMany(models.incident_activity, {foreignKey: 'incident_id'});
                incident.belongsToMany(models.checkList, {as: 'checkLists', through: 'incident_checkLists', foreignKey: 'incidentId' });

                incident.hasMany(models.id_schedule_game);
                incident.hasMany(models.game_plan_template);
            }

        }
    });

    return incident;
}
