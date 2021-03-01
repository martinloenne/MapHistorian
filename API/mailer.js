const config = require("./config");
const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport(config.EMAIL);

const sendEmail = (content) => {
    transport.sendMail(content, function(error, info){
        if(error) {
          return false;
        } 
        else {
          console.log('Email sent.. ' + info.response);
          return true;
        };
      });
};

module.exports = sendEmail;