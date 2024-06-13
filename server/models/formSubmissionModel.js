const mongoose = require('mongoose');
const { Schema } = mongoose;

// Auto Increment Plugin
const autoIncrement = require('mongoose-sequence')(mongoose);

const formSubmissionSchema = new Schema({
    numId: { type: Number, required: true },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    formData: { type: Object, required: true }, 
    dateSubmitted: { type: Date, default: Date.now }
});

// Use the plugin
formSubmissionSchema.plugin(autoIncrement, { inc_field: 'NumId' });

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;