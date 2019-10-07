var Q = require('q');
var sms = require('../lib/sms');
// var socket = require('../lib/socket');
var bcrypt = require('bcryptjs');
var saltRounds = 16;

module.exports = function(sequelize, DataTypes) {
    var users = sequelize.define("user", {
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
        password:DataTypes.STRING,
        active: DataTypes.STRING,
        role: DataTypes.STRING,
        lastLogin: DataTypes.DATE,
        title: DataTypes.STRING,
        officePhone: DataTypes.STRING,
        mobilePhone: DataTypes.STRING,
        countryCode: DataTypes.STRING,
        locationsId: DataTypes.INTEGER,
        userType: DataTypes.STRING,
        userCountry: DataTypes.STRING,
        latestAlert : DataTypes.DATE,
        LastEmailActivation : DataTypes.DATE,
        LastUpdatePassword : DataTypes.DATE,
        type : DataTypes.STRING,
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        },
        available: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        isDeleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },{
        tableName: 'users',
        classMethods: {
            associate: function(models) {
                users.belongsTo(models.user_accounts);
                users.belongsTo(models.organization);
                users.hasMany(models.auth_token);
                users.hasMany(models.student_message);
                users.hasMany(models.question_scheduling);
                users.hasMany(models.scheduled_survey);
                users.hasOne(models.player);
                users.hasMany(models.answer);
                users.hasMany(models.submission);
                users.belongsToMany(models.player_list, {through: 'player_lists_users'});
                users.hasMany(models.device, {foreignKey: 'userId'});
            }, byId: function(id){
                var deferred = Q.defer();
                users.findOne({where: {id: id}}).then(function(user){
                    deferred.resolve(user);
                })
                return deferred.promise;
            }
        },
        instanceMethods: {
            notifyChange: function(){
                var self = this;
                var flds = ['id', 'firstName', 'lastName', 'title', 'officePhone', 'mobilePhone', 'email', 'available'];
                var data = {};
                flds.every(function(fld){
                    data[fld] = self[fld];
                    return true;
                });
                var data = { type: "user_update", user: data};
                // socket.broadcast(self.userAccountId, data);
            }, notifySockets: function(data){
                // socket.sendTo(this, data);
            }, sendSMS: function(message){
                if ( this.mobilePhone ){
                    sms.send(this.mobilePhone, message)
                }
            }, authenticate: function(password){
                return bcrypt.compare(password, this.password)
            }
        },
        hooks: {
            beforeCreate: function(user, options) {
                return bcrypt.hash(user.password, saltRounds).then(function(hash) {
                    user.password = hash;
                });
            }
        }

    });
    return users;
}
