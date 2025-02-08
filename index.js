const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require('dotenv').config();

// import dotenv from 'dotenv';
// dotenv.config();

const app = express();
const port = 5000;

app.use(cors()); // Allow cross-origin requests
app.use(bodyParser.json()); // Parse incoming request bodies

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other email services like SendGrid or Mailgun
  auth: {
    user: process.env.USER, // Your email
    pass: process.env.PASS, // Your email password (use environment variables for security)
  },
});

// Define the POST route for sending email
app.post("/send-email", (req, res) => {
  const { name, email, message } = req.body;

  // Define the email options
  const mailOptions = {
    from: email, // Sender's email
    to: process.env.USER, // Recipient email
    subject: `Contact Message from ${name}`,
    text: `You have a new message from ${name} (${email}):\n\n${message}`,
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res
        .status(500)
        .json({ success: false, message: "Error sending email." });
    }
    console.log("Message sent: " + info.response);
    return res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
