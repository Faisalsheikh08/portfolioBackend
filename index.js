const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000; // Use dynamic port for deployment

// CORS setup (Allow requests from all origins or restrict as needed)
app.use(cors({ origin: "*" }));

app.use(bodyParser.json()); // Parse JSON bodies

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER, // Email from environment variable
    pass: process.env.PASS, // Password from environment variable
  },
});

// Define the POST route for sending emails
app.post("/send-email", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    // Define the email options
    const mailOptions = {
      from: email,
      to: process.env.USER,
      subject: `Contact Message from ${name}`,
      text: `You have a new message from ${name} (${email}):\n\n${message}`,
    };

    // Send the email asynchronously
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.response);

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ success: false, message: "Error sending email." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
