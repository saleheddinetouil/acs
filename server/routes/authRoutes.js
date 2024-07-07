const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const SuperAdmin = require('../models/superAdminModel');

// Route pour avoir le role de l'utilisateur à partir d'adresse email
router.post('/role', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(200).json({ role: 'user' });
        }

        let admin = await Admin.findOne({ email: req.body.email });

        if (admin) {
            return res.status(200).json({ role: 'admin' });
        }

        let superAdmin = await SuperAdmin.findOne({ email : req.body.email });

        if (superAdmin) {
            return res.status(200).json({ role: 'superadmin' });
        }

        res.status(404).json({ error: 'Utilisateur non trouvé' });
    } catch (err) {
        console.error('Erreur lors de la recherche du rôle:', err);
        res.status(500).json({ error: 'Erreur lors de la recherche du rôle' });
    }
});


// Route pour la connexion des utilisateurs
router.post('/user', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        

        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ userId: user._id
         }, process.env.JWT_SECRET);

        res.status(200).json({ token, userId: user._id , role:"user"});

    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Route pour la connexion des admins
router.post('/admin', async (req, res) => {
    try {
        let admin = await Admin.findOne
        ({ email: req.body.email });
        if (!admin) {
            return res.status(401).json({ error: 'Admin non trouvé' });
        }


        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(req.body.password, admin.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ adminId: admin._id
         }, process.env.JWT_SECRET);
        
        res.status(200).json({ token, adminId: admin._id , role:'admin'});

    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
}
);

// Route pour la connexion des superadmins
router.post('/superadmin', async (req, res) => {
    try {
        let superAdmin = await SuperAdmin.findOne({ email: req
        .body.email });
        if (!superAdmin) {
            return res.status(401).json({ error: 'SuperAdmin non trouvé' });
        }

        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(req.body.password, superAdmin.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ superAdminId: superAdmin._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, superAdminId: superAdmin._id , role:'superadmin'});
    
    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
}
);

// signup route for admins only admins can create their own accounts
router.post('/signup', async (req, res) => {
    try {
        let admin = await Admin.findOne({ email: req.body.email });
        if (admin) {
            return res.status(400).json({ error: 'Admin existe déjà' });
        }

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Créer un nouvel admin
        admin = new Admin({
            _id: new mongoose.Types.ObjectId(),
            firstName: req.body.name,
            lastName: req.body.lname,
            businessName: req.body.bname,
            email: req.body.email,
            phone: req.body.phone,
            password: hashedPassword
        });

        console.log(admin);
        await admin.save();

        // Générer le token JWT
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET);

        // Répondre avec le token
        res.status(201).json({ token, adminId: admin._id });

    } catch (err) {
        console.error('Erreur lors de la création du compte:', err);
        res.status(500).json({ error: 'Erreur lors de la création du compte' });
    }
}
);







module.exports = router;
