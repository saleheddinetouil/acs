const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    formData: { type: Object, required: true }, // Contient les données du formulaire QMS
    dateSubmitted: { type: Date, default: Date.now }
});

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;