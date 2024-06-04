const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Admin = require('../models/adminModel');
const SuperAdmin = require('../models/superAdminModel');
const dotenv = require('dotenv');
dotenv.config();

const auth = async (req, res, next) => {
    try {
        // Vérifier si le token est présent dans l'en-tête
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ error: 'Authentification requise' });
        }

        // Décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Trouver l'utilisateur ou l'admin ou le super admin correspondant au token
        if (decoded.userId) {
            req.user = await User.findById(decoded.userId);
            if (!req.user) {
                return res.status(401).json({ error: 'Authentification requise' });
            }
        } else if (decoded.adminId) {
            req.admin = await Admin.findById(decoded.adminId);
            if (!req.admin) {
                return res.status(401).json({ error: 'Authentification requise' });
            }
        } else if (decoded.superAdminId) {
            req.superAdmin = await SuperAdmin.findById(decoded.superAdminId);
            if (!req.superAdmin) {
                return res.status(401).json({ error: 'Authentification requise' });
            }
        } else {
            return res.status(401).json({ error: 'Authentification requise' });
        }

        next();

    } catch (err) {
        console.error('Erreur d\'authentification:', err);
        res.status(401).json({ error: 'Authentification requise' });
    }
};

module.exports = auth;