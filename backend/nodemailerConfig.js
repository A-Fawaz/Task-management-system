const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail', // e.g., 'gmail' for Gmail
  auth: {
    user: 'taskifyhi@gmail.com',
    pass: 'smphtowkykikeovi',
  },
});

module.exports = transporter;