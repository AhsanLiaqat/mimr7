
var nodemailer = require('nodemailer');
var Q = require('q');

var transporter = nodemailer.createTransport(process.env.SMTP);

function sendMail(msgOptions) {
    // Send email using node-mailer
    // https://github.com/nodemailer/nodemailer#sending-mail
    // example:
    //   {to: 'email@email.com',
    //    html: '<html></html>,
    //    text: 'message'}

    var deferred = Q.defer();
    transporter.sendMail( msgOptions, function(error, info){
        if (error){
            deferred.reject(error);
        }else{
            deferred.resolve(info);
        }
    });
    return deferred.promise;
}

module.exports.sendMail = sendMail;
