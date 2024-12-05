const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); // Serve static files from the 'public' directory

// Email sending route
app.post("/send-email", (req, res) => {
  const { name, email, subject, message, to } = req.body;

  // Create a transporter object using SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Use your email service provider
    port: 587,
    secure: false, // upgrade later with STARTTLS
    auth: {
      user: process.env.USER, // Your email address
      pass: process.env.PASSWORD, // Your email password or app password
    },
  });

  // Set up email data
  const mailOptions = {
    from: email, // Sender address
    to: to, // List of recipients
    subject: subject, // Subject line
    text: `${message}`, // Plain text body
  };

  // Send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send("Error sending email: " + error.message);
    }
    res
      .status(200)
      .send({
        message: "Email sent successfully",
        status: "success",
        info: info.response,
      });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
