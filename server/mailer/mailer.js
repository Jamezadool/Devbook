const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: `"No Reply" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log('Email sent:', info.messageId);
  } catch (err) {
    console.error('Failed to send email:', err);
    throw err;
  }
}

module.exports = { sendMail };
