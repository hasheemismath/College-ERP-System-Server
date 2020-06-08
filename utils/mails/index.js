const mailer = require('nodemailer');

const sendEmail = (to) => {

    const smtpTransport = mailer.createTransport({
        service:"Gmail",
        auth:{
            user: "hasheemhush@gmail.com",
            pass:  process.env.MailPassowrd
        }
    });

    var mailOptions = {
        from: 'hasheemhush@gmail.com',
        to:to,
        subject: 'Account created Successfully',
        text: 'You have been added to SLIIT as a Instructor'
    };

    smtpTransport.sendMail(mailOptions,function(error,info){
        if(error){
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
        smtpTransport.close();
    })
}

module.exports = { sendEmail }