const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Route for handling contact form submissions
router.post('/contact', async (req, res) => {
  const { name, email,phone, message } = req.body;

  try {
    // Create a transporter using your email service (e.g., Gmail, SendGrid, Mailgun)
    const transporter = nodemailer.createTransport({
      // Your email service configuration (host, port, secure, auth)
      service: 'Gmail', // Example: using Gmail
      auth: {
        user: process.env.SMTP_USER, // Your email address
        pass: process.env.SMTP_PASS // Your email password (use app password for Gmail)
      }
    });

    // Compose the email
    const mailOptions = {
      from: 'testacsqms@gmail.com', // Your email address
      to: 'testacsqms@gmail.com', // Recipient email address
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Send a response to the client
    const clientResponse = {
      from: 'noreply@acs.tn',
      to: email,
      subject: 'Message sent successfully | ACS',
      text: 'Thank you for contacting us!\n We will get back to you soon.',
    };

    await transporter.sendMail(clientResponse);


    res.status(200).json({ message: 'Message sent successfully' });

  } catch (err) {
    console.error('Error sending email:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
});

module.exports = router;