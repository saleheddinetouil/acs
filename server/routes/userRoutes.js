const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const FormSubmission = require('../models/formSubmissionModel');
const auth = require('../middleware/auth');

// Get Current User
router.get('/', async (req, res) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.userId });

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    }
    catch (err) {
        console.error('Erreur lors de la récupération de lutilisateur:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de lutilisateur' });
    }
});


// Route pour la connexion des utilisateurs
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérification du mot de passe
        const isValidPassword = await bcrypt.compare(req.body.password, user.password);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Générer le token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(200).json({ token, userId: user._id });

    } catch (err) {
        console.error('Erreur lors de la connexion:', err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
});

// Route pour obtenir les soumissions de formulaire d'un utilisateur
router.post('/forms', async (req, res) => {
    try {
        const adminId = req.body.adminId;

        // Trouver les soumissions de formulaire de l'utilisateur
        const formSubmissions = await FormSubmission.find({  adminId: adminId });

        res.status(200).json(formSubmissions);



    } catch (err) {
        console.error('Erreur lors de la récupération des soumissions:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération des soumissions' });
    }
});

// Route pour soumettre un formulaire
router.post('/submit-form', async (req, res) => {
    try {
    const userId = req.body.userId;
    const adminId = req.body.adminId;
    const formData = req.body.formData;
    // Créer la soumission du formulaire
        const newFormSubmission = new FormSubmission({
            adminId: adminId,
            userId: userId,
            lastEditedBy: userId,
            formData,
        });
    
        // Enregistrer la soumission
        const formSubmission = await newFormSubmission.save();

        res.status(201).json(formSubmission);
    
    } catch (err) {
        console.error('Erreur lors de la soumission du formulaire:', err);
        res.status(500).json({ error: 'Erreur lors de la soumission du formulaire' });
    }
});
// Route pour modifier une soumission de formulaire
router.put('/update-form/:formSubmissionId', async (req, res) => {
    try {
        const formSubmissionId = req.params.formSubmissionId;
        const updatedFormData = req.body.formData;

        // Trouver la soumission du formulaire
        const formSubmission = await FormSubmission.findByIdAndUpdate(formSubmissionId, { formData: updatedFormData }, { new: true });

        if (!formSubmission) {
            return res.status(404).json({ error: 'Soumission de formulaire non trouvée' });
        }

        res.status(200).json(formSubmission);

    } catch (err) {
        console.error('Erreur lors de la modification du formulaire:', err);
        res.status(500).json({ error: 'Erreur lors de la modification du formulaire' });
    }
});

// Route pour supprimer une soumission de formulaire
router.delete('/delete-form/:formSubmissionId', async (req, res) => {
    try {
        const formSubmissionId = req.params.formSubmissionId;

        // Trouver et supprimer la soumission du formulaire
        const deletedFormSubmission = await FormSubmission.findByIdAndDelete(formSubmissionId);

        if (!deletedFormSubmission) {
            return res.status(404).json({ error: 'Soumission de formulaire non trouvée' });
        }

        // Retirer la soumission de l'utilisateur
        const user = await User.findOneAndUpdate(deletedFormSubmission.userId, { $pull: { formSubmissions: formSubmissionId } });

        res.status(200).json({ message: 'Soumission de formulaire supprimée' });

    } catch (err) {
        console.error('Erreur lors de la suppression du formulaire:', err);
        res.status(500).json({ error: 'Erreur lors de la suppression du formulaire' });
    }
});
// get /forms:id 
router.get('/forms/:formId', async (req, res) => {
    try {
        const formId = req.params.formId;

        const formSubmission = await FormSubmission.findById(formId);

        if (!formSubmission) {
            return res.status(404).json({ error: 'Soumission de formulaire non trouvée' });
        }

        res.status(200).json(formSubmission);

    } catch (err) {
        console.error('Erreur lors de la récupération de la soumission:', err);
        res.status(500).json({ error: 'Erreur lors de la récupération de la soumission' });
    }
});

// Route effacer un form 
router.delete('/forms/:formId', async (req,res) => {
    try {
        const formId = req.params.formId;

        const formSubmission = await FormSubmission.findByIdAndDelete(formId);

        if (!formSubmission) {
            return res.status(404).json({ error: 'Soumission de formulaire non trouvée' });
        }

        res.status(200).json({ message: 'Soumission de formulaire supprimée' });

    } catch (error) {
        res.status(500).json({error:''})
    }
});

// Delete all forms
router.delete('/forms', async (req, res) => {
    try {
        await FormSubmission.deleteMany({});

        res.status(200).json({ message: 'All form submissions deleted' });

    } catch (err) {
        console.error('Error deleting form submissions:', err);
        res.status(500).json({ error: 'Error deleting form submissions' });
    }
});


// edit user profile
router.put('/profile', auth, async (req, res) => {
    try {
      const userId = req.user._id; 
      const updatedData = req.body;
  
      // Exclude password if not provided
      if (!updatedData.password) {
        delete updatedData.password;
      } else {
        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        updatedData.password = await bcrypt.hash(updatedData.password, salt);
      }
  
      const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', user: updatedUser }); 
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ error: 'Error updating profile' }); 
    }
  });
  

module.exports = router;
