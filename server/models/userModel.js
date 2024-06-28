const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }, 
    businessName: { type: String , ref: 'Admin' },
    formSubmissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FormSubmission' }] 
});

const User = mongoose.model('User', userSchema);

module.exports = User;