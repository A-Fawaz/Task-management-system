const nodemailer = require("nodemailer");

// Configure the transporter with your email provider's settings
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "rkaeen54@gmail.com",
    pass: "xgnlzcrvehknzuat",
  },
});

// Function to send the verification email
function sendVerificationEmail(email, verificationToken) {
  // Prepare the email content
  const mailOptions = {
    from: "rkaeen54@gmail.com",
    to: email,
    subject: "Email Verification",
    text: `Please click the following link to verify your email: ${verificationLink}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

module.exports = {
  sendVerificationEmail,
};
