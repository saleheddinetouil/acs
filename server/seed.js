// SEED DB FILE
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/adminModel');
const SuperAdmin = require('./models/superAdminModel');
const User = require('./models/userModel');

const seed = async () => {
    try {
        // Connexion à la base de données
        await mongoose.connect("mongodb://localhost:27017/acs-qms"
        , {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Supprimer toutes les données de la base de données
        await Admin.deleteMany({});
        await SuperAdmin.deleteMany({});
        await User.deleteMany({});
        

        // Création du super admin
        const superAdmin = new SuperAdmin({
            firstName: 'Super',
            lastName: 'Admin',
            email: 'superadmin@acs.tn',
            password: await bcrypt.hash('superadmin', 10)
        });
        await superAdmin.save();

        // Création d'un admin
        const admin = new Admin({
            firstName: 'Admin',
            lastName: 'Admin',
            phone: '12345678',
            businessName: 'Business',
            email: 'admin@business.tn',
            password: await bcrypt.hash('admin', 10)
        });
        await admin.save();

        // Création d'un utilisateur
        const user = new User({
            firstName: 'User',
            lastName: 'User',
            phone: '12345678',
            email: 'user@business.tn',
            password: await bcrypt.hash('user', 10),
            adminId: admin._id,
            businessName: admin.businessName
        });
        await user.save();

        // Déconnexion de la base de données
        await mongoose.disconnect();
    
    } catch (err) {
        console.error('Erreur de seed:', err);
    }
}

seed();

