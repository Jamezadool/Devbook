const { sendMail } = require('./mail');
require('dotenv').config();

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function main() {
  const email = 'recipient@example.com';
  const code = generateVerificationCode();
  const subject = 'Your Verification Code';
  const message = `Your verification code is: ${code}\nThis code will expire in 10 minutes.`;

  await sendMail(email, subject, message);
}

main().catch(console.error);
