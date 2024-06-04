const express = require('express');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');



// Configuration de dotenv
dotenv.config();

// Importation des routes
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const superAdminRoutes = require('./routes/superAdminRoutes');
const authRoutes = require('./routes/authRoutes');


// Configuration de l'application Express
const app = express();
const port = process.env.PORT || 5000;

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à la base de données réussie'))
    .catch((err) => console.error('Erreur de connexion à la base de données:', err));


// Configuration de CORS
app.use(cors());

// Configuration de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/', require('./routes/miscRoutes'));
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/superadmin', superAdminRoutes);

app.use('/auth', authRoutes);


// Serveur static pour React
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client', 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    });
}

// Démarrage du serveur
app.listen(port, () => {
    console.log(`Serveur en écoute sur le port ${port}`);
});