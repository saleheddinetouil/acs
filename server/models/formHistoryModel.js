const mongoose = require('mongoose');
const { Schema } = mongoose;

const formHistorySchema = new Schema({
    formSubmissionId: { type: Schema.Types.ObjectId, ref: 'FormSubmission', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // User who made the change
    adminId: { type: Schema.Types.ObjectId, ref: 'Admin' }, // If applicable
    action: { 
        type: String, 
        enum: ['created', 'updated', 'deleted'], 
        required: true 
    },
    timestamp: { type: Date, default: Date.now },
    originalData: { type: Object }, // Optional: Store the original data before the change (for updates)
    updatedData: { type: Object }  // Optional: Store the updated data after the change
});

const FormHistory = mongoose.model('FormHistory', formHistorySchema);
module.exports = FormHistory; 