const {createTransport} = require("nodemailer");
require('dotenv').config();
const email_config = require('../config/emailConfig');

const transporter = createTransport(email_config);

async function sendMail(user_email, subject, emailBody){
    const message_options = {
        from: process.env.EMAIL_USER,
        to: user_email,
        subject: subject,
        html: emailBody,
        // attachments: [
        //     {
        //         filename: 'bot1.png',
        //         path: './images/bot1.png'
        //     }
        // ]
        
    }
    try {
        let results =  await transporter.sendMail(message_options)
        console.log(results);
    } catch (error) {
        console.log(error);
    }
}

module.exports = sendMail;