const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Admin = require('../models/adminModel');
const User = require('../models/userModel'); 
const Form = require('../models/formSubmissionModel');
const FormHistory = require('../models/formHistoryModel');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    // Your email service configuration (host, port, secure, auth)
    service: 'Gmail', // Example: using Gmail
    auth: {
      user: process.env.SMTP_USER, // Your email address
      pass: process.env.SMTP_PASS // Your email password (use app password for Gmail)
    }
  });

// Route pour obtenir tous les forms soumis par les utilisateurs d'un admin
router.post('/forms', async (req, res) => {
    try {
        const adminId = req.body.adminId;

        // Trouver les utilisateurs de l'admin
        const users = await User.find({ adminId: adminId });

        // Extraire les IDs des utilisateurs
        const userIds = users.map(user => user._id);

        // Trouver les forms soumis par les utilisateurs
        const forms = await Form.find({ userId: { $in: userIds } });

        res.status(200).json(forms);
    } catch (err) {
        console.error('Erreur lors de la récupération des forms:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des forms' });
    }
});

// Route pour obtenir l'admin actuel
router.get('/', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token

        // Get adminId from decoded token (depends on your token structure)
        const adminId = decoded.adminId;  // Assuming your token has adminId

        const admin = await Admin.findById(adminId); // Find admin by ID

        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.status(200).json(admin);
    }
    catch (err) {
        console.error('Erreur lors de la récupération de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'admin' });
    }
});




// Route pour l'inscription des admins
router.post('/register', async (req, res) => {
    try {
        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Création du nouvel admin
        const newAdmin = new Admin({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            superAdminId: req.body.superAdminId, 
        });

        // Enregistrement du nouvel admin
        const admin = await newAdmin.save();

        // Générer le token JWT
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);

        res.status(201).json({ token, adminId: admin._id });

    } catch (err) {
        console.error('Erreur lors de l\'inscription de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de l\'inscription de l\'admin' });
    }
});


// Route pour obtenir les utilisateurs d'un admin
router.post('/users/', async (req, res) => {
    try {
        const adminId = req.body.adminId;

        // Verifier si l'admin a cet utilisateur
        const users = await User.find({ adminId: adminId });


        res.status(200).json(users);

    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
    }
});

// Route pour créer un utilisateur
router.post('/users', auth, async (req, res) => {
    try {
        const adminId = req.admin.adminId; 

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Créer le nouvel utilisateur
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
            adminId, // AdminId pour associer à l'admin
        });

        // Enregistrer le nouvel utilisateur
        const user = await newUser.save();

        // Ajouter l'utilisateur à l'admin
        const admin = await Admin.findByIdAndUpdate(adminId, { $push: { users: user._id } }, { new: true });

        res.status(201).json(user);

    } catch (err) {
        console.error('Erreur lors de la création de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
});

// Route pour mettre à jour un utilisateur
router.put('/users/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;
        const updatedUserData = req.body;

        // Trouver et mettre à jour l'utilisateur
        const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);

    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
    }
});

// Route pour supprimer un utilisateur
router.delete('/users/:userId', auth, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Trouver et supprimer l'utilisateur
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Retirer l'utilisateur de l'admin
        const admin = await Admin.findOneAndUpdate(deletedUser.adminId, { $pull: { users: userId } });

        res.status(200).json({ message: 'Utilisateur supprimé' });

    } catch (err) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur' });
    }
});

// Route pour mettre à jour le type de paiement d'un admin
router.put('/update-payment/:adminId', auth, async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const paymentType = req.body.paymentType;

        // Trouver et mettre à jour l'admin
        const admin = await Admin.findByIdAndUpdate(adminId, { paymentType }, { new: true });

        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.status(200).json(admin);

    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'admin' });
    }
});

// Route to simulate card payment processing 
router.post('/process-card-payment', auth, async (req, res) => {
    try {
      const { cardNumber, expiryMonth, expiryYear, cvv } = req.body.cardDetails;
  
      // Simulated processing delay (replace with actual payment gateway logic)
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
  
  
      // Simulate a successful payment (replace with your payment gateway's response)
      const paymentSuccessful = true; 
  
      if (paymentSuccessful) {
        // Update admin's payment status in the database (if payment is successful)
        const adminId = req.admin._id; // Get admin ID from auth middleware
        const admin = await Admin.findByIdAndUpdate(adminId, { isPaid: true, paymentType: 'card' }); 

        
        const mailOptions = {
            from: process.env.SMTP_USER, // Your email address
            to: process.env.SUPER_ADMIN_EMAIL || process.env.SMTP_USER, // Recipient email address
            subject: `New Card Payment from ${admin.firstName} ${admin.lastName} | ACS`,
            text: `Admin ${admin.firstName} has paid with card. \nId: ${admin._id}\nBusiness Name: ${admin.businessName}\n Phone: ${admin.phone} \nEmail: ${admin.email}`,
            };

            // Send the email
            await transporter.sendMail(mailOptions);

            // run node server on ip address
//  
        
        res.status(200).json({ message: 'Payment successful!' });
        

      } else {
        // Handle payment failure (e.g., invalid card details, insufficient funds)
        res.status(400).json({ error: 'Payment failed. Please check your card details.' });
      }
  
    } catch (error) {
      console.error('Error processing card payment:', error);
      res.status(500).json({ error: 'Error processing payment.' });
    }
  });

  // Route for cash payment notification (replace with actual logic)
router.post('/notify-cash-payment', auth, async (req, res) => {
    try {
      const adminId = req.body.adminId;

      const admin = await Admin.findById(adminId);
  

    // Compose the email
    const mailOptions = {
        from: process.env.SMTP_USER, // Your email address
        to: process.env.SUPER_ADMIN_EMAIL || process.env.SMTP_USER, // Recipient email address
        subject: `New Cash Payment from Admin ${admin.firstName} ${admin.lastName} | ACS`,
        text: `Admin ${admin.firstName} has chosen wire transfer. \n Please follow up. \nId: ${admin._id}\nBusiness Name: ${admin.businessName} Phone: ${admin.phone} \nEmail: ${admin.email}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);


      res.status(200).json({ message: 'Superadmin notified.' });
    } catch (error) {
      console.error('Error notifying about cash payment:', error);
      res.status(500).json({ error: 'Error processing request' }); 
    }
  });
  
  // Route for wire transfer notification (replace with actual logic)
  router.post('/notify-wire-transfer', auth, async (req, res) => {
    try {
      const adminId = req.body.adminId;
        const admin = await Admin.findById(adminId);

      // Logic to notify superadmin about wire transfer (e.g., send email, notification)
      console.log(`Admin ${admin.firstName} ${admin.lastName} has chosen wire transfer. Notify superadmin.`);
    // Compose the email
    const mailOptions = {
        from: process.env.SMTP_USER, // Your email address
        to: process.env.SUPER_ADMIN_EMAIL || process.env.SMTP_USER, // Recipient email address
        subject: `Wire Transfer Payment from ${admin.firstName} ${admin.lastName} | ACS`,
        text: `Admin ${admin.firstName} has chosen wire transfer. \n Please follow up. \nId: ${admin._id}\nBusiness Name: ${admin.businessName} Phone: ${admin.phone} \nEmail: ${admin.email}`,
        };

        // Send the email
        await transporter.sendMail(mailOptions);
        
      res.status(200).json({ message: 'Superadmin notified.' }); 
    } catch (error) {
      console.error('Error notifying about wire transfer:', error);
      res.status(500).json({ error: 'Error processing request' }); 
    }
  });

  // Route to add a new user
router.post('/users/add', auth, async (req, res) => {
    try {
        const adminId = req.body.adminId;
        const { firstName, lastName, email, password,phone } = req.body.formData;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            phone: phone,
            password: hashedPassword,
            adminId: adminId,
        });

        // Save the new user
        const savedUser = await newUser.save();

        // Update the admin's users array
        await Admin.findByIdAndUpdate(adminId, { $push: { users: savedUser._id } });

        res.status(201).json({ message: 'User created successfully', user: savedUser });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ error: 'Error creating user' });
    }
});

// Route to get a specific user by ID (for editing)
router.get('/users/:userId', auth, async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).json({ error: 'Error fetching user' });
    }
  });
  
  // Route to update a user
  router.put('/users/:userId', auth, async (req, res) => {
      try {
          const userId = req.params.userId;
          const updatedUserData = req.body;
  
          // Exclude password if not provided
          if (!updatedUserData.password) {
            delete updatedUserData.password;
          } else {
            // Hash password if provided
            const salt = await bcrypt.genSalt(10);
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, salt);
          }
  
          // Find and update the user
          const user = await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
  
          if (!user) {
              return res.status(404).json({ error: 'Utilisateur non trouvé' });
          }
  
          res.status(200).json({ message: 'Utilisateur mis à jour', user });
  
      } catch (err) {
          console.error('Erreur lors de la mise à jour de l\'utilisateur:', err);
          res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'utilisateur' });
      }
  });

  router.put('/profile', auth, async (req, res) => {
    try {
      const userId = req.body.userId;
      const updatedData = req.body;

      // Exclude password if not provided
      if (!updatedData.password) {
        delete updatedData.password;
      } else {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(updatedData.password, salt);
      }

      const updatedUser = await Admin.findByIdAndUpdate(userId, updatedData);

      if (!updatedUser) {
        return res.status(404).json({ error: 'Admin not found' });
      }

      res.status(200).json({ message: 'Profile updated successfully!', user: updatedUser });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Error updating profile' });
    }

  }
  );

// Route pour append du history
router.get('/form-history', async (req, res) => {
  try {
    
    // Fetch all history entries 
    const history = await FormHistory.find().populate('userId').sort({ timestamp: -1 });

    res.status(200).json(history);
  } catch (err) {
    console.error('Error fetching form history:', err);
    res.status(500).json({ error: 'Error fetching form history' });
  }
});

  

  
module.exports = router;