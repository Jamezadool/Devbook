const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // or use 'smtp.mailtrap.io', 'outlook', etc.
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password' // or app password
  }
});

const mailOptions = {
  from: 'your-email@gmail.com',
  to: 'recipient@example.com',
  subject: 'Test Email',
  text: 'Hello from Node.js'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.error(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
