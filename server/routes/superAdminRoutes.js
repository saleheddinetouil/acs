const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SuperAdmin = require('../models/superAdminModel');
const Admin = require('../models/adminModel');
const auth = require('../middleware/auth');
const mongoose = require('mongoose');

// Route pour avoir les informations du super admin
router.get('/', auth, async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the token
        const superAdminId = decoded.superAdminId;  // Assuming your token has superAdminId
        const superAdmin = await SuperAdmin.findById(superAdminId);

        if (!superAdmin) {
            return res.status(404).json({ error: 'Super admin non trouvé' });
        }

        res.status(200).json(superAdmin);
    
    } catch (err) {
        console.error('Erreur lors de la récupération du super admin:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération du super admin' });
    }
});



// Route pour l'inscription du super admin
router.post('/register', async (req, res) => {
    try {
        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Création du nouveau super admin
        const newSuperAdmin = new SuperAdmin({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hashedPassword,
        });

        // Enregistrement du nouveau super admin
        const superAdmin = await newSuperAdmin.save();

        // Générer le token JWT
        const token = jwt.sign({ superAdminId: superAdmin._id }, process.env.JWT_SECRET);

        res.status(201).json({ token, superAdminId: superAdmin._id });

    } catch (err) {
        console.error('Erreur lors de l\'inscription du super admin:', err);
        res.status(500).json({ error: 'Erreur lors de l\'inscription du super admin' });
    }
});



// Route pour obtenir les admins du super admin
router.get('/admins', auth, async (req, res) => {
    try {
        const admins = await Admin.find({ });

        res.status(200).json(admins);

    } catch (err) {
        console.error('Erreur lors de la récupération des admins:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des admins' });
    }

});

// Route pour créer un admin
router.post('/admins/add', auth, async (req, res) => {
    try {
        const superAdminId = req.superAdmin.superAdminId;

        // Hash du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Créer le nouvel admin
        const newAdmin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            businessName: req.body.businessName,
            email: req.body.email,
            password: hashedPassword,

        });

        // Enregistrer le nouvel admin
        const admin = await newAdmin.save();

        // Ajouter l'admin au super admin
        const superAdmin = await SuperAdmin.findByIdAndUpdate(superAdminId, { $push: { admins: admin._id } }, { new: true });

        res.status(201).json(admin);

    } catch (err) {
        console.error('Erreur lors de la création de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'admin' });
    }
});

// Route pour obtenir un admin
router.get('/admins/:adminId', auth, async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const admin = await Admin.findById(adminId);

        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.status(200).json(admin);

    } catch (err) {
        console.error('Erreur lors de la récupération de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de l\'admin' });
    }
});


// Route pour mettre à jour un admin
router.put('/admins/:adminId', auth, async (req, res) => {
    try {
        const adminId = req.params.adminId;
        const updatedAdminData = req.body;

        // Trouver et mettre à jour l'admin
        const admin = await Admin.findByIdAndUpdate(adminId, updatedAdminData, { new: true });

        if (!admin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }

        res.status(200).json(admin);

    } catch (err) {
        console.error('Erreur lors de la mise à jour de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour de l\'admin' });
    }
});

// Route pour supprimer un admin
router.delete('/admins/:adminId', auth, async (req, res) => {
    try {
        const adminId = req.params.adminId;

        // Trouver et supprimer l'admin
        const deletedAdmin = await Admin.findByIdAndDelete(adminId);

        if (!deletedAdmin) {
            return res.status(404).json({ error: 'Admin non trouvé' });
        }
        
        res.status(200).json({ message: 'Admin supprimé' });

    } catch (err) {
        console.error('Erreur lors de la suppression de l\'admin:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'admin' });
    }
});

// route pour profile edit
router.put('/profile', auth, async (req, res) => {
    try {
        const superAdminId = req.body.superAdminId;
        const updatedData = req.body;

        // Trouver et mettre à jour le super admin
        const superAdmin = await SuperAdmin.findByIdAndUpdate(superAdminId, updatedData, { new: true });

        if (!superAdmin) {
            return res.status(404).json({ error: 'Super admin non trouvé' });
        }

        res.status(200).json(superAdmin);

    } catch (err) {
        console.error('Erreur lors de la mise à jour du super admin:', err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du super admin' });
    }
});



module.exports = router;