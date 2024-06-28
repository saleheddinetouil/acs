const mongoose = require('mongoose');
const { Schema } = mongoose;

// Auto Increment Plugin
const autoIncrement = require('mongoose-sequence')(mongoose);

const formSubmissionSchema = new Schema({
    numId: { type: Number },
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lastEditedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    formData: { type: Object, required: true }, 
    dateSubmitted: { type: Date, default: Date.now }}
    , { timestamps: true });

// Use the plugin
formSubmissionSchema.plugin(autoIncrement, { inc_field: 'numId' });

const FormSubmission = mongoose.model('FormSubmission', formSubmissionSchema);

module.exports = FormSubmission;