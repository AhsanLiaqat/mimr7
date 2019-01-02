
var nodemailer = require('nodemailer');
var Q = require('q');

// var transporter = nodemailer.createTransport(process.env.SMTP);

var transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
        user: process.env.username,
        pass: process.env.password
    }
});


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
